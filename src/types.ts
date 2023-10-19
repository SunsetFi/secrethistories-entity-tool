import { JsonObject } from "type-fest";

export function isJsonObject(value: any): value is JsonObject {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

export function isJsonArray(value: any): value is any[] {
  return Array.isArray(value);
}
