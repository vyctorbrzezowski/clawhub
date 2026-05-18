import { defineEventHandler, getMethod, readBody } from "h3";
import { getMcpServerCard, handleMcpJsonRpc, jsonResponse } from "../agentReadiness";

export default defineEventHandler(async (event) => {
  if (getMethod(event) === "GET" || getMethod(event) === "HEAD") {
    return jsonResponse(getMcpServerCard());
  }

  if (getMethod(event) !== "POST") {
    return jsonResponse(
      {
        error: {
          code: "method_not_allowed",
          message: "Use GET for MCP discovery or POST for Streamable HTTP JSON-RPC.",
        },
      },
      "application/json; charset=utf-8",
      405,
      { Allow: "GET, HEAD, POST" },
    );
  }

  const body = await readBody(event).catch(() => null);
  return jsonResponse(handleMcpJsonRpc(body));
});
