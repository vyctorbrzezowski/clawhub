import { defineEventHandler, readBody } from "h3";
import { handleMcpJsonRpc, jsonResponse } from "../agentReadiness";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null);
  return jsonResponse(handleMcpJsonRpc(body));
});
