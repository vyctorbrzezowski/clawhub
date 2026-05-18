import { defineEventHandler } from "h3";
import { getApiCatalog, jsonResponse } from "../../agentReadiness";

export default defineEventHandler(() =>
  jsonResponse(getApiCatalog(), "application/linkset+json; charset=utf-8"),
);
