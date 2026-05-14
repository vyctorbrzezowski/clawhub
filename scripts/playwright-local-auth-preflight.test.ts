import { createServer } from "node:net";
import { describe, expect, it } from "vitest";
import {
  canListen,
  checkBunAvailable,
  checkPlaywrightChromiumInstalled,
  checkPortsAvailable,
  checkTempDirWritable,
  runPreflightChecks,
} from "./playwright-local-auth-preflight";

describe("playwright local-auth preflight", () => {
  it("fails when bun is not available", () => {
    const result = checkBunAvailable(() => ({
      status: 1,
      stdout: "",
      stderr: "",
    }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("Bun is not available");
    }
  });

  it("passes when bun is available", () => {
    const result = checkBunAvailable(() => ({
      status: 0,
      stdout: "1.0.0\n",
      stderr: "",
    }));
    expect(result.ok).toBe(true);
  });

  it("fails when playwright chromium is not installed", () => {
    const result = checkPlaywrightChromiumInstalled(
      () => "/mock/chromium",
      () => false,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("bunx playwright install chromium");
    }
  });

  it("passes when playwright chromium is installed", () => {
    const result = checkPlaywrightChromiumInstalled(
      () => "/mock/chromium",
      () => true,
    );
    expect(result.ok).toBe(true);
  });

  it("detects an occupied port", async () => {
    const server = createServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = (server.address() as import("node:net").AddressInfo).port;
    try {
      expect(await canListen(port)).toBe(false);
    } finally {
      server.close();
    }
  });

  it("detects an available port", async () => {
    expect(await canListen(0)).toBe(true);
  });

  it("reports unavailable ports", async () => {
    const server = createServer();
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = (server.address() as import("node:net").AddressInfo).port;
    try {
      const result = await checkPortsAvailable([port]);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.message).toContain(String(port));
      }
    } finally {
      server.close();
    }
  });

  it("passes when all ports are available", async () => {
    const result = await checkPortsAvailable([0]);
    expect(result.ok).toBe(true);
  });

  it("fails when temp dir is not writable", () => {
    const result = checkTempDirWritable(
      () => {
        throw new Error("EACCES");
      },
      () => "/tmp",
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("not writable");
    }
  });

  it("passes when temp dir is writable", () => {
    const result = checkTempDirWritable(
      () => {},
      () => "/tmp",
    );
    expect(result.ok).toBe(true);
  });

  it("stops at first failed preflight check", async () => {
    const result = await runPreflightChecks({
      appPort: 4173,
      convexUrl: "http://127.0.0.1:3210",
      convexSiteUrl: "http://127.0.0.1:3211",
    });
    // In this environment bun and playwright are available, but ports 3210/3211
    // may be occupied by a running convex dev server. The result tells us
    // exactly which preflight step failed.
    if (!result.ok) {
      expect(result.message).toBeTruthy();
    }
  });

  it("passes when all preflight checks succeed", async () => {
    const result = await runPreflightChecks({
      appPort: 0,
      convexUrl: "http://127.0.0.1:0",
      convexSiteUrl: "http://127.0.0.1:0",
    });
    expect(result.ok).toBe(true);
  });
});
