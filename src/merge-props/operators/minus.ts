import { MergeOperation } from "../types";
import { ensure } from "../validation";

const minusOp: MergeOperation = {
  modifier: "minus",
  operate(target, merge) {
    ensure(typeof target === "number", `$minus can only target numbers.`);
    ensure(
      typeof merge === "number",
      `The parameter for $minus must be a number.`
    );

    return target - merge;
  },
};

export default minusOp;
