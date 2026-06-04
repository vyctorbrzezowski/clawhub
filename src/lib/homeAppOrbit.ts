/** Layout slots for the home apps “constellation” stage (percent of orbit box). */

export type HomeAppOrbitSide = "left" | "right";

export type HomeAppOrbitPlacement = {
  left: string;
  top: string;
  scale: number;
  opacity: number;
  zIndex: number;
};

type OrbitSlot = {
  x: number;
  y: number;
  scale: number;
  opacity: number;
};

function placement(slot: OrbitSlot, side: HomeAppOrbitSide): HomeAppOrbitPlacement {
  const x = side === "left" ? slot.x : 100 - slot.x;
  const dist = Math.hypot(x - 50, (slot.y - 50) * 1.08);
  return {
    left: `${x}%`,
    top: `${slot.y}%`,
    scale: slot.scale,
    opacity: slot.opacity,
    zIndex: Math.round(140 - dist * 2),
  };
}

/**
 * Hand-tuned crescent: alternating outer/inner columns with ~14% vertical rhythm
 * so pill centers do not overlap at desktop stage height.
 */
const LEFT_ORBIT_SLOTS: readonly OrbitSlot[] = [
  { x: 10, y: 20, scale: 0.9, opacity: 0.78 },
  { x: 30, y: 20, scale: 0.94, opacity: 0.88 },
  { x: 8, y: 34, scale: 0.89, opacity: 0.76 },
  { x: 31, y: 34, scale: 0.95, opacity: 0.9 },
  { x: 11, y: 48, scale: 0.91, opacity: 0.8 },
  { x: 28, y: 48, scale: 0.96, opacity: 0.92 },
  { x: 9, y: 62, scale: 0.9, opacity: 0.78 },
  { x: 30, y: 62, scale: 0.94, opacity: 0.88 },
  { x: 18, y: 76, scale: 0.92, opacity: 0.84 },
];

const HOME_SKILL_ORBIT_SLOTS = LEFT_ORBIT_SLOTS.map((slot) => placement(slot, "left"));
const HOME_PLUGIN_ORBIT_SLOTS = LEFT_ORBIT_SLOTS.map((slot) => placement(slot, "right"));

export function getHomeAppOrbitPlacement(
  side: HomeAppOrbitSide,
  index: number,
): HomeAppOrbitPlacement {
  const slots = side === "left" ? HOME_SKILL_ORBIT_SLOTS : HOME_PLUGIN_ORBIT_SLOTS;
  return slots[index % slots.length];
}

/** Minimum weighted distance between slot centers (layout regression guard). */
export function minHomeAppOrbitSlotSeparation(side: HomeAppOrbitSide): number {
  const slots = side === "left" ? LEFT_ORBIT_SLOTS : LEFT_ORBIT_SLOTS;
  let min = Number.POSITIVE_INFINITY;
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      const dx = Math.abs(a.x - b.x);
      const dy = Math.abs(a.y - b.y) * 1.15;
      min = Math.min(min, Math.hypot(dx, dy));
    }
  }
  return min;
}
