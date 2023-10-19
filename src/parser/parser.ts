import { resolve } from "node:path";
import stripBom from "strip-bom";

import {
  JSONPath,
  JSONVisitor,
  ParseErrorCode,
  printParseErrorCode,
  visit,
} from "jsonc-parser";
import { autobind } from "core-decorators";

import { readFileAsync } from "../fs";

import { ParsedJsonArray, ParsedJsonValue } from "./types";
import { LocationData } from "./location";

export async function parseFile(filePath: string): Promise<ParsedJsonValue> {
  filePath = resolve(filePath);
  const contents = await readFileAsync(filePath, "utf-8");
  return parse(filePath, stripBom(contents));
}

export function parse(fileName: string, contents: string): ParsedJsonValue {
  const parser = new Parser(fileName, contents);
  visit(contents, parser, {
    allowTrailingComma: true,
  });

  return parser.result();
}

interface ParserStackItem {
  value: any;
  key: string | number | null;
}

class Parser implements JSONVisitor {
  private _root: ParsedJsonValue | undefined = undefined;
  private readonly _objectStack: ParserStackItem[] = [];

  constructor(
    private readonly _filePath: string,
    private readonly _contents: string
  ) {}

  result(): ParsedJsonValue {
    if (this._objectStack.length !== 0) {
      throw new Error("Invalid state: Not finished parsing");
    }

    if (!this._root) {
      throw new Error("Invalid state: Root object is undefined");
    }

    return this._root;
  }

  @autobind()
  onObjectProperty(
    property: string,
    offset: number,
    length: number,
    startLine: number,
    startCharacter: number,
    pathSupplier: () => JSONPath
  ) {
    this._queue(property);
  }

  @autobind()
  onSeparator(
    character: string,
    offset: number,
    length: number,
    startLine: number,
    startCharacter: number
  ) {
    if (character !== ",") {
      return;
    }

    const current = this._current();
    if (Array.isArray(current.value)) {
      this._queue(current.value.length);
    } else {
      current.key = null;
    }
  }

  @autobind()
  onObjectBegin(
    offset: number,
    length: number,
    startLine: number,
    startCharacter: number,
    pathSupplier: () => JSONPath
  ) {
    const object: ParsedJsonValue = {
      [LocationData]: {
        filePath: this._filePath,
        startLine,
        startCharacter,
        path: pathSupplier(),
      },
    };

    this._push(object);
  }

  @autobind()
  onArrayBegin(
    offset: number,
    length: number,
    startLine: number,
    startCharacter: number,
    pathSupplier: () => JSONPath
  ) {
    const array: ParsedJsonArray = [] as any;
    array[LocationData] = {
      filePath: this._filePath,
      startLine,
      startCharacter,
      path: pathSupplier(),
    };

    this._push(array, 0);
  }

  @autobind()
  onLiteralValue(
    value: any,
    offset: number,
    length: number,
    startLine: number,
    startCharacter: number,
    pathSupplier: () => JSONPath
  ) {
    const current = this._objectStack[this._objectStack.length - 1];
    if (!current) {
      throw new Error(
        "Invalid state: Parser does not support literal values outside of objects."
      );
    }

    if (current.key == null) {
      console.log(JSON.stringify(this._objectStack, null, 2));
      throw new Error("Invalid state: Literal value without key.");
    }

    current.value[current.key] = value;
  }

  @autobind()
  onObjectEnd() {
    this._pop();
  }

  @autobind()
  onArrayEnd() {
    this._pop();
  }

  @autobind()
  onError(
    error: ParseErrorCode,
    offset: number,
    length: number,
    startLine: number,
    startCharacter: number
  ) {
    throw new Error(
      `${this._filePath}: Error parsing JSON: ${printParseErrorCode(
        error
      )} at ${startLine}:${startCharacter}: ${
        this._contents[offset]
      } (${this._contents.charCodeAt(offset)})`
    );
  }

  private _current() {
    const current = this._objectStack[this._objectStack.length - 1];
    if (current == null) {
      throw new Error("Invalid state: Current object is null");
    }

    return current;
  }

  private _queue(key: string | number) {
    const item = this._objectStack[this._objectStack.length - 1];
    item.key = key;
  }

  private _push(
    value: ParsedJsonValue,
    initialKey: string | number | null = null
  ) {
    const item = this._objectStack[this._objectStack.length - 1];

    if (item == null) {
      if (this._root !== undefined) {
        throw new Error("Invalid state: Root object is already set");
      }

      this._root = value;
      this._objectStack.push({ value, key: initialKey });
      return;
    }

    if (item.key == null) {
      throw new Error(
        "Received an object without an indexer when not at the root."
      );
    }

    item.value[item.key] = value;
    this._objectStack.push({ value, key: initialKey });
  }

  private _pop() {
    const item = this._objectStack.pop();
    if (!item) {
      throw new Error("Invalid state: Not in a stack item");
    }
  }
}
