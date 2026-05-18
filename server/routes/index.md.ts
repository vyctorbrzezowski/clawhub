import { defineEventHandler } from "h3";
import { HOME_MARKDOWN, textResponse } from "../agentReadiness";

export default defineEventHandler(() =>
  textResponse(HOME_MARKDOWN, "text/markdown; charset=utf-8"),
);
