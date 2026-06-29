/**
 * OpenAPI 3.0 spec served at /docs via swagger-ui-express.
 * Trimmed to the core contracts; every path returns the { data, meta, error }
 * envelope and requires the X-API-Key header (except /health, /docs).
 */
export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "GraphOne API",
    version: "1.0.0",
    description: "AI company & investor intelligence. All responses use the { data, meta, error } envelope.",
  },
  servers: [{ url: "/api/v1" }],
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: "apiKey", in: "header", name: "X-API-Key" },
    },
    schemas: {
      Envelope: {
        type: "object",
        properties: {
          data: {},
          meta: { type: "object" },
          error: {
            nullable: true,
            type: "object",
            properties: { code: { type: "string" }, message: { type: "string" } },
          },
        },
      },
    },
  },
  security: [{ ApiKeyAuth: [] }],
  paths: {
    "/companies": {
      get: {
        summary: "List companies (cursor pagination)",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
          { name: "cursor", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "unicorn", in: "query", schema: { type: "boolean" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["trending", "growth", "raised", "newest"] } },
        ],
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Envelope" } } } } },
      },
      post: { summary: "Create a company", responses: { "201": { description: "Created" } } },
    },
    "/companies/trending": {
      get: {
        summary: "Top trending companies (computed trendingScore, cached 10m)",
        parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 12, maximum: 50 } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/companies/{slug}": { get: { summary: "Company detail", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" }, "404": { description: "Not found" } } } },
    "/companies/{slug}/funding": { get: { summary: "Funding rounds", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } } },
    "/companies/{slug}/products": { get: { summary: "Company products", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } } },
    "/companies/{slug}/graph": { get: { summary: "Ecosystem graph (nodes + edges)", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } } },
    "/companies/{slug}/claim": { post: { summary: "Claim a company profile", parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }], responses: { "202": { description: "Pending review" } } } },
    "/investors": { get: { summary: "List investors", responses: { "200": { description: "OK" } } } },
    "/investors/most-active": { get: { summary: "Most active investors", responses: { "200": { description: "OK" } } } },
    "/investors/{slug}": { get: { summary: "Investor profile", responses: { "200": { description: "OK" } } } },
    "/investors/{slug}/investments": { get: { summary: "Recent investments", responses: { "200": { description: "OK" } } } },
    "/investors/{slug}/co-investors": { get: { summary: "Co-investor network", responses: { "200": { description: "OK" } } } },
    "/products": { get: { summary: "List products", responses: { "200": { description: "OK" } } } },
    "/products/{slug}": { get: { summary: "Product detail", responses: { "200": { description: "OK" } } } },
    "/news": { get: { summary: "List news", responses: { "200": { description: "OK" } } } },
    "/news/trending": { get: { summary: "Trending news", responses: { "200": { description: "OK" } } } },
    "/feed": { get: { summary: "Global activity feed (cached 10m)", responses: { "200": { description: "OK" } } } },
    "/search": { get: { summary: "Cross-entity search", parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }], responses: { "200": { description: "OK" } } } },
    "/stats": { get: { summary: "Platform statistics (cached 10m)", responses: { "200": { description: "OK" } } } },
    "/founders/{slug}": { get: { summary: "Founder profile", responses: { "200": { description: "OK" } } } },
  },
} as const;
