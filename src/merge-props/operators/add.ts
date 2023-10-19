import { clone } from "../../parser";
import { isJsonObject } from "../../types";

import { MergeOperation } from "../types";

import { ensure } from "../validation";

const addOp: MergeOperation = {
  modifier: "add",
  operate(target, merge) {
    ensure(isJsonObject(target), `$add can only target objects and arrays.`);
    ensure(isJsonObject(merge), `The parameter for $add must be an object.`);

    target = clone(target);
    for (const key of Object.keys(merge)) {
      target[key] = merge[key];
    }

    return target;
  },
};

export default addOp;
