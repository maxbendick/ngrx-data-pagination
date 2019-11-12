export type EntityId = string | number;

export type EntityMap<Entity> =
  | { [id: number]: Entity }
  | { [id: string]: Entity };

export interface AnyEntity {
  id: EntityId;
}
