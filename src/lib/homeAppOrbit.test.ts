import { describe, expect, it } from "vitest";
import { getHomeAppOrbitPlacement, minHomeAppOrbitSlotSeparation } from "./homeAppOrbit";

describe("homeAppOrbit", () => {
  it("keeps left and right slot counts aligned with nine shortcuts per side", () => {
    const left = Array.from({ length: 9 }, (_, i) => getHomeAppOrbitPlacement("left", i));
    const right = Array.from({ length: 9 }, (_, i) => getHomeAppOrbitPlacement("right", i));
    expect(left).toHaveLength(9);
    expect(right).toHaveLength(9);
    expect(left[0].left).toBe("10%");
    expect(right[0].left).toBe("90%");
  });

  it("maintains minimum separation between pill centers", () => {
    expect(minHomeAppOrbitSlotSeparation("left")).toBeGreaterThanOrEqual(13.5);
    expect(minHomeAppOrbitSlotSeparation("right")).toBeGreaterThanOrEqual(13.5);
  });
});
