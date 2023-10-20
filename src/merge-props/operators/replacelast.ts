import { isJsonObject } from "../../types";

import { MergeOperation } from "../types";
import { ensure } from "../validation";

const replacelastOp: MergeOperation = {
  modifier: "replacelast",
  operate(target, merge) {
    ensure(typeof target === "string", `$prefix can only target strings.`);
    ensure(isJsonObject(merge), `The parameter for $prefix must be an object.`);
    ensure(
      Object.values(merge).every((x) => typeof x === "string"),
      `The parameter for $prefix must be an object of strings.`
    );

    for (const key of Object.keys(merge)) {
      target = replaceLast(target, key, String(merge[key]));
    }

    return target;
  },
};

function replaceLast(str: string, find: string, replace: string): string {
  const lastIndex = str.lastIndexOf(find);
  if (lastIndex === -1) {
    return str;
  }

  const before = str.substring(0, lastIndex);
  const after = str.substring(lastIndex + find.length);
  return before + replace + after;
}

export default replacelastOp;
