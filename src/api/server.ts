import { createServer } from "node:http";
import { handleApiRequest } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

const server = createServer(async (request, response) => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  let body: unknown;
  if (chunks.length > 0) {
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "invalid_json", message: "Request body must be valid JSON." }));
      return;
    }
  }

  const result = await handleApiRequest({
    method: request.method ?? "GET",
    path: request.url?.split("?")[0] ?? "/",
    ...(body !== undefined ? { body } : {}),
  });

  response.writeHead(result.status, { "content-type": "application/json" });
  response.end(JSON.stringify(result.body));
});

server.listen(port, () => {
  console.log(`AI Business Automation API listening on http://localhost:${port}`);
});
