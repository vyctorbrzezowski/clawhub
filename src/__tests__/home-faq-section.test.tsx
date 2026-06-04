/* @vitest-environment jsdom */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeFaqSection } from "../components/HomeFaqSection";

describe("HomeFaqSection", () => {
  it("expands an answer when a question is clicked", () => {
    render(<HomeFaqSection />);

    const trigger = screen.getByRole("button", { name: "What is ClawHub?" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText(/public registry for OpenClaw/i)).toBeTruthy();

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
