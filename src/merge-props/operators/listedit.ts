import { uniq } from "lodash";
import { JsonObject } from "type-fest";

import { isJsonArray, isJsonObject } from "../../types";

import { MergeOperation } from "../types";
import { applyMergeProps } from "../apply";

import { ensure } from "../validation";

const listeditOp: MergeOperation = {
  modifier: "listedit",
  operate(target, merge) {
    ensure(isJsonArray(target), `$listedit can only target arrays.`);
    ensure(
      isJsonObject(merge),
      `The parameter for $listedit must be an object.`
    );

    // We want to recurse into more merges, and our keys may be middle-indexes like 1.5, so
    // handle them as objects first before building the list
    const targetAsObject = Object.values(target).reduce((acc, value, index) => {
      acc[index] = value;
      return acc;
    }, {} as any);

    const processedObject = applyMergeProps(
      targetAsObject,
      merge
    ) as JsonObject;

    let newValue: any[] = [];

    // Rebuild the array with sorted keys, to handle decimalized indexes.
    const keys = uniq(Object.keys(processedObject).map(Number)).sort();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // Guarenteed to be one of these
      const value = processedObject[key];
      newValue.push(value);
    }

    return newValue;
  },
};

export default listeditOp;
