import { ParsedJsonValue, clone } from "../parser";

import { MergeResult, MergeSource, MergeTarget } from "./types";

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

    const mergeValue = executeMergeOperation(
      mergeOp,
      newValue[keyName],
      merge[key]
    );
    if (mergeValue === undefined) {
      delete newValue[keyName];
    } else {
      newValue[keyName] = mergeValue;
    }
  }

  return newValue;
}

function executeMergeOperation(
  opKey: string,
  input: MergeTarget,
  mergeValue: ParsedJsonValue
): MergeResult {
  const op = mergeOperators.find((x) => x.modifier === opKey);
  if (!op) {
    throw new Error(`Unknown merge operation: ${opKey}`);
  }

  return op.operate(input, mergeValue);
}
