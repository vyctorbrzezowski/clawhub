import { defineEventHandler } from "h3";
import { getOpenIdConfiguration, jsonResponse } from "../../agentReadiness";

export default defineEventHandler(() => jsonResponse(getOpenIdConfiguration()));
