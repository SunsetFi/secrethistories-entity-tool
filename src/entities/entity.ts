import type { Opaque } from "type-fest";

export type EntityId = Opaque<string, "EntityId">;

export interface EntityBase {
  id: EntityId;
}
