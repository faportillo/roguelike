// src/Player.ts
import { Entity } from "./entity";
import { PLAYER_CHARACTER } from "./constants/entity-constants";

export class Player extends Entity {
  constructor(x: number, y: number) {
    super(x, y, PLAYER_CHARACTER);
  }
}
