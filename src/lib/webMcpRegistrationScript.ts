export const WEB_MCP_REGISTRATION_SCRIPT = `(function(){
  try {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return;
    var modelContext = navigator.modelContext;
    if (!modelContext) return;

    function textInputSchema(requiredName, description) {
      return {
        type: 'object',
        properties: {
          [requiredName]: {
            type: 'string',
            description: description
          }
        },
        required: [requiredName],
        additionalProperties: false
      };
    }

    var tools = [
      {
        name: 'search_clawhub',
        description: 'Search public ClawHub skills and plugins.',
        inputSchema: textInputSchema('query', 'Search query.'),
        execute: async function(input) {
          var query = input && typeof input.query === 'string' ? input.query.trim() : '';
          var url = new URL('/api/v1/search', window.location.origin);
          if (query) url.searchParams.set('q', query);
          var response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
          var data = await response.json().catch(function() { return null; });
          return { ok: response.ok, status: response.status, url: url.toString(), data: data };
        }
      },
      {
        name: 'inspect_clawhub_skill',
        description: 'Fetch public metadata for a ClawHub skill by slug.',
        inputSchema: textInputSchema('slug', 'Skill slug.'),
        execute: async function(input) {
          var slug = input && typeof input.slug === 'string' ? input.slug.trim() : '';
          if (!slug) return { ok: false, status: 400, error: 'slug is required' };
          var url = new URL('/api/v1/skills/' + encodeURIComponent(slug), window.location.origin);
          var response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
          var data = await response.json().catch(function() { return null; });
          return { ok: response.ok, status: response.status, url: url.toString(), data: data };
        }
      }
    ];

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    if (typeof modelContext.registerTool === 'function') {
      tools.forEach(function(tool) {
        try {
          var registration = modelContext.registerTool(
            tool,
            controller ? { signal: controller.signal } : undefined
          );
          if (registration && typeof registration.catch === 'function') registration.catch(function(){});
        } catch (error) {}
      });
    }

    if (typeof modelContext.provideContext === 'function') {
      try {
        modelContext.provideContext({ tools: tools });
      } catch (error) {}
    }
  } catch (error) {}
})();`;
