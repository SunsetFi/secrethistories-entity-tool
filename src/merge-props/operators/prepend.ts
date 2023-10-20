import { isJsonArray } from "../../types";

import { MergeOperation } from "../types";

import { ensure } from "../validation";

const prependOp: MergeOperation = {
  modifier: "prepend",
  operate(target, merge) {
    ensure(isJsonArray(target), `$prepend can only target arrays.`);
    ensure(isJsonArray(merge), `The parameter for $prepend must be an array.`);

    const newTarget = target.slice();
    newTarget.unshift(...merge);
    return newTarget;
  },
};

export default prependOp;
