import { describe, expect, it } from "vitest";
import { shouldShowHomeV2FoldBottomFade } from "./homeFoldFade";

describe("shouldShowHomeV2FoldBottomFade", () => {
  const viewport = 900;

  it("shows at page top when listing extends below the fold", () => {
    expect(shouldShowHomeV2FoldBottomFade(2400, viewport)).toBe(true);
  });

  it("hides when the listing bottom reaches the viewport bottom", () => {
    expect(shouldShowHomeV2FoldBottomFade(900, viewport)).toBe(false);
    expect(shouldShowHomeV2FoldBottomFade(850, viewport)).toBe(false);
  });

  it("shows while the listing bottom is still below the viewport edge", () => {
    expect(shouldShowHomeV2FoldBottomFade(901, viewport)).toBe(true);
  });

  it("hides after the listing has scrolled past", () => {
    expect(shouldShowHomeV2FoldBottomFade(-40, viewport)).toBe(false);
  });
});
