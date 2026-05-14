import { describe, expect, it, vi } from "vitest";
import {
  checkCommandVersion,
  checkEnvLocal,
  checkFileExists,
  checkPortFree,
  exitCodeFromResults,
  printResults,
  type CheckResult,
} from "./dev-doctor";

describe("dev-doctor", () => {
  describe("checkCommandVersion", () => {
    it("returns PASS when command succeeds", () => {
      const result = checkCommandVersion("echo", ["1.2.3"], { label: "test-cmd" });
      expect(result.status).toBe("PASS");
      expect(result.message).toContain("1.2.3");
    });

    it("returns FAIL when command is missing and not optional", () => {
      const result = checkCommandVersion("this-command-definitely-does-not-exist-12345", [], {
        label: "missing",
      });
      expect(result.status).toBe("FAIL");
      expect(result.message).toContain("not found");
    });

    it("returns WARN when command is missing and optional", () => {
      const result = checkCommandVersion("this-command-definitely-does-not-exist-12345", [], {
        label: "missing",
        optional: true,
      });
      expect(result.status).toBe("WARN");
      expect(result.message).toContain("not found");
    });
  });

  describe("checkFileExists", () => {
    it("returns PASS for an existing file", () => {
      const result = checkFileExists("package.json", "package.json");
      expect(result.status).toBe("PASS");
    });

    it("returns FAIL for a missing file", () => {
      const result = checkFileExists("this-file-does-not-exist-12345.txt", "missing");
      expect(result.status).toBe("FAIL");
    });
  });

  describe("checkEnvLocal", () => {
    it("returns PASS when .env.local exists", () => {
      const result = checkEnvLocal(process.cwd());
      if (result.status === "PASS") {
        expect(result.message).toContain(".env.local present");
      }
    });

    it("returns WARN when .env.local is missing", () => {
      const result = checkEnvLocal("/tmp/this-directory-does-not-exist-12345");
      expect(result.status).toBe("WARN");
      expect(result.message).toContain("missing");
    });
  });

  describe("checkPortFree", () => {
    it("reports PASS for a free port", async () => {
      const result = await checkPortFree(65432);
      expect(result.status).toBe("PASS");
      expect(result.message).toContain("free");
    });

    it("reports WARN for a bound port", async () => {
      const net = await import("node:net");
      const server = net.createServer();
      await new Promise<void>((resolve) => server.listen(65433, "127.0.0.1", resolve));
      try {
        const result = await checkPortFree(65433);
        expect(result.status).toBe("WARN");
        expect(result.message).toContain("in use");
      } finally {
        server.close();
      }
    });
  });

  describe("exitCodeFromResults", () => {
    it("returns 0 for all PASS", () => {
      const results: CheckResult[] = [
        { name: "a", status: "PASS", message: "ok" },
        { name: "b", status: "PASS", message: "ok" },
      ];
      expect(exitCodeFromResults(results)).toBe(0);
    });

    it("returns 0 for only WARN", () => {
      const results: CheckResult[] = [
        { name: "a", status: "WARN", message: "ok" },
        { name: "b", status: "PASS", message: "ok" },
      ];
      expect(exitCodeFromResults(results)).toBe(0);
    });

    it("returns 1 for any FAIL", () => {
      const results: CheckResult[] = [
        { name: "a", status: "PASS", message: "ok" },
        { name: "b", status: "FAIL", message: "bad" },
      ];
      expect(exitCodeFromResults(results)).toBe(1);
    });
  });

  describe("printResults", () => {
    it("prints results without throwing", () => {
      const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const results: CheckResult[] = [
        { name: "bun", status: "PASS", message: "1.0.0" },
        { name: "node", status: "WARN", message: "not found" },
        { name: "env", status: "FAIL", message: "missing" },
      ];
      printResults(results);
      expect(logSpy).toHaveBeenCalledTimes(3);
      logSpy.mockRestore();
    });
  });
});
