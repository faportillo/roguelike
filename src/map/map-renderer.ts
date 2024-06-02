import {
  MAP_ENTRANCE,
  MAP_EXIT,
  MAP_WALL,
  MAP_ENTRANCE_COLOR,
  MAP_EXIT_COLOR,
  MAP_WALL_COLOR,
} from "./constants/map-constants";

export class MapRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private tileSize: number;
  private map: string[][];

  constructor(canvas: HTMLCanvasElement, map: string[][], tileSize: number) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d")!;
    this.map = map;
    this.tileSize = tileSize;
  }

  public renderMap() {
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tile = this.map[y][x];
        switch (tile) {
          case MAP_WALL:
            this.drawWall(x, y);
            break;
          case MAP_ENTRANCE:
            this.drawEntrance(x, y);
            break;
          case MAP_EXIT:
            this.drawExit(x, y);
            break;
          default:
            // Empty space, do nothing
            break;
        }
      }
    }
  }

  private drawWall(x: number, y: number) {
    this.context.fillStyle = MAP_WALL_COLOR; // You can customize the wall color
    this.context.fillRect(
      x * this.tileSize,
      y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  private drawEntrance(x: number, y: number) {
    this.context.fillStyle = MAP_ENTRANCE_COLOR; // You can customize the entrance color
    this.context.fillRect(
      x * this.tileSize,
      y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  private drawExit(x: number, y: number) {
    this.context.fillStyle = MAP_EXIT_COLOR; // You can customize the exit color
    this.context.fillRect(
      x * this.tileSize,
      y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }
}
