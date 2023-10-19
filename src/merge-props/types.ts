import { JsonArray, JsonObject } from "type-fest";

import { ParsedJsonArray, ParsedJsonObject, ParsedJsonValue } from "../parser";

export type MergeSource = ParsedJsonObject;
export type MergeTarget =
  | ParsedJsonObject
  | ParsedJsonArray
  | JsonObject
  | JsonArray;

export type MergeOperation = {
  /**
   * The string indicating the modification, eg: "foo$dictedit" has a modifier of "dictedit"
   */
  modifier: string;
  operate(target: MergeTarget, merge: ParsedJsonValue): MergeTarget;
};
