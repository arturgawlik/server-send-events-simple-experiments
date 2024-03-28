import { IncomingMessage, ServerResponse, createServer } from "node:http";
import { createReadStream } from "node:fs";

createServer((req, res) => {
  if (req.url.includes("sse")) {
    handleSSE(req, res);
  } else {
    createReadStream(new URL("./index.html", import.meta.url)).pipe(res);
  }
}).listen(8000, () => console.log("server listening on http://localhost:8000"));

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function handleSSE(req, res) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  };

  res.writeHead(200, headers);
  res.write("data: heloooo\n\n");

  let i = 1;
  setInterval(() => {
    res.write(`data: message number ${i}, and will continue...\n\n`);
  }, 5000);
}
