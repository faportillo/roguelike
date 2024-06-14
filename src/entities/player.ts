// src/Player.ts
import { Entity } from "./entity";
import { PLAYER_CHARACTER } from "./constants/entity-constants";
import { Point } from "../map/point";
import { ENTITY_TILE_SIZE } from "./constants/entity-constants";
import { EntityParams } from "./entity";

export class Player extends Entity {
  constructor(playerParams: EntityParams) {
    super(
      playerParams.position,
      playerParams.character ?? PLAYER_CHARACTER,
      "white"
    );
  }

  setStartingPoint(startingPoint: Point): Player {
    this.position.x = startingPoint.x;
    this.position.y = startingPoint.y;
    return this;
  }
}
