import { MergeOperation } from "../types";
import { ensure } from "../validation";

const plusOp: MergeOperation = {
  modifier: "plus",
  operate(target, merge) {
    ensure(typeof target === "number", `$plus can only target numbers.`);
    ensure(
      typeof merge === "number",
      `The parameter for $plus must be a number.`
    );

    return target + merge;
  },
};

export default plusOp;
