import {
  MAP_WALL,
  MAP_ENTRANCE,
  MAP_EXIT,
  MAP_FLOOR,
} from "./constants/map-constants";
import { Point } from "./point";
import { Pathfinding } from "./pathfinding";

export class MapGenerator {
  private width: number;
  private height: number;
  private map: string[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.map = [];
  }

  public generateMap(): string[][] {
    this.map = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(MAP_FLOOR));

    const entrancePoint = this.addEntrance();
    const exitPoint = this.addExit();
    this.addWalls();

    this.assertShortestPathToExit(entrancePoint, exitPoint);

    return this.map;
  }

  private addWalls() {
    for (let x = 0; x < this.width; x++) {
      this.map[0][x] = MAP_WALL;
      this.map[this.height - 1][x] = MAP_WALL;
    }
    for (let y = 0; y < this.height; y++) {
      this.map[y][0] = MAP_WALL;
      this.map[y][this.width - 1] = MAP_WALL;
    }

    // Add random interior walls using a random walk
    let startX = Math.floor(Math.random() * (this.width - 4)) + 2; // Start within the map
    let startY = Math.floor(Math.random() * (this.height - 4)) + 2; // Start within the map

    let steps = 50; // Number of steps to take
    let directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ]; // Up, down, left, right

    while (steps > 0) {
      const direction =
        directions[Math.floor(Math.random() * directions.length)]; // Random direction
      const newX = startX + direction[0];
      const newY = startY + direction[1];

      if (
        this.map[newY][newX] !== MAP_WALL ||
        this.map[newY][newX] !== MAP_ENTRANCE ||
        this.map[newY][newX] !== MAP_EXIT
      ) {
        this.map[newY][newX] = MAP_WALL; // Add wall if not already a wall
      }

      startX = newX;
      startY = newY;

      steps--;
    }
  }

  private addEntrance(): Point {
    const entranceY = Math.floor(Math.random() * (this.height - 4)) + 2; // Avoid borders
    const entranceX = Math.floor(Math.random() * (this.width - 4)) + 2; // Avoid borders
    this.map[entranceY][entranceX] = MAP_ENTRANCE;
    return { x: entranceX, y: entranceY };
  }

  private addExit(): Point {
    const exitY = Math.floor(Math.random() * (this.height - 4)) + 2; // Avoid borders
    const exitX = Math.floor(Math.random() * (this.width - 4)) + 2; // Avoid borders
    this.map[exitY][exitX] = MAP_EXIT;
    return { x: exitX, y: exitY };
  }

  private assertShortestPathToExit(entrance: Point, exit: Point) {
    const path = new Pathfinding(this.map, entrance, exit).search();

    path.forEach((point) => {
      this.map[point.x][point.y] = MAP_FLOOR;
    });
  }
}
