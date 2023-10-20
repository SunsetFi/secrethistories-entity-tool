import { JsonPrimitive } from "type-fest";

import { LocationAware } from "./location";

export type ParsedJsonArray = LocationAware<ParsedJsonValue[]>;
export type ParsedJsonObject = LocationAware<{
  [Key in string]: ParsedJsonValue;
}>;

export type ParsedJsonValue =
  | JsonPrimitive
  | ParsedJsonObject
  | ParsedJsonArray;
