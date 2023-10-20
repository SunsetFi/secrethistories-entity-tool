import { isJsonObject } from "../../types";

import { MergeOperation } from "../types";

import { applyMergeProps } from "../apply";
import { ensure } from "../validation";

const dictEditOp: MergeOperation = {
  modifier: "dictedit",
  operate(target, merge) {
    ensure(isJsonObject(target), `$dictedit can only target objects.`);
    ensure(
      isJsonObject(merge),
      `The parameter for $dictedit must be an object.`
    );

    return applyMergeProps(target, merge);
  },
};

export default dictEditOp;
