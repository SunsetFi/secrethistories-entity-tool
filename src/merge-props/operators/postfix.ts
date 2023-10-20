import { MergeOperation } from "../types";
import { ensure } from "../validation";

const postfixOp: MergeOperation = {
  modifier: "postfix",
  operate(target, merge) {
    ensure(typeof target === "string", `$postfix can only target strings.`);
    ensure(
      typeof merge === "string",
      `The parameter for $postfix must be a string.`
    );

    return target + merge;
  },
};

export default postfixOp;
