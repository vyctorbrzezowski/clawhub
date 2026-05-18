import { defineEventHandler } from "h3";
import { jsonResponse } from "../agentReadiness";

export default defineEventHandler(() =>
  jsonResponse({
    status: "ok",
    service: "ClawHub",
    homepage: "https://clawhub.ai",
    api: "https://clawhub.ai/api/v1",
    openapi: "https://clawhub.ai/api/v1/openapi.json",
  }),
);
