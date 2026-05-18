import { defineEventHandler } from "h3";
import { getApiCatalog, jsonResponse } from "../../agentReadiness";

export default defineEventHandler(() =>
  jsonResponse(
    getApiCatalog(),
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"; charset=utf-8',
  ),
);
