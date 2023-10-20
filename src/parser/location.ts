import { JSONPath } from "jsonc-parser";
import { JsonArray, JsonObject } from "type-fest";
import { mapValues, omit } from "lodash";

export const LocationData = Symbol("LocationData");
export interface LocationData {
  filePath: string;
  startLine: number;
  startCharacter: number;
  path: JSONPath;
}

export type LocationAware<T> = T & {
  [LocationData]: LocationData;
};

export function getLocation<T extends JsonArray | JsonObject>(
  parsed: LocationAware<T>
): LocationData {
  return (parsed as any)[LocationData] as LocationData;
}

export function setLocation<T extends JsonArray | JsonObject>(
  obj: T,
  location: LocationData
): LocationAware<T> {
  (obj as any)[LocationData] = location;
  return obj as any;
}

export function stripLocation<T extends JsonArray | JsonObject>(
  parsed: LocationAware<T>
): T {
  if (Array.isArray(parsed)) {
    return parsed.slice() as any;
  }

  if (typeof parsed === "object") {
    return omit(parsed, LocationData) as any;
  }

  return parsed;
}

// FIXME: Recursive typing return value;
export function stripLocationDeep<T extends JsonArray | JsonObject>(
  parsed: LocationAware<T>
): T {
  if (Array.isArray(parsed)) {
    return parsed.map((item) => {
      if (item && typeof item === "object") {
        return stripLocationDeep(item as any);
      }
      return item;
    }) as any;
  }

  if (typeof parsed === "object") {
    return mapValues(omit(parsed, LocationData), stripLocationDeep) as any;
  }

  return parsed;
}

export function clone<T extends LocationAware<any>>(value: T): T {
  if (Array.isArray(value)) {
    const newValue = value.slice() as any;
    newValue[LocationData] = (value as any)[LocationData];
    return newValue;
  } else if (value && typeof value === "object") {
    const newValue = { ...value } as any;
    newValue[LocationData] = (value as any)[LocationData];
    return newValue;
  }

  return value;
}
