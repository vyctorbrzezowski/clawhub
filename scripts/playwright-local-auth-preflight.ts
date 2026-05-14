import { spawnSync } from "node:child_process";
import { accessSync, constants, existsSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { chromium } from "playwright";

export type PreflightDiagnostic =
  | { ok: true }
  | { ok: false; message: string };

type SpawnLike = (
  command: string,
  args: string[],
  options: { encoding: string; shell: boolean },
) => { status: number | null; stdout?: string; stderr?: string };

export function checkBunAvailable(
  spawn: SpawnLike = spawnSync as SpawnLike,
): PreflightDiagnostic {
  const result = spawn("bun", ["--version"], {
    encoding: "utf8",
    shell: false,
  });
  if (result.status !== 0 || !result.stdout?.trim()) {
    return {
      ok: false,
      message: "Bun is not available in PATH. Install Bun: https://bun.sh",
    };
  }
  return { ok: true };
}

export function checkPlaywrightChromiumInstalled(
  executablePathFn: () => string = () => chromium.executablePath(),
  existsFn: (path: string) => boolean = existsSync,
): PreflightDiagnostic {
  try {
    const executablePath = executablePathFn();
    if (!existsFn(executablePath)) {
      return {
        ok: false,
        message:
          "Playwright chromium browser is not installed. Run: bunx playwright install chromium",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      message:
        "Playwright chromium browser is not installed. Run: bunx playwright install chromium",
    };
  }
}

export function canListen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

export async function checkPortsAvailable(
  ports: number[],
): Promise<PreflightDiagnostic> {
  const unavailable: number[] = [];
  for (const port of ports) {
    if (!(await canListen(port))) {
      unavailable.push(port);
    }
  }
  if (unavailable.length > 0) {
    return {
      ok: false,
      message: `Required ports are already in use: ${unavailable.join(", ")}. Stop any running local Convex dev servers, preview servers, or other processes on these ports and retry.`,
    };
  }
  return { ok: true };
}

export function checkTempDirWritable(
  accessFn: (path: string, mode: number) => void = accessSync,
  tmpDirFn: () => string = tmpdir,
): PreflightDiagnostic {
  try {
    accessFn(tmpDirFn(), constants.W_OK);
    return { ok: true };
  } catch {
    return {
      ok: false,
      message: `Temp directory ${tmpDirFn()} is not writable. Check disk space and permissions.`,
    };
  }
}

function getPortFromUrl(url: string): number {
  const parsed = new URL(url);
  if (parsed.port) return Number(parsed.port);
  return parsed.protocol === "https:" ? 443 : 80;
}

export async function runPreflightChecks(options: {
  appPort: number;
  convexUrl: string;
  convexSiteUrl: string;
}): Promise<PreflightDiagnostic> {
  const bunResult = checkBunAvailable();
  if (!bunResult.ok) return bunResult;

  const browserResult = checkPlaywrightChromiumInstalled();
  if (!browserResult.ok) return browserResult;

  const convexPort = getPortFromUrl(options.convexUrl);
  const convexSitePort = getPortFromUrl(options.convexSiteUrl);
  const portsResult = await checkPortsAvailable([
    options.appPort,
    convexPort,
    convexSitePort,
  ]);
  if (!portsResult.ok) return portsResult;

  const tempResult = checkTempDirWritable();
  if (!tempResult.ok) return tempResult;

  return { ok: true };
}
