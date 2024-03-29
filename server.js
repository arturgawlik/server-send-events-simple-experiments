import {
  Http2ServerRequest,
  Http2ServerResponse,
  createSecureServer,
} from "node:http2";
import { createReadStream, readFileSync } from "node:fs";

// using http 2.0 because of limit to only 6 connections per_browser/per_domain on http 1.x
createSecureServer(
  {
    key: readFileSync(new URL("./key.pem", import.meta.url)), // also need https becouse of Chrome don't accept http 2 without TLS
    cert: readFileSync(new URL("./cert.pem", import.meta.url)),
  },
  (req, res) => {
    if (req.url.includes("sse")) {
      handleSSE(req, res);
    } else {
      createReadStream(new URL("./index.html", import.meta.url)).pipe(res);
    }
  }
).listen(8000, () => console.log("server listening on https://localhost:8000"));

/**
 * @param {Http2ServerRequest} req
 * @param {Http2ServerResponse} res
 */
function handleSSE(req, res) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive", // ?? no need in case of http 2??
  };

  res.writeHead(200, headers);
  res.write("data: heloooo\n\n");

  let i = 1;
  const intervalId = setInterval(() => {
    res.write(`data: message number ${i++}, and will continue...\n\n`);
  }, 5000);

  console.log("connection opened...");
  req.on("close", () => {
    clearInterval(intervalId);
    console.log("connection closed...");
  });
}
