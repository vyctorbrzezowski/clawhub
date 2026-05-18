import { defineEventHandler } from "h3";
import { getMcpServerCard, jsonResponse } from "../../../agentReadiness";

export default defineEventHandler(() => jsonResponse(getMcpServerCard()));
