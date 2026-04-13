/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed
      .slice(equalsIndex + 1)
      .trim()
      .replace(/^['\"]|['\"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(__dirname, "..", ".env"));

async function resolveSchemaFile(schemaPathOrUrl) {
  if (!schemaPathOrUrl) {
    return schemaPathOrUrl;
  }

  if (!/^https?:\/\//i.test(schemaPathOrUrl)) {
    return schemaPathOrUrl;
  }

  const response = await fetch(schemaPathOrUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch schema from ${schemaPathOrUrl}: ${response.status} ${response.statusText}`,
    );
  }

  const tempFilePath = path.join(os.tmpdir(), "edura-rtk-query-schema.json");

  const responseText = await response.text();
  if (responseText.includes("swagger-ui-init.js")) {
    const docsBaseUrl = schemaPathOrUrl.endsWith("/")
      ? schemaPathOrUrl
      : `${schemaPathOrUrl}/`;
    const initUrl = new URL("swagger-ui-init.js", docsBaseUrl).href;
    const initResponse = await fetch(initUrl);
    if (!initResponse.ok) {
      throw new Error(
        `Failed to fetch Swagger UI init script from ${initUrl}: ${initResponse.status} ${initResponse.statusText}`,
      );
    }

    const initText = await initResponse.text();
    const swaggerDoc = extractJsonObject(initText, '"swaggerDoc"');
    fs.writeFileSync(tempFilePath, swaggerDoc, "utf8");
    return tempFilePath;
  }

  fs.writeFileSync(tempFilePath, responseText, "utf8");
  return tempFilePath;
}

function extractJsonObject(sourceText, keyMarker) {
  const keyIndex = sourceText.indexOf(keyMarker);
  if (keyIndex === -1) {
    throw new Error(`Could not locate ${keyMarker} in Swagger UI init script`);
  }

  const openBraceIndex = sourceText.indexOf("{", keyIndex);
  if (openBraceIndex === -1) {
    throw new Error(`Could not locate JSON object for ${keyMarker}`);
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = openBraceIndex; index < sourceText.length; index += 1) {
    const character = sourceText[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      continue;
    }

    if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;
      if (depth === 0) {
        return sourceText.slice(openBraceIndex, index + 1);
      }
    }
  }

  throw new Error(`Could not parse JSON object for ${keyMarker}`);
}

process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: "commonjs",
  moduleResolution: "node10",
  target: "es6",
});

(async () => {
  if (process.env.RTK_QUERY_SCHEMA_PATH) {
    process.env.RTK_QUERY_SCHEMA_PATH = await resolveSchemaFile(
      process.env.RTK_QUERY_SCHEMA_PATH,
    );
  }

  const result = spawnSync(
    "npx",
    ["@rtk-query/codegen-openapi", "rtk-codegen.cjs"],
    {
      stdio: "inherit",
      shell: true,
      env: process.env,
    },
  );

  process.exit(result.status ?? 1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
