import { isJsonArray } from "../../types";

import { MergeOperation } from "../types";

import { ensure } from "../validation";

const prependOp: MergeOperation = {
  modifier: "append",
  operate(target, merge) {
    ensure(isJsonArray(target), `$append can only target arrays.`);
    ensure(isJsonArray(merge), `The parameter for $append must be an array.`);

    const newTarget = target.slice();
    newTarget.push(...merge);
    return newTarget;
  },
};

export default prependOp;
