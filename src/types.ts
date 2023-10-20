import { JsonObject } from "type-fest";

export function isJsonObject(value: any): value is JsonObject {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

export function isJsonArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isJsonPrimitive(
  value: any
): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}
