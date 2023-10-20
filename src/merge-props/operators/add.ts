import { isJsonObject } from "../../types";

import { MergeOperation } from "../types";

import { ensure } from "../validation";

const addOp: MergeOperation = {
  modifier: "add",
  operate(target, merge) {
    ensure(isJsonObject(target), `$add can only target objects.`);
    ensure(isJsonObject(merge), `The parameter for $add must be an object.`);

    const newTarget = { ...target };
    for (const key of Object.keys(merge)) {
      newTarget[key] = merge[key];
    }

    return newTarget;
  },
};

export default addOp;
