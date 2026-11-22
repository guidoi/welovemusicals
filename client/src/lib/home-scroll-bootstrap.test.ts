import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const script = html.match(/<script id="home-scroll-bootstrap">([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error("Home scroll bootstrap missing");

type ScrollOptions = { top: number; left: number; behavior: string };
function start(pathname = "/", hash = "") {
  vi.useFakeTimers();
  const listeners = new Map<string, Set<() => void>>();
  const calls: ScrollOptions[] = [];
  let scrollY = 48;
  const window = {
    history: { scrollRestoration: "auto" },
    location: { pathname, hash },
    setTimeout,
    clearTimeout,
    requestAnimationFrame: (fn: () => void) => setTimeout(fn, 16),
    cancelAnimationFrame: clearTimeout,
    addEventListener: (name: string, fn: () => void) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name)!.add(fn);
    },
    removeEventListener: (name: string, fn: () => void) => listeners.get(name)?.delete(fn),
    scrollTo: (options: ScrollOptions) => {
      calls.push(options);
      scrollY = options.top;
    },
  };
  const fire = (name: string) => [...(listeners.get(name) ?? [])].forEach((fn) => fn());
  runInNewContext(script!, { window });
  return {
    window, calls, fire, listeners,
    get scrollY() { return scrollY; },
    restore: (value: number) => { scrollY = value; fire("scroll"); },
  };
}

afterEach(() => vi.useRealTimers());

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
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["touchstart", "wheel", "pointerdown", "keydown"])(
    "stops protection immediately for user %s and never rearms on later lifecycle events",
    (event) => {
      const env = start();
      vi.advanceTimersByTime(50);
      env.fire(event);
      const count = env.calls.length;
      env.restore(120);
      env.fire("load");
      env.fire("pageshow");
      vi.advanceTimersByTime(3000);
      expect(env.scrollY).toBe(120);
      expect(env.calls).toHaveLength(count);
      expect(vi.getTimerCount()).toBe(0);
      expect([...env.listeners.values()].every((entries) => entries.size === 0)).toBe(true);
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
    expect(vi.getTimerCount()).toBe(0);
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
    expect(vi.getTimerCount()).toBe(0);
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
      expect(vi.getTimerCount()).toBe(0);
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
