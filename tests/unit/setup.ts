// tests/unit/setup.ts — jsdom mocks for Next.js modules
import { vi } from "vitest";

// next/image → plain <img> so tests don't hit the image optimizer.
vi.mock("next/image", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  return {
    default: (props: Record<string, unknown>) => {
      const { src, alt, ...rest } = props;
      return React.createElement("img", { src, alt, ...rest });
    },
  };
});

// next/link → plain <a>.
vi.mock("next/link", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  return {
    default: ({ href, children, ...rest }: Record<string, unknown>) =>
      React.createElement("a", { href, ...rest }, children as React.ReactNode),
  };
});

// next/navigation → stubs used by next-intl's createNavigation.
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: () => {
    throw new Error("redirect called");
  },
  notFound: () => {
    throw new Error("notFound called");
  },
}));
