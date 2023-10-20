import { MergeOperation } from "../types";
import { ensure } from "../validation";

const prefixOp: MergeOperation = {
  modifier: "prefix",
  operate(target, merge) {
    ensure(typeof target === "string", `$prefix can only target strings.`);
    ensure(
      typeof merge === "string",
      `The parameter for $prefix must be a string.`
    );

    return merge + target;
  },
};

export default prefixOp;
