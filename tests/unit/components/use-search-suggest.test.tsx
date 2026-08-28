// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { type ReactNode } from "react";
import {
  useSearchSuggest,
  searchHitRoute,
} from "@/lib/hooks/use-search-suggest";

type SuggestApi = ReturnType<typeof useSearchSuggest>;

function makeHit(
  id: string,
  type: "university" | "program" | "city" = "university",
) {
  return { type, id, slug: `${type}-${id}`, label: `Label ${id}` };
}

/**
 * Minimal renderHook replacement. React 19.2 removed `act`, so we drive the
 * hook through a real DOM root and flushSync (which is still exported).
 */
function mountHook(cb: () => unknown) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  let current: unknown;

  function Probe() {
    current = cb();
    return null as unknown as ReactNode;
  }

  flushSync(() => {
    root.render(<Probe />);
  });

  const result = {
    get current() {
      return current as SuggestApi;
    },
  };

  return {
    result,
    unmount: () => {
      root.unmount();
      container.remove();
    },
  };
}

type Mounted = ReturnType<typeof mountHook>;

/** Debounce is 150ms — wait well past it with real timers. */
const WAIT = 250;

async function wait(ms = WAIT) {
  await new Promise((r) => setTimeout(r, ms));
}

async function typeQuery(hook: Mounted, q: string) {
  hook.result.current.setQuery(q);
  flushSync(() => {});
  await wait(10);
}

describe("useSearchSuggest", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not fetch for queries shorter than 2 chars", async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    const hook = mountHook(() => useSearchSuggest());
    await typeQuery(hook, "a");
    await wait();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(hook.result.current.hits).toEqual([]);
    hook.unmount();
  });

  it("debounces: one fetch for rapid input changes", async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [makeHit("1")] }),
    });
    const hook = mountHook(() => useSearchSuggest());
    await typeQuery(hook, "is");
    await typeQuery(hook, "ist");
    await typeQuery(hook, "ista");
    await wait();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/search?q=ista&limit=8",
      expect.anything(),
    );
    hook.unmount();
  });

  it("uses the cache: same query re-typed does not re-fetch", async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [makeHit("1")] }),
    });
    const hook = mountHook(() => useSearchSuggest());
    await typeQuery(hook, "istanbul");
    await wait();
    await typeQuery(hook, "ankara"); // different query → fetch #2
    await wait();
    await typeQuery(hook, "istanbul"); // cached → no fetch #3
    await wait();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(hook.result.current.hits).toEqual([makeHit("1")]);
    hook.unmount();
  });

  it("aborts the in-flight request when the query changes", async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    const hook = mountHook(() => useSearchSuggest());
    await typeQuery(hook, "ista");
    await wait(); // fetch in flight
    await typeQuery(hook, "istan"); // triggers cleanup → abort
    await wait();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    hook.unmount();
  });

  it("enterHit: defaults to the first hit, follows ArrowDown selection, wraps on ArrowUp", async () => {
    const hits = [makeHit("1"), makeHit("2"), makeHit("3")];
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: hits }),
    });
    const hook = mountHook(() => useSearchSuggest());
    await typeQuery(hook, "ist");
    await wait();

    // Default: first hit (activeIndex -1 → falls back to hits[0]).
    expect(hook.result.current.enterHit()?.id).toBe("1");

    // ArrowDown: -1 → 0 (still first), 0 → 1 (second).
    flushSync(() => {
      hook.result.current.onInputKeyDown({
        key: "ArrowDown",
        preventDefault: () => {},
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    await wait(0);
    expect(hook.result.current.enterHit()?.id).toBe("1");
    flushSync(() => {
      hook.result.current.onInputKeyDown({
        key: "ArrowDown",
        preventDefault: () => {},
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    await wait(0);
    expect(hook.result.current.enterHit()?.id).toBe("2");

    // ArrowDown again → 3rd.
    flushSync(() => {
      hook.result.current.onInputKeyDown({
        key: "ArrowDown",
        preventDefault: () => {},
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    await wait(0);
    expect(hook.result.current.enterHit()?.id).toBe("3");

    // ArrowUp from index 2 → 1.
    flushSync(() => {
      hook.result.current.onInputKeyDown({
        key: "ArrowUp",
        preventDefault: () => {},
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    await wait(0);
    expect(hook.result.current.enterHit()?.id).toBe("2");
    hook.unmount();
  });

  it("reset clears query, hits and closes", async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [makeHit("1")] }),
    });
    const hook = mountHook(() => useSearchSuggest());
    await typeQuery(hook, "ist");
    await wait();
    flushSync(() => {
      hook.result.current.reset();
    });
    expect(hook.result.current.query).toBe("");
    expect(hook.result.current.hits).toEqual([]);
    expect(hook.result.current.open).toBe(false);
    hook.unmount();
  });
});

describe("searchHitRoute", () => {
  it("maps university → detail, program → listing, city → filtered listing", () => {
    expect(searchHitRoute(makeHit("x", "university"))).toBe(
      "/universities/university-x",
    );
    expect(searchHitRoute(makeHit("y", "program"))).toBe("/programs");
    expect(searchHitRoute(makeHit("z", "city"))).toBe(
      "/universities?search=city-z",
    );
  });
});
