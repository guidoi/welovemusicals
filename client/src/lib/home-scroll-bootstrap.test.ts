import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const script = html.match(/<script id="home-scroll-bootstrap">([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error("Home scroll bootstrap missing");

const POSITION_KEY = "wlm-home-reload-position-v1";
const INITIAL_TIME = new Date("2026-11-22T12:00:00Z");
type ScrollOptions = { top: number; left: number; behavior: string };
type EventPayload = { touches?: { clientY: number }[]; persisted?: boolean };
type Listener = (event: EventPayload) => void;
type ListenerOptions = { once?: boolean; passive?: boolean };
type StoredPosition = { url: string; width: number; top: number };
type BootstrapOptions = {
  search?: string;
  width?: number;
  initialScrollY?: number;
  navigationType?: string | null;
  storage?: Map<string, string>;
  storageBlocked?: "read" | "write" | "both";
};

function stored(top: number, overrides: Partial<StoredPosition> = {}) {
  return new Map([[POSITION_KEY, JSON.stringify({ url: "/", width: 390, top, ...overrides })]]);
}

function start(pathname = "/", hash = "", options: BootstrapOptions = {}) {
  if (!vi.isFakeTimers()) {
    vi.useFakeTimers();
    vi.setSystemTime(INITIAL_TIME);
  }
  const listeners = new Map<string, Map<Listener, ListenerOptions>>();
  const calls: ScrollOptions[] = [];
  const storage = options.storage ?? new Map<string, string>();
  let scrollY = options.initialScrollY ?? 48;
  const window = {
    history: { scrollRestoration: "auto" },
    location: { pathname, hash, search: options.search ?? "" },
    innerWidth: options.width ?? 390,
    get scrollY() { return scrollY; },
    sessionStorage: {
      getItem: vi.fn((key: string) => {
        if (options.storageBlocked === "read" || options.storageBlocked === "both") {
          throw new Error("Storage read blocked");
        }
        return storage.get(key) ?? null;
      }),
      setItem: vi.fn((key: string, value: string) => {
        if (options.storageBlocked === "write" || options.storageBlocked === "both") {
          throw new Error("Storage write blocked");
        }
        storage.set(key, value);
      }),
    },
    performance: {
      getEntriesByType: vi.fn((type: string) =>
        type !== "navigation" || options.navigationType === null
          ? []
          : [{ type: options.navigationType ?? "navigate" }],
      ),
    },
    setTimeout,
    clearTimeout,
    requestAnimationFrame: (fn: () => void) => setTimeout(fn, 16),
    cancelAnimationFrame: clearTimeout,
    addEventListener: (name: string, fn: Listener, listenerOptions: ListenerOptions = {}) => {
      if (!listeners.has(name)) listeners.set(name, new Map());
      // DOM listeners are keyed by callback identity; re-registering does not duplicate them.
      if (!listeners.get(name)!.has(fn)) listeners.get(name)!.set(fn, listenerOptions);
    },
    removeEventListener: (name: string, fn: Listener) => listeners.get(name)?.delete(fn),
    scrollTo: (scrollOptions: ScrollOptions) => {
      calls.push(scrollOptions);
      scrollY = scrollOptions.top;
    },
  };
  const fire = (name: string, payload: EventPayload = {}) => {
    for (const [fn, listenerOptions] of [...(listeners.get(name) ?? [])]) {
      // A previous callback may remove a later listener while dispatching this event.
      if (!listeners.get(name)?.has(fn)) continue;
      if (listenerOptions.once) listeners.get(name)?.delete(fn);
      fn(payload);
    }
  };
  // VM contexts otherwise have their own real Date; the pull expiry must use fake time too.
  runInNewContext(script!, { window, Date });
  return {
    window, calls, fire, listeners, storage,
    get scrollY() { return scrollY; },
    get position(): StoredPosition | null {
      return JSON.parse(storage.get(POSITION_KEY) ?? "null");
    },
    setScrollY: (value: number) => { scrollY = value; },
    restore: (value: number) => { scrollY = value; fire("scroll"); },
    touch: (name: "touchstart" | "touchmove", clientY: number) => {
      fire(name, { touches: [{ clientY }] });
    },
  };
}

type Environment = ReturnType<typeof start>;

function expectProtectionReleased(env: Environment) {
  const protectionNames = new Set(["lockHomeScroll", "onHomeReady", "stopHomeScrollProtection"]);
  const protectionListeners = [...env.listeners.values()]
    .flatMap((entries) => [...entries.keys()])
    .filter((listener) => protectionNames.has(listener.name));
  expect(protectionListeners).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
}

function finishLoading(env: Environment) {
  env.fire("load");
  env.fire("pageshow", { persisted: false });
  vi.advanceTimersByTime(1001);
  expectProtectionReleased(env);
}

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("Finite Home reload restoration without changing hero geometry", () => {
  it("resets immediately and explicitly bypasses global CSS smooth scrolling", () => {
    const env = start();
    expect(env.scrollY).toBe(0);
    expect(env.window.history.scrollRestoration).toBe("manual");
    vi.advanceTimersByTime(600);
    expect(env.calls.length).toBeGreaterThan(1);
    for (const call of env.calls) {
      expect(call).toEqual({ top: 0, left: 0, behavior: "instant" });
    }
  });

  it("restarts the same finite protection after slow load/pageshow, not just HTML parsing", () => {
    const env = start();
    vi.advanceTimersByTime(2000);
    env.fire("load");
    vi.advanceTimersByTime(1);
    env.fire("pageshow");
    vi.advanceTimersByTime(750);
    env.restore(48);
    expect(env.scrollY).toBe(0);
    vi.advanceTimersByTime(300);
    const count = env.calls.length;
    env.restore(120);
    expect(env.scrollY).toBe(120);
    expect(env.calls).toHaveLength(count);
    expectProtectionReleased(env);
  });

  it.each(["touchstart", "wheel", "pointerdown", "keydown"])(
    "stops protection immediately for user %s and never rearms on later lifecycle events",
    (event) => {
      const env = start();
      vi.advanceTimersByTime(50);
      env.fire(event, event === "touchstart" ? { touches: [{ clientY: 100 }] } : {});
      const count = env.calls.length;
      expectProtectionReleased(env);
      env.restore(120);
      env.fire("load");
      env.fire("pageshow");
      vi.advanceTimersByTime(3000);
      expect(env.scrollY).toBe(120);
      expect(env.calls).toHaveLength(count);
      expectProtectionReleased(env);
      // Permanent position-recording listeners are deliberately not removed with protection.
      expect(env.listeners.get("scroll")?.size).toBe(1);
      expect(env.listeners.get("pagehide")?.size).toBe(1);
      expect(env.listeners.get("touchstart")?.size).toBe(1);
    },
  );

  it("abandons pending resets when an anchor is selected during loading", () => {
    const env = start();
    vi.advanceTimersByTime(50);
    env.window.location.hash = "#more-musicals";
    const count = env.calls.length;
    env.restore(600);
    env.fire("load");
    env.fire("pageshow");
    vi.advanceTimersByTime(2000);
    expect(env.scrollY).toBe(600);
    expect(env.calls).toHaveLength(count);
    expectProtectionReleased(env);
  });

  it("abandons pending resets when routing away from Home", () => {
    const env = start();
    env.window.location.pathname = "/musical/der-kleine-lord";
    const count = env.calls.length;
    vi.advanceTimersByTime(500);
    env.restore(200);
    env.fire("load");
    expect(env.scrollY).toBe(200);
    expect(env.calls).toHaveLength(count);
    expectProtectionReleased(env);
  });

  it.each([["/", "#musicals"], ["/musical/der-kleine-lord", ""]])(
    "never forces an initial anchored or detail URL to Home (%s%s)",
    (pathname, hash) => {
      const env = start(pathname, hash);
      env.fire("load");
      env.fire("pageshow");
      vi.advanceTimersByTime(3000);
      expect(env.calls).toEqual([]);
      expect(env.scrollY).toBe(48);
      expectProtectionReleased(env);
    },
  );

  it("corrects a synthetic negative overscroll only during its finite restore phase", () => {
    const env = start();
    env.restore(-32);
    expect(env.scrollY).toBe(0);
    vi.advanceTimersByTime(1001);
    env.restore(-32);
    expect(env.scrollY).toBe(-32);
  });
});

describe("Stored reload positions and finite lifecycle corrections", () => {
  it("preserves stored 60 immediately, through slow load and a late erroneous native restore", () => {
    const storage = stored(60);
    const env = start("/", "", { storage, navigationType: "reload" });
    expect(env.scrollY).toBe(60);
    expect(env.window.performance.getEntriesByType).toHaveBeenCalledWith("navigation");
    expect(env.position).toEqual({ url: "/", width: 390, top: 60 });

    env.restore(0);
    expect(env.scrollY).toBe(60);
    vi.advanceTimersByTime(2000);
    expect(vi.getTimerCount()).toBe(0);
    env.setScrollY(0);
    env.fire("load");
    expect(env.scrollY).toBe(60);
    vi.advanceTimersByTime(250);
    env.setScrollY(240);
    env.fire("pageshow", { persisted: false });
    expect(env.scrollY).toBe(60);
    vi.advanceTimersByTime(750);
    env.restore(240);
    expect(env.scrollY).toBe(60);
    expect(env.position?.top).toBe(60);
    expect(env.calls.length).toBeGreaterThan(4);
    expect(env.calls.every((call) => call.top === 60 && call.behavior === "instant")).toBe(true);

    vi.advanceTimersByTime(251);
    expectProtectionReleased(env);
    const count = env.calls.length;
    env.restore(120);
    expect(env.scrollY).toBe(120);
    expect(env.calls).toHaveLength(count);
    expect(env.position?.top).toBe(120);
  });

  it.each(["navigate", "back_forward", null])(
    "ignores stored 60 unless navigation is a genuine reload (%s)",
    (navigationType) => {
      const env = start("/", "", { storage: stored(60), navigationType });
      expect(env.scrollY).toBe(0);
      finishLoading(env);
      expect(env.position?.top).toBe(0);
      expect(env.calls.every((call) => call.top === 0)).toBe(true);
    },
  );

  it("immediately replaces stale 60 on a new visit so a quick subsequent reload starts at zero", () => {
    const storage = stored(60);
    const visit = start("/", "", { storage, navigationType: "navigate" });
    expect(visit.scrollY).toBe(0);
    expect(visit.position).toEqual({ url: "/", width: 390, top: 0 });
    expect(Date.now()).toBe(INITIAL_TIME.getTime());
    // Neither load/pageshow nor a scroll event occurred before the reload was requested.
    visit.fire("wheel");
    expectProtectionReleased(visit);
    const reload = start("/", "", { storage, navigationType: "reload" });
    expect(reload.scrollY).toBe(0);
    finishLoading(reload);
    expect(reload.position?.top).toBe(0);
  });

  it.each([
    ["missing", null],
    ["malformed JSON", "{broken"],
    ["negative", JSON.stringify({ url: "/", width: 390, top: -60 })],
    ["wrong URL", JSON.stringify({ url: "/?category=shows", width: 390, top: 60 })],
    ["wrong width", JSON.stringify({ url: "/", width: 393, top: 60 })],
    ["positive infinity", '{"url":"/","width":390,"top":1e309}'],
    ["negative infinity", '{"url":"/","width":390,"top":-1e309}'],
    ["NaN literal", '{"url":"/","width":390,"top":NaN}'],
    ["string top", JSON.stringify({ url: "/", width: 390, top: "60" })],
    ["null top", JSON.stringify({ url: "/", width: 390, top: null })],
    ["missing top", JSON.stringify({ url: "/", width: 390 })],
  ])("falls back to zero for invalid storage: %s", (_name, value) => {
    const storage = new Map<string, string>();
    if (value !== null) storage.set(POSITION_KEY, value);
    const env = start("/", "", { storage, navigationType: "reload" });
    expect(env.scrollY).toBe(0);
    expect(env.calls).toEqual([{ top: 0, left: 0, behavior: "instant" }]);
    finishLoading(env);
    expect(env.position).toEqual({ url: "/", width: 390, top: 0 });
  });

  it.each(["read", "both"] as const)("falls back to zero when storage access is blocked (%s)", (storageBlocked) => {
    const env = start("/", "", { storage: stored(60), navigationType: "reload", storageBlocked });
    expect(env.scrollY).toBe(0);
    expect(() => finishLoading(env)).not.toThrow();
    expect(() => env.restore(120)).not.toThrow();
    expect(() => env.fire("pagehide")).not.toThrow();
    expect(env.scrollY).toBe(120);
    expectProtectionReleased(env);
  });

  it("preserves a valid reload even when subsequent storage writes are blocked", () => {
    const env = start("/", "", {
      storage: stored(60), navigationType: "reload", storageBlocked: "write",
    });
    expect(env.scrollY).toBe(60);
    expect(() => finishLoading(env)).not.toThrow();
    expect(() => env.restore(120)).not.toThrow();
    expect(() => env.fire("pagehide")).not.toThrow();
    expectProtectionReleased(env);
  });

  it("matches both the current query and viewport width for a reload", () => {
    const env = start("/", "", {
      search: "?category=shows", width: 412, navigationType: "reload",
      storage: stored(60, { url: "/?category=shows", width: 412 }),
    });
    expect(env.scrollY).toBe(60);
    finishLoading(env);
    expect(env.position).toEqual({ url: "/?category=shows", width: 412, top: 60 });
  });

  it("starts a first visit at zero and retains recorded positions over repeated reloads", () => {
    const storage = new Map<string, string>();
    const first = start("/", "", { storage });
    expect(first.scrollY).toBe(0);
    finishLoading(first);
    expect(first.position?.top).toBe(0);

    const atTop = start("/", "", { storage, navigationType: "reload" });
    expect(atTop.scrollY).toBe(0);
    finishLoading(atTop);
    atTop.restore(60);
    atTop.fire("pagehide");
    expect(atTop.position?.top).toBe(60);

    for (let reload = 0; reload < 3; reload++) {
      const env = start("/", "", { storage, navigationType: "reload", initialScrollY: 0 });
      expect(env.scrollY).toBe(60);
      finishLoading(env);
      env.fire("pagehide");
      expect(env.position?.top).toBe(60);
    }
  });

  it.each([
    ["anchor", "hash", "#more-musicals"],
    ["query", "search", "?category=shows"],
    ["path", "pathname", "/musical/der-kleine-lord"],
  ] as const)("clears pending reload resets after a %s change and records only the current unanchored Home URL", (_name, field, value) => {
    const env = start("/", "", { storage: stored(60), navigationType: "reload" });
    env.window.location[field] = value;
    env.setScrollY(600);
    const count = env.calls.length;
    // No scroll/input event is required: even the already queued frame notices navigation.
    vi.advanceTimersByTime(16);
    expectProtectionReleased(env);
    env.fire("load");
    env.fire("pageshow");
    env.restore(620);
    env.fire("pagehide");
    vi.advanceTimersByTime(3000);
    expect(env.scrollY).toBe(620);
    expect(env.calls).toHaveLength(count);
    expect(env.position).toEqual(field === "search"
      ? { url: "/" + value, width: 390, top: 620 }
      : { url: "/", width: 390, top: 60 });
    expectProtectionReleased(env);
  });

  it.each(["touchstart", "wheel", "pointerdown", "keydown"])(
    "leaves no reload timers or protection listeners after deliberate %s input",
    (event) => {
      const env = start("/", "", { storage: stored(60), navigationType: "reload" });
      env.fire(event, event === "touchstart" ? { touches: [{ clientY: 100 }] } : {});
      expectProtectionReleased(env);
      const count = env.calls.length;
      env.restore(360);
      env.fire("load");
      env.fire("pageshow");
      vi.advanceTimersByTime(3000);
      expect(env.scrollY).toBe(360);
      expect(env.position?.top).toBe(360);
      expect(env.calls).toHaveLength(count);
      expectProtectionReleased(env);
    },
  );
});

describe("Passive position recording and transient native pulling", () => {
  it("records real scrollY after protection and clamps negative overscroll to zero", () => {
    const env = start();
    finishLoading(env);
    const count = env.calls.length;
    expect([...env.listeners.get("scroll")!.values()]).toEqual([{ passive: true }]);
    for (const top of [60, 215.5, 0]) {
      env.restore(top);
      expect(env.position).toEqual({ url: "/", width: 390, top });
    }
    env.restore(-32);
    expect(env.scrollY).toBe(-32);
    expect(env.position?.top).toBe(0);
    env.setScrollY(72);
    env.fire("pagehide");
    expect(env.position?.top).toBe(72);
    expect(env.calls).toHaveLength(count);
    expectProtectionReleased(env);
  });

  it("never stores an erroneous browser restoration during active reload protection", () => {
    const env = start("/", "", { storage: stored(60), navigationType: "reload" });
    const writes = env.window.sessionStorage.setItem.mock.calls.length;
    env.restore(240);
    env.fire("pagehide");
    expect(env.scrollY).toBe(60);
    expect(env.position?.top).toBe(60);
    expect(env.window.sessionStorage.setItem).toHaveBeenCalledTimes(writes);
    finishLoading(env);
    expect(env.position?.top).toBe(60);
  });

  it.each([0, -32])("saves pre-pull 60 at transient scrollY=%s through pagehide, then reloads at 60", (transientTop) => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.touch("touchstart", 100);
    env.setScrollY(transientTop);
    env.touch("touchmove", 140);
    expect(env.position?.top).toBe(60);
    env.restore(transientTop);
    vi.advanceTimersByTime(1999);
    env.fire("pagehide");
    expect(env.position?.top).toBe(60);
    expectProtectionReleased(env);

    const reload = start("/", "", { storage: env.storage, navigationType: "reload", initialScrollY: 0 });
    expect(reload.scrollY).toBe(60);
    finishLoading(reload);
    expect(reload.position?.top).toBe(60);
  });

  it("records an ordinary scroll back to the top as zero rather than retaining 60", () => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.restore(0);
    env.fire("pagehide");
    expect(env.position?.top).toBe(0);
    const reload = start("/", "", { storage: env.storage, navigationType: "reload" });
    expect(reload.scrollY).toBe(0);
    finishLoading(reload);
  });

  it("does not mistake a touchstart followed by ordinary scrolling for a pull", () => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.touch("touchstart", 100);
    env.restore(0);
    env.fire("pagehide");
    expect(env.position?.top).toBe(0);
    expectProtectionReleased(env);
  });

  it("cancels a downward pull candidate when the gesture reverses upward", () => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.touch("touchstart", 100);
    env.setScrollY(0);
    env.touch("touchmove", 140);
    expect(env.position?.top).toBe(60);
    env.touch("touchmove", 80);
    env.restore(0);
    env.fire("pagehide");
    expect(env.position?.top).toBe(0);
    expectProtectionReleased(env);
  });

  it.each(["wheel", "pointerdown", "keydown"])("cancels the pull candidate and start position on deliberate %s input", (event) => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.touch("touchstart", 100);
    env.setScrollY(0);
    env.touch("touchmove", 140);
    expect(env.position?.top).toBe(60);
    env.fire(event);
    // A later touchmove from the cancelled gesture must not recreate the candidate.
    env.touch("touchmove", 160);
    env.restore(0);
    env.fire("pagehide");
    expect(env.position?.top).toBe(0);
    expectProtectionReleased(env);
  });

  it("retains a native pull candidate briefly across touchcancel without accepting later moves", () => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.touch("touchstart", 100);
    env.setScrollY(0);
    env.touch("touchmove", 140);
    env.fire("touchcancel");
    // An upward move would clear an active candidate unless touchcancel cleared pullStart.
    env.touch("touchmove", 80);
    vi.advanceTimersByTime(1999);
    env.restore(0);
    env.fire("pagehide");
    expect(env.position?.top).toBe(60);
    expectProtectionReleased(env);
    const reload = start("/", "", { storage: env.storage, navigationType: "reload" });
    expect(reload.scrollY).toBe(60);
    finishLoading(reload);
  });

  it("does not create a pull candidate for a downward touch while still above the top", () => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.touch("touchstart", 100);
    env.touch("touchmove", 140);
    env.restore(0);
    env.fire("pagehide");
    expect(env.position?.top).toBe(0);
    expectProtectionReleased(env);
  });

  it("stores zero after the transient pull candidate expires at exactly 2000 ms", () => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.touch("touchstart", 100);
    env.setScrollY(0);
    env.touch("touchmove", 140);
    vi.advanceTimersByTime(1999);
    env.fire("pagehide");
    expect(env.position?.top).toBe(60);
    vi.advanceTimersByTime(1);
    env.fire("pagehide");
    expect(env.position?.top).toBe(0);
    expectProtectionReleased(env);
  });

  it("clears a pull candidate once ordinary scrolling resumes above zero", () => {
    const env = start();
    finishLoading(env);
    env.restore(60);
    env.touch("touchstart", 100);
    env.setScrollY(0);
    env.touch("touchmove", 140);
    env.restore(24);
    expect(env.position?.top).toBe(24);
    env.restore(0);
    env.fire("pagehide");
    expect(env.position?.top).toBe(0);
    expectProtectionReleased(env);
  });

  it.each([["/musical/der-kleine-lord", ""], ["/", "#more-musicals"]])(
    "records Home position after SPA navigation from initial %s%s without forcing that original URL",
    (pathname, hash) => {
      const env = start(pathname, hash);
      expect(env.calls).toEqual([]);
      env.window.location.pathname = "/";
      env.window.location.hash = "";
      env.restore(60);
      env.fire("pagehide");
      expect(env.position).toEqual({ url: "/", width: 390, top: 60 });
      expectProtectionReleased(env);
      const reload = start("/", "", { storage: env.storage, navigationType: "reload" });
      expect(reload.scrollY).toBe(60);
      finishLoading(reload);
    },
  );
});
