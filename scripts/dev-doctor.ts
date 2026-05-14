#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createConnection } from "node:net";

export type CheckStatus = "PASS" | "WARN" | "FAIL";

export type CheckResult = {
  name: string;
  status: CheckStatus;
  message: string;
};

export function checkCommandVersion(
  command: string,
  args: string[],
  options?: { optional?: boolean; label?: string },
): CheckResult {
  const label = options?.label ?? command;
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });
  if (result.error) {
    if (options?.optional) {
      return { name: label, status: "WARN", message: `${label} not found` };
    }
    return { name: label, status: "FAIL", message: `${label} not found` };
  }
  if (result.status !== 0) {
    if (options?.optional) {
      return { name: label, status: "WARN", message: `${label} returned status ${result.status}` };
    }
    return { name: label, status: "FAIL", message: `${label} returned status ${result.status}` };
  }
  const version = result.stdout.trim().split("\n")[0].trim();
  return { name: label, status: "PASS", message: version };
}

export function checkFileExists(path: string, label?: string): CheckResult {
  const name = label ?? path;
  if (existsSync(path)) {
    return { name, status: "PASS", message: `${path} present` };
  }
  return { name, status: "FAIL", message: `${path} missing` };
}

export function checkEnvLocal(cwd: string): CheckResult {
  const path = `${cwd}/.env.local`;
  if (existsSync(path)) {
    return { name: ".env.local", status: "PASS", message: `${path} present` };
  }
  return {
    name: ".env.local",
    status: "WARN",
    message: `${path} missing; copy from .env.local.example`,
  };
}

export async function checkPortFree(port: number): Promise<CheckResult> {
  return new Promise((resolve) => {
    const conn = createConnection(port, "127.0.0.1");
    conn.on("connect", () => {
      conn.destroy();
      resolve({
        name: `port ${port}`,
        status: "WARN",
        message: `port ${port} is in use`,
      });
    });
    conn.on("error", () => {
      resolve({
        name: `port ${port}`,
        status: "PASS",
        message: `port ${port} is free`,
      });
    });
  });
}

export async function runChecks(cwd = process.cwd()): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  results.push(checkCommandVersion("bun", ["--version"], { label: "bun" }));
  results.push(checkCommandVersion("node", ["--version"], { label: "node", optional: true }));
  results.push(checkFileExists(`${cwd}/bun.lock`, "bun.lock"));
  const nodeModulesResult = checkFileExists(`${cwd}/node_modules`, "node_modules");
  if (nodeModulesResult.status === "FAIL") {
    results.push({ ...nodeModulesResult, status: "WARN", message: `${cwd}/node_modules missing; run bun install` });
  } else {
    results.push(nodeModulesResult);
    results.push(checkFileExists(`${cwd}/node_modules/.bin/vite`, "vite binary"));
  }
  results.push(checkEnvLocal(cwd));
  results.push(checkCommandVersion("bunx", ["convex", "--version"], { label: "convex CLI" }));
  results.push(
    checkCommandVersion("bunx", ["playwright", "--version"], {
      label: "playwright",
      optional: true,
    }),
  );
  results.push(checkCommandVersion("gh", ["--version"], { label: "gh CLI", optional: true }));

  const portChecks = await Promise.all([
    checkPortFree(3000),
    checkPortFree(4317),
    checkPortFree(4318),
    checkPortFree(4417),
    checkPortFree(4418),
  ]);
  results.push(...portChecks);

  return results;
}

export function printResults(results: CheckResult[]) {
  for (const r of results) {
    const icon = r.status === "PASS" ? "✓" : r.status === "WARN" ? "⚠" : "✗";
    console.log(`${icon} ${r.status.padEnd(4)} ${r.name.padEnd(16)} ${r.message}`);
  }
}

export function exitCodeFromResults(results: CheckResult[]): number {
  const hasFail = results.some((r) => r.status === "FAIL");
  return hasFail ? 1 : 0;
}

async function main() {
  const results = await runChecks(process.cwd());
  printResults(results);
  process.exit(exitCodeFromResults(results));
}

if (import.meta.main) {
  await main();
}
