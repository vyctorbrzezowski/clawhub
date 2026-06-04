/** Layout slots for the home apps “constellation” stage (percent of stage box). */

export type HomeAppOrbitPlacement = {
  left: string;
  top: string;
  scale: number;
  opacity: number;
  zIndex: number;
};

function placement(
  xPercent: number,
  yPercent: number,
  scale: number,
  opacity: number,
): HomeAppOrbitPlacement {
  const dist = Math.hypot(xPercent - 50, (yPercent - 50) * 1.12);
  return {
    left: `${xPercent}%`,
    top: `${yPercent}%`,
    scale,
    opacity,
    zIndex: Math.round(130 - dist * 2.2),
  };
}

/** Vertical bands shared by left/right crescents (keeps hub lane clear). */
const Y_SLOTS = [21, 30, 39, 48, 57, 66, 26, 44, 62] as const;

/** Two shallow columns per side so pills do not stack on one line. */
const LEFT_X = [13, 22, 10, 27, 16, 25, 12, 24, 18] as const;
const RIGHT_X = LEFT_X.map((x) => 100 - x);

function buildBilateralOrbitSlots(count: number): HomeAppOrbitPlacement[] {
  const half = Math.ceil(count / 2);
  const slots: HomeAppOrbitPlacement[] = [];

  for (let i = 0; i < count; i++) {
    const onLeft = i < half;
    const band = i % half;
    const x = onLeft ? LEFT_X[band % LEFT_X.length] : RIGHT_X[band % RIGHT_X.length];
    const y = Y_SLOTS[band % Y_SLOTS.length];
    const edgeBoost = Math.abs(x - 50) / 50;
    const scale = 0.9 + edgeBoost * 0.06;
    const opacity = 0.7 + edgeBoost * 0.22;
    slots.push(placement(x, y, scale, opacity));
  }

  return slots;
}

const HOME_APP_ORBIT_SLOTS = buildBilateralOrbitSlots(18);

export function getHomeAppOrbitPlacement(index: number): HomeAppOrbitPlacement {
  return HOME_APP_ORBIT_SLOTS[index % HOME_APP_ORBIT_SLOTS.length];
}
