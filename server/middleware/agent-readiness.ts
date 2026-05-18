import { defineEventHandler, getHeader, getRequestURL, setHeader } from "h3";
import { HOME_LINK_HEADER, HOME_MARKDOWN, prefersMarkdown, textResponse } from "../agentReadiness";

export default defineEventHandler((event) => {
  if (getRequestURL(event).pathname !== "/") return;

  setHeader(event, "Link", HOME_LINK_HEADER);

  if (prefersMarkdown(getHeader(event, "accept"))) {
    return textResponse(HOME_MARKDOWN, "text/markdown; charset=utf-8");
  }
});
