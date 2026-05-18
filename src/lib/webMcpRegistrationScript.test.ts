/* @vitest-environment node */

import { describe, expect, it } from "vitest";
import { WEB_MCP_REGISTRATION_SCRIPT } from "./webMcpRegistrationScript";

describe("WebMCP registration script", () => {
  it("registers ClawHub tools when the browser exposes navigator.modelContext", () => {
    expect(WEB_MCP_REGISTRATION_SCRIPT).toContain("navigator.modelContext");
    expect(WEB_MCP_REGISTRATION_SCRIPT).toContain("registerTool");
    expect(WEB_MCP_REGISTRATION_SCRIPT).toContain("provideContext");
    expect(WEB_MCP_REGISTRATION_SCRIPT).toContain("search_clawhub");
    expect(WEB_MCP_REGISTRATION_SCRIPT).toContain("inspect_clawhub_skill");
  });

  it("is safe to execute in browsers that do not expose WebMCP", () => {
    expect(() => new Function(WEB_MCP_REGISTRATION_SCRIPT)()).not.toThrow();
  });
});
