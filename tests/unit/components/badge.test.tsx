// @vitest-environment jsdom
import React from "react";
import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children with the default variant", () => {
    const html = renderToStaticMarkup(<Badge>Verified</Badge>);
    expect(html).toContain("Verified");
    expect(html).toContain("bg-primary");
  });

  it("applies the secondary variant class", () => {
    const html = renderToStaticMarkup(<Badge variant="secondary">State</Badge>);
    expect(html).toContain("bg-secondary");
  });

  it("merges a custom className", () => {
    const html = renderToStaticMarkup(
      <Badge className="custom-class">Label</Badge>,
    );
    expect(html).toContain("custom-class");
  });
});
