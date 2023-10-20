import { MergeOperation } from "../types";

const clearOp: MergeOperation = {
  modifier: "clear",
  operate(target, merge) {
    return undefined;
  },
};

export default clearOp;
