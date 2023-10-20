import { isJsonObject } from "../../types";

import { MergeOperation } from "../types";
import { ensure } from "../validation";

const replaceOp: MergeOperation = {
  modifier: "replace",
  operate(target, merge) {
    ensure(typeof target === "string", `$prefix can only target strings.`);
    ensure(isJsonObject(merge), `The parameter for $prefix must be an object.`);
    ensure(
      Object.values(merge).every((x) => typeof x === "string"),
      `The parameter for $prefix must be an object of strings.`
    );

    for (const key of Object.keys(merge)) {
      target = replaceAll(target, key, String(merge[key]));
    }

    return target;
  },
};

function replaceAll(str: string, find: string, replace: string): string {
  let lastIndex = 0;
  let result = "";

  while (true) {
    const index = str.indexOf(find, lastIndex);
    if (index === -1) {
      break;
    }

    result += str.substring(lastIndex, index) + replace;
    lastIndex = index + find.length;
  }

  result += str.substring(lastIndex);
  return result;
}

export default replaceOp;
