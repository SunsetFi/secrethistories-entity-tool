import { ParsedJsonValue, clone } from "../parser";
import { isJsonArray, isJsonObject } from "../types";

import { MergeSource, MergeTarget } from "./types";
import { fail } from "./validation";

import mergeOperators from "./operators";

export function applyMergeProps(
  target: MergeTarget,
  merge: MergeSource
): MergeTarget {
  const mergeKeys = Object.keys(merge);

  const newValue = clone(target) as any;
  for (const key of mergeKeys) {
    const [keyName, mergeOp] = key.split("$");

    if (!mergeOp) {
      // Basic override
      newValue[key] = merge[key];
      continue;
    }

    const targetValue = newValue[keyName];
    if (!isJsonObject(targetValue) && !isJsonArray(targetValue)) {
      fail(`Cannot apply merge operation to non-object/array.`);
    } else {
      newValue[keyName] = executeMergeOperation(
        mergeOp,
        newValue[keyName],
        merge[key]
      );
    }
  }

  return newValue;
}

function executeMergeOperation(
  opKey: string,
  input: MergeTarget,
  mergeValue: ParsedJsonValue
): MergeTarget {
  const op = mergeOperators.find((x) => x.modifier === opKey);
  if (!op) {
    throw new Error(`Unknown merge operation: ${opKey}`);
  }

  return op.operate(input, mergeValue);
}
