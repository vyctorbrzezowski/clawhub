/* @vitest-environment node */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type AgentSkillIndex = {
  $schema: string;
  skills: Array<{
    name: string;
    type: string;
    description: string;
    url: string;
    digest: string;
  }>;
};

const root = process.cwd();

describe("agent skills discovery index", () => {
  it("uses v0.2.0 entries with matching SHA-256 digests", () => {
    const index = JSON.parse(
      readFileSync(join(root, "public/.well-known/agent-skills/index.json"), "utf8"),
    ) as AgentSkillIndex;

    expect(index.$schema).toBe("https://schemas.agentskills.io/discovery/0.2.0/schema.json");
    expect(index.skills).toHaveLength(3);

    for (const skill of index.skills) {
      expect(skill.name).toMatch(/^[a-z0-9-]+$/);
      expect(skill.type).toBe("skill-md");
      expect(skill.description.length).toBeGreaterThan(20);
      expect(skill.url).toBe(
        `https://clawhub.ai/.well-known/agent-skills/${skill.name}/SKILL.md`,
      );

      const body = readFileSync(
        join(root, `public/.well-known/agent-skills/${skill.name}/SKILL.md`),
        "utf8",
      );
      const digest = createHash("sha256").update(body).digest("hex");
      expect(skill.digest).toBe(`sha256:${digest}`);
    }
  });
});
