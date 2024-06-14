import { Point } from "../map/point";
import { ENTITY_TILE_SIZE } from "./constants/entity-constants";
export interface EntityParams {
  position: Point;
  character?: string;
  fillStyle?: "red";
}

export class Entity {
  public position: Point;
  public char: string;
  public fillStyle: string;

  constructor(position: Point, char: string, fillStyle: string) {
    this.position = position;
    this.char = char;
    this.fillStyle = fillStyle;
  }

  public move(newX: number, newY: number) {
    this.position.x = newX;
    this.position.y = newY;
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.fillStyle;
    context.font = `${ENTITY_TILE_SIZE}px monospace`;
    context.textBaseline = "top";
    context.fillText(
      this.char,
      this.position.x * ENTITY_TILE_SIZE + ENTITY_TILE_SIZE / 6,
      this.position.y * ENTITY_TILE_SIZE
    );
  }
}
