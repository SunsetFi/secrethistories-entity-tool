import { JsonObject, JsonValue } from "type-fest";

import { ParsedJsonArray, ParsedJsonObject, ParsedJsonValue } from "../parser";

export type MergeSource = ParsedJsonObject;
export type MergeTarget =
  | ParsedJsonObject
  | ParsedJsonArray
  | JsonObject
  | JsonValue[]
  | JsonValue;

export type MergeResult = JsonObject | JsonValue[] | JsonValue | undefined;

export type MergeOperation = {
  /**
   * The string indicating the modification, eg: "foo$dictedit" has a modifier of "dictedit"
   */
  modifier: string;
  operate(target: MergeTarget, merge: ParsedJsonValue): MergeResult;
};
