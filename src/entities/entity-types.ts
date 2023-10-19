import { EntityBase } from "./entity";

export type EntityType =
  | "achievements"
  | "cultures"
  | "decks"
  | "dicta"
  | "elements"
  | "endings"
  | "legacies"
  | "recipes"
  | "settings"
  | "verbs";

// TODO: Pick from the type based on TEntityType
export type EntityDefOf<TEntityType extends EntityType> = EntityBase;
