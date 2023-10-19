import { LocationData, ParsedJsonObject, stripLocationDeep } from "../parser";
import { MergeSource, MergeTarget } from "./types";

import { applyMergeProps } from "./apply";

describe.only("apply", function () {
  const location: LocationData = {
    filePath: "test.json",
    startLine: 0,
    startCharacter: 0,
    path: [],
  };

  it("replaces scaler merge values", function () {
    const input: MergeTarget = {
      value: 4,
    };

    const merge: MergeSource = {
      value: 8,
      [LocationData]: location,
    };

    const result = applyMergeProps(input, merge);

    expect(result).toEqual({
      value: 8,
    });
  });

  describe("$add", function () {
    it("inserts dictionary keys", function () {
      const input: MergeTarget = {
        target: {
          foo: 4,
        },
      };

      const merge: MergeSource = {
        target$add: {
          bar: 8,
          [LocationData]: location,
        },
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: {
          foo: 4,
          bar: 8,
        },
      });
    });
  });
});
