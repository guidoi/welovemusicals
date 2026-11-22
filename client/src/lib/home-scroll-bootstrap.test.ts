import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const script = html.match(/<script id="home-scroll-bootstrap">([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error("Home scroll bootstrap missing");

const LEGACY_POSITION_KEY = "wlm-home-reload-position-v1";
type Listener = (event: Record<string, unknown>) => void;
type BootstrapOptions = {
  search?: string;
  initialScrollY?: number;
  navigationType?: "navigate" | "reload" | "back_forward";
  storage?: Map<string, string>;
  storageBlocked?: boolean;
  history?: Partial<Pick<History, "scrollRestoration">> | null;
};

function start(pathname = "/", hash = "", options: BootstrapOptions = {}) {
  vi.useFakeTimers();
  const listeners = new Map<string, Listener[]>();
  const storage = options.storage ?? new Map<string, string>();
  let scrollY = options.initialScrollY ?? 60;
  const storageAccess = vi.fn(() => {
    if (options.storageBlocked) throw new Error("Storage access blocked");
    return sessionStorage;
  });
  const sessionStorage = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    key: vi.fn((index: number) => [...storage.keys()][index] ?? null),
  };
  const addEventListener = vi.fn((name: string, listener: Listener) => {
    listeners.set(name, [...(listeners.get(name) ?? []), listener]);
  });
  const removeEventListener = vi.fn();
  const timers = {
    setTimeout: vi.fn(setTimeout),
    clearTimeout: vi.fn(clearTimeout),
    setInterval: vi.fn(setInterval),
    clearInterval: vi.fn(clearInterval),
    requestAnimationFrame: vi.fn((callback: () => void) => setTimeout(callback, 16)),
    cancelAnimationFrame: vi.fn(clearTimeout),
    queueMicrotask: vi.fn(queueMicrotask),
  };
  const scrollTo = vi.fn((value: ScrollToOptions) => { scrollY = value.top ?? scrollY; });
  const scroll = vi.fn();
  const scrollBy = vi.fn();
  const performance = {
    getEntriesByType: vi.fn(() => [{ type: options.navigationType ?? "navigate" }]),
  };
  const window = {
    history: options.history === undefined ? { scrollRestoration: "manual" } : options.history,
    location: { pathname, hash, search: options.search ?? "" },
    innerWidth: 390,
    get scrollY() { return scrollY; },
    get sessionStorage() { return storageAccess(); },
    performance,
    addEventListener,
    removeEventListener,
    scrollTo,
    scroll,
    scrollBy,
    ...timers,
  };
  const document = { addEventListener: vi.fn(), removeEventListener: vi.fn() };
  const context = {
    window, document, history: window.history, location: window.location,
    performance, addEventListener, removeEventListener, scrollTo, scroll, scrollBy, ...timers,
  };
  Object.defineProperty(context, "sessionStorage", { get: storageAccess });
  runInNewContext(script!, context);

  return {
    window, document, timers, storage, storageAccess, sessionStorage, listeners,
    fire: (name: string, payload: Record<string, unknown> = {}) => {
      for (const listener of listeners.get(name) ?? []) listener(payload);
    },
    setNativeScrollY: (value: number) => { scrollY = value; },
  };
}

type Environment = ReturnType<typeof start>;

function expectNoApplicationInterference(env: Environment) {
  expect(env.window.scrollTo).not.toHaveBeenCalled();
  expect(env.window.scroll).not.toHaveBeenCalled();
  expect(env.window.scrollBy).not.toHaveBeenCalled();
  expect(env.window.addEventListener).not.toHaveBeenCalled();
  expect(env.window.removeEventListener).not.toHaveBeenCalled();
  expect(env.document.addEventListener).not.toHaveBeenCalled();
  expect(env.document.removeEventListener).not.toHaveBeenCalled();
  expect(env.listeners.size).toBe(0);
  for (const timer of Object.values(env.timers)) expect(timer).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
  expect(env.window.performance.getEntriesByType).not.toHaveBeenCalled();
  expect(env.storageAccess).not.toHaveBeenCalled();
  for (const operation of Object.values(env.sessionStorage)) {
    expect(operation).not.toHaveBeenCalled();
  }
}

function completeNativeLifecycle(env: Environment) {
  env.fire("touchstart", { touches: [{ clientY: 100 }] });
  env.fire("touchmove", { touches: [{ clientY: 160 }] });
  env.fire("touchcancel");
  env.fire("scroll");
  env.fire("pagehide");
  env.fire("load");
  env.fire("pageshow", { persisted: false });
  env.fire("pageshow", { persisted: true });
  for (const event of ["wheel", "pointerdown", "keydown"]) env.fire(event);
  vi.advanceTimersByTime(5000);
}

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("Native Home scroll restoration bootstrap", () => {
  it.each(["", "?category=shows", "?city=hamburg&view=list"])(
    "selects native auto for unanchored Home, independently of query %s",
    (search) => {
      const env = start("/", "", { search });
      expect(env.window.history?.scrollRestoration).toBe("auto");
      expect(env.window.scrollY).toBe(60);
      expectNoApplicationInterference(env);
    },
  );

  it.each([
    ["/", "#more-musicals"],
    ["/", "#"],
    ["/musical/der-kleine-lord", ""],
    ["/musical/der-kleine-lord", "#tickets"],
    ["/stadt/graz", ""],
    ["/stadt/hamburg", "#musicals"],
  ])("selects manual for %s%s without moving the viewport", (pathname, hash) => {
    const env = start(pathname, hash, { history: { scrollRestoration: "auto" } });
    expect(env.window.history?.scrollRestoration).toBe("manual");
    completeNativeLifecycle(env);
    expect(env.window.scrollY).toBe(60);
    expectNoApplicationInterference(env);
  });

  for (const navigationType of ["reload", "navigate", "back_forward"] as const) {
    it.each([0, 60, -20])(
      `does not correct initial/native scrollY=%s during ${navigationType}`,
      (initialScrollY) => {
        const env = start("/", "", { initialScrollY, navigationType });
        expect(env.window.history?.scrollRestoration).toBe("auto");
        expect(env.window.scrollY).toBe(initialScrollY);
        expectNoApplicationInterference(env);
        completeNativeLifecycle(env);
        expect(env.window.scrollY).toBe(initialScrollY);
        for (const nativeTop of [60, 0, -20]) {
          env.setNativeScrollY(nativeTop);
          completeNativeLifecycle(env);
          expect(env.window.scrollY).toBe(nativeTop);
        }
        expectNoApplicationInterference(env);
      },
    );
  }

  it.each([
    ["missing restoration API", {}],
    ["unavailable history", null],
  ] as const)("does not crash or add an API for %s", (_name, history) => {
    const env = start("/", "", { history });
    expect(env.window.history).toBe(history);
    if (history) expect(history).not.toHaveProperty("scrollRestoration");
    completeNativeLifecycle(env);
    expect(env.window.scrollY).toBe(60);
    expectNoApplicationInterference(env);
  });

  it("does not crash when an existing restoration API rejects assignments", () => {
    const history = Object.defineProperty({}, "scrollRestoration", {
      get: () => "auto",
      set: () => { throw new Error("Restoration API blocked"); },
    });
    const env = start("/stadt/graz", "", { history });
    expect(env.window.scrollY).toBe(60);
    expectNoApplicationInterference(env);
  });
});

describe("Legacy position storage is ignored, not cleaned up", () => {
  const legacyValues = [
    ["old top", JSON.stringify({ url: "/", width: 390, top: 0 })],
    ["old offset", JSON.stringify({ url: "/", width: 390, top: 60 })],
    ["old negative overscroll", JSON.stringify({ url: "/", width: 390, top: -20 })],
    ["different URL and viewport", JSON.stringify({ url: "/?category=shows", width: 412, top: 240 })],
    ["malformed JSON", "{broken"],
  ];

  for (const navigationType of ["reload", "navigate", "back_forward"] as const) {
    it.each(legacyValues)(`leaves %s untouched during ${navigationType}`, (_name, value) => {
      const storage = new Map([[LEGACY_POSITION_KEY, value], ["unrelated", "keep"]]);
      const original = [...storage];
      const env = start("/", "", { storage, navigationType, initialScrollY: 60 });
      completeNativeLifecycle(env);
      expect(env.window.history?.scrollRestoration).toBe("auto");
      expect(env.window.scrollY).toBe(60);
      expect([...storage]).toEqual(original);
      expectNoApplicationInterference(env);
    });
  }

  it("never accesses sessionStorage, even when its getter would throw", () => {
    const env = start("/", "", { storageBlocked: true, navigationType: "reload" });
    completeNativeLifecycle(env);
    expect(env.window.history?.scrollRestoration).toBe("auto");
    expect(env.window.scrollY).toBe(60);
    expectNoApplicationInterference(env);
  });
});
