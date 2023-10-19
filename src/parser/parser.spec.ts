import { getLocation, stripLocation, stripLocationDeep } from "./location";
import { parse } from "./parser";
import { ParsedJsonArray, ParsedJsonObject } from "./types";

describe("Parser", function () {
  const filePath = "test.json";

  describe("Objects", function () {
    it("parses an empty object", function () {
      const input = `{}`;
      const output = parse(filePath, input) as ParsedJsonObject;
      const location = getLocation(output);

      expect(stripLocation(output)).toEqual({});
      expect(location).toEqual({
        filePath,
        startLine: 0,
        startCharacter: 0,
        path: [],
      });
    });

    it("parses object properties", function () {
      const input = [`{`, `  "foo": 1,`, `  "bar": "hello"`, `}`].join("\n");

      const output = parse(filePath, input) as ParsedJsonObject;
      const location = getLocation(output);

      expect(stripLocationDeep(output)).toEqual({
        foo: 1,
        bar: "hello",
      });

      expect(location).toEqual({
        filePath,
        startLine: 0,
        startCharacter: 0,
        path: [],
      });
    });

    it("parses nested objects", function () {
      const input = [`{`, `  "foo": {},`, `  "bar": {}`, `}`].join("\n");

      const output = parse(filePath, input) as ParsedJsonObject;
      const location = getLocation(output);

      expect(stripLocationDeep(output)).toEqual({
        foo: {},
        bar: {},
      });

      expect(location).toEqual({
        filePath,
        startLine: 0,
        startCharacter: 0,
        path: [],
      });

      expect(getLocation(output.foo as ParsedJsonObject)).toEqual({
        filePath,
        startLine: 1,
        startCharacter: 9,
        path: ["foo"],
      });

      expect(getLocation(output.bar as ParsedJsonObject)).toEqual({
        filePath,
        startLine: 2,
        startCharacter: 9,
        path: ["bar"],
      });
    });
  });

  describe("arrays", function () {
    it("parses an empty array", function () {
      const input = `[]`;
      const output = parse(filePath, input) as ParsedJsonObject;
      const location = getLocation(output);

      expect(stripLocation(output)).toEqual([]);
      expect(location).toEqual({
        filePath,
        startLine: 0,
        startCharacter: 0,
        path: [],
      });
    });

    it("parses an array of literals", function () {
      const input = `[1, 2, 3]`;
      const output = parse(filePath, input) as ParsedJsonArray;
      const location = getLocation(output);

      expect(stripLocation(output)).toEqual([1, 2, 3]);
      expect(location).toEqual({
        filePath,
        startLine: 0,
        startCharacter: 0,
        path: [],
      });
    });

    it("parses nested arrays", function () {
      const input = `[\n[1],\n[2]\n]`;
      const output = parse(filePath, input) as ParsedJsonArray;
      const location = getLocation(output);

      expect(stripLocationDeep(output)).toEqual([[1], [2]]);
      expect(location).toEqual({
        filePath,
        startLine: 0,
        startCharacter: 0,
        path: [],
      });

      expect(getLocation(output[0] as ParsedJsonArray)).toEqual({
        filePath,
        startLine: 1,
        startCharacter: 0,
        path: [0],
      });

      expect(getLocation(output[1] as ParsedJsonArray)).toEqual({
        filePath,
        startLine: 2,
        startCharacter: 0,
        path: [1],
      });
    });
  });
});
