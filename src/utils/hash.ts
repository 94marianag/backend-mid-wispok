import crypto from "crypto";

export function hashBody(body: object) {
  return crypto.createHash("sha256").update(JSON.stringify(body)).digest("hex");
}
