const http = require("http");
const https = require("https");
const { randomBytes } = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 8787);
const PUBLIC_DIR = path.join(__dirname, "public");

function requestJson(url, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "user-agent": "quantum-random-site/1.0" } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
        if (body.length > 1024 * 1024) {
          req.destroy(new Error("Response too large"));
        }
      });
      res.on("end", () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.setTimeout(timeoutMs, () => req.destroy(new Error("Request timed out")));
    req.on("error", reject);
  });
}

function isHex(value, expectedBytes) {
  return (
    typeof value === "string" &&
    value.length === expectedBytes * 2 &&
    /^[0-9a-f]+$/i.test(value)
  );
}

async function getQuantumBytes(byteCount) {
  const primaryUrl = `https://quantum.docdailey.ai/random/bytes?count=${byteCount}`;
  const secondaryUrl = `https://lfdr.de/qrng_api/qrng?length=${byteCount}`;

  try {
    const json = await requestJson(primaryUrl);
    const hex = json && json.data && json.data.bytes;
    if (isHex(hex, byteCount)) {
      return {
        bytes: hex.toLowerCase(),
        source: "DocDailey hardware QRNG",
        quantum: true,
        metadata: json.metadata || null,
      };
    }
    throw new Error("Unexpected primary response shape");
  } catch (primaryError) {
    try {
      const json = await requestJson(secondaryUrl);
      const hex = json && json.qrn;
      if (isHex(hex, byteCount)) {
        return {
          bytes: hex.toLowerCase(),
          source: "LfD hardware QRNG",
          quantum: true,
          metadata: { primary_error: primaryError.message },
        };
      }
      throw new Error("Unexpected secondary response shape");
    } catch (secondaryError) {
      return {
        bytes: randomBytes(byteCount).toString("hex"),
        source: "Local crypto fallback",
        quantum: false,
        metadata: {
          primary_error: primaryError.message,
          secondary_error: secondaryError.message,
        },
      };
    }
  }
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  });
  res.end(body);
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
    }[ext] || "application/octet-stream";

    res.writeHead(200, { "content-type": contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/random") {
    const requested = Number(url.searchParams.get("bytes") || 64);
    const byteCount = Math.max(1, Math.min(1024, Math.floor(requested)));
    try {
      sendJson(res, 200, await getQuantumBytes(byteCount));
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
    return;
  }

  if (url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Quantum Random Lab running at http://localhost:${PORT}`);
});
