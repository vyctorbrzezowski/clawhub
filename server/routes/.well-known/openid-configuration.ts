import { defineEventHandler } from "h3";
import { jsonResponse } from "../../agentReadiness";

export default defineEventHandler(() =>
  jsonResponse(
    {
      error: "openid_configuration_not_available",
      error_description:
        "ClawHub does not advertise OpenID Connect provider metadata. Use /.well-known/oauth-authorization-server for OAuth 2.0 authorization server metadata.",
      authorization_server_metadata: "https://clawhub.ai/.well-known/oauth-authorization-server",
    },
    "application/json",
    404,
  ),
);
