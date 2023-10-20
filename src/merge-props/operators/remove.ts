import { omit } from "lodash";
import { isJsonArray, isJsonObject } from "../../types";

import { MergeOperation } from "../types";

import { ensure } from "../validation";

const removeOp: MergeOperation = {
  modifier: "remove",
  operate(target, merge) {
    ensure(isJsonObject(target), `$remove can only target objects.`);
    ensure(isJsonArray(merge), `The parameter for $remove must be an array.`);

    ensure(
      merge.every((x) => typeof x === "string"),
      `The parameter for $remove must be an array of strings.`
    );

    return omit(target, merge.map(String));
  },
};

export default removeOp;
