import { EntityType, EntityDefOf } from "./entity-types";

export interface EntityFile<TEntityType extends EntityType> {
  fileName: string;
  parsedContent: EntityFileContent<TEntityType>;
}

export type EntityFileContent<TEntityType extends EntityType> = {
  [K in TEntityType]: EntityDefOf<TEntityType>;
};

export function compareLoadOrder<TEntityType extends EntityType>(
  a: EntityFile<TEntityType>,
  b: EntityFile<TEntityType>
): number {
  return a.fileName.localeCompare(b.fileName);
}
