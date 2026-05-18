import { defineEventHandler } from "h3";
import { getOAuthAuthorizationServer, jsonResponse } from "../../agentReadiness";

export default defineEventHandler(() => jsonResponse(getOAuthAuthorizationServer()));
