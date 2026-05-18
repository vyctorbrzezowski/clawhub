import { defineEventHandler } from "h3";
import { getOAuthProtectedResource, jsonResponse } from "../../agentReadiness";

export default defineEventHandler(() => jsonResponse(getOAuthProtectedResource()));
