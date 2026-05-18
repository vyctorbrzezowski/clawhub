import { defineEventHandler, getHeader, getRequestURL, setHeader } from "h3";
import {
  getAgentModeView,
  HOME_LINK_HEADER,
  HOME_MARKDOWN,
  jsonResponse,
  prefersMarkdown,
  textResponse,
} from "../agentReadiness";

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  if (url.pathname !== "/") return;

  setHeader(event, "Link", HOME_LINK_HEADER);
  setHeader(event, "Vary", "Accept");

  if (url.searchParams.get("mode") === "agent") {
    return jsonResponse(getAgentModeView(), "application/json; charset=utf-8", 200, {
      Link: HOME_LINK_HEADER,
      Vary: "Accept",
    });
  }

  if (prefersMarkdown(getHeader(event, "accept"))) {
    return textResponse(HOME_MARKDOWN, "text/markdown; charset=utf-8");
  }
});
