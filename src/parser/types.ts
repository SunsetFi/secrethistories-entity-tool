import { JsonArray, JsonPrimitive } from "type-fest";

import { LocationAware } from "./location";

export type ParsedJsonArray = LocationAware<JsonArray>;
export type ParsedJsonObject = LocationAware<{
  [Key in string]: ParsedJsonValue;
}>;

export type ParsedJsonValue =
  | JsonPrimitive
  | ParsedJsonObject
  | ParsedJsonArray;
