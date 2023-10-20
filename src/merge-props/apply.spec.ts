import {
  LocationData,
  ParsedJsonObject,
  setLocation,
  stripLocationDeep,
} from "../parser";
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

  describe("$remove", function () {
    it("removes dictionary keys", function () {
      const input: MergeTarget = {
        target: {
          foo: 4,
          bar: 8,
        },
      };

      const merge: MergeSource = {
        target$remove: setLocation(["bar"], location),
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: {
          foo: 4,
        },
      });
    });
  });

  describe("$dictedit", function () {
    it("replaces dictionary keys", function () {
      const input: MergeTarget = {
        target: {
          foo: 4,
          bar: 8,
        },
      };

      const merge: MergeSource = {
        target$dictedit: {
          foo: 16,
          [LocationData]: location,
        },
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: {
          foo: 16,
          bar: 8,
        },
      });
    });

    it("recurses into more operators", function () {
      const input: MergeTarget = {
        target: {
          target2: {
            foo: 2,
          },
        },
      };

      const merge: MergeSource = {
        target$dictedit: {
          target2$add: {
            bar: 8,
            [LocationData]: location,
          },
          [LocationData]: location,
        },
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: {
          target2: {
            foo: 2,
            bar: 8,
          },
        },
      });
    });
  });

  describe("$prepend", function () {
    it("prepends to arrays", function () {
      const input: MergeTarget = {
        target: [1, 2, 3],
      };

      const merge: MergeSource = {
        target$prepend: setLocation([42], location),
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: [42, 1, 2, 3],
      });
    });
  });

  describe("$append", function () {
    it("appends to arrays", function () {
      const input: MergeTarget = {
        target: [1, 2, 3],
      };

      const merge: MergeSource = {
        target$append: setLocation([42], location),
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: [1, 2, 3, 42],
      });
    });
  });

  describe("$listedit", function () {
    it("replaces indexes", function () {
      const input: MergeTarget = {
        target: [1, 2, 3],
      };

      const merge: MergeSource = {
        target$listedit: {
          1: 42,
          [LocationData]: location,
        },
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: [1, 42, 3],
      });
    });

    it("inserts indexes", function () {
      const input: MergeTarget = {
        target: [1, 2, 3],
      };

      const merge: MergeSource = {
        target$listedit: {
          1.5: 42,
          [LocationData]: location,
        },
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: [1, 2, 42, 3],
      });
    });

    it("recurses merge ops", function () {
      const input: MergeTarget = {
        target: [
          {
            foo: 1,
          },
        ],
      };

      const merge: MergeSource = {
        target$listedit: {
          "0$add": {
            bar: 2,
            [LocationData]: location,
          },
          [LocationData]: location,
        },
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: [
          {
            foo: 1,
            bar: 2,
          },
        ],
      });
    });
  });

  describe("$clear", function () {
    it("removes the property", function () {
      const input: MergeTarget = {
        target: 42,
      };

      const merge: MergeSource = {
        target$clear: "",
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({});
    });
  });

  describe("$minus", function () {
    it("subtracts from the property value", function () {
      const input: MergeTarget = {
        target: 42,
      };

      const merge: MergeSource = {
        target$minus: 10,
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: 32,
      });
    });
  });

  describe("$plus", function () {
    it("adds to the property value", function () {
      const input: MergeTarget = {
        target: 42,
      };

      const merge: MergeSource = {
        target$plus: 10,
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: 52,
      });
    });
  });

  describe("$prefix", function () {
    it("prefixes the property value", function () {
      const input: MergeTarget = {
        target: "asdf",
      };

      const merge: MergeSource = {
        target$prefix: "#",
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: "#asdf",
      });
    });
  });

  describe("$postfix", function () {
    it("postfixes the property value", function () {
      const input: MergeTarget = {
        target: "asdf",
      };

      const merge: MergeSource = {
        target$postfix: "#",
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: "asdf#",
      });
    });
  });

  describe("$replace", function () {
    it("replaces the matching strings", function () {
      const input: MergeTarget = {
        target: "foo bar baz",
      };

      const merge: MergeSource = {
        target$replace: {
          foo: "123",
          baz: "456",
          [LocationData]: location,
        },
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: "123 bar 456",
      });
    });
  });

  describe("$replacelast", function () {
    it("replaces the last matching strings", function () {
      const input: MergeTarget = {
        target: "foo bar baz foo baz",
      };

      const merge: MergeSource = {
        target$replacelast: {
          foo: "123",
          baz: "456",
          [LocationData]: location,
        },
        [LocationData]: location,
      };

      const result = stripLocationDeep(
        applyMergeProps(input, merge) as ParsedJsonObject
      );

      expect(result).toEqual({
        target: "foo bar baz 123 456",
      });
    });
  });
});
