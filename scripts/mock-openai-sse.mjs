// Mock OpenAI SSE endpoint for verifying the /api/chat streaming contract
// locally without a real API key. Run: node scripts/mock-openai-sse.mjs
// Then boot a dev server with OPENAI_BASE_URL=http://127.0.0.1:9899/v1 and
// OPENAI_API_KEY=sk-test.
import { createServer } from "node:http";

const PORT = 9899;

createServer((req, res) => {
  if (req.method === "POST" && req.url === "/v1/chat/completions") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      const chunks = [
        "Bakı ",
        "Dövlət ",
        "Universiteti ",
        "1919-cu ",
        "ildə ",
        "yaradılıb.",
      ];
      let i = 0;
      const timer = setInterval(() => {
        if (i < chunks.length) {
          res.write(
            `data: ${JSON.stringify({ choices: [{ delta: { content: chunks[i] } }] })}\n\n`,
          );
          i++;
        } else {
          res.write("data: [DONE]\n\n");
          clearInterval(timer);
          res.end();
        }
      }, 30);
    });
    return;
  }
  res.writeHead(404);
  res.end("not found");
}).listen(PORT, "127.0.0.1", () =>
  console.log(`mock SSE listening on ${PORT}`),
);
