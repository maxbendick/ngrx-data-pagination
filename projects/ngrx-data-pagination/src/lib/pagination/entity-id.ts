export type EntityId = string | number;

export type EntityMap<Entity> = { [id: string]: Entity } | { [id: string]: Entity };
