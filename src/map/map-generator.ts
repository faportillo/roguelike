import {
  MAP_WALL,
  MAP_ENTRANCE,
  MAP_EXIT,
  MAP_FLOOR,
} from "./constants/map-constants";
import { Point } from "./point";
import { Pathfinding } from "./pathfinding";

export enum MapType {
  OPEN = "open",
  DUNGEON = "dungeon",
}

export enum Side {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
}

export class MapGenerator {
  public entrancePoint: Point = <Point>{ x: 0, y: 0 };
  public exitPoint: Point = <Point>{ x: 0, y: 0 };
  public entranceSide: Side | null = null;

  private width: number;
  private height: number;
  private map: string[][];
  private mapType: MapType;

  constructor(
    width: number,
    height: number,
    mapType: MapType,
    entranceSide: Side | null = null
  ) {
    this.width = width;
    this.height = height;
    this.map = [];
    this.mapType = mapType;
    this.entranceSide = entranceSide;
  }

  public generateMap(): string[][] {
    /**
     * Update this later as different map types get added
     */
    this.map = new Array(this.height)
      .fill(null)
      .map(() =>
        new Array(this.width).fill(
          this.mapType == MapType.OPEN ? MAP_FLOOR : MAP_WALL
        )
      );

    this.addWalls();

    if (this.entranceSide === null) {
      // Generate random entrance side for the first time
      const sides = [Side.LEFT, Side.RIGHT, Side.TOP, Side.BOTTOM];
      this.entranceSide = sides[Math.floor(Math.random() * sides.length)];
    }

    this.entrancePoint = this.generateEntrancePoint(this.entranceSide);
    this.exitPoint = this.generateMirroredAndFlippedPoint(this.entrancePoint);

    this.map = this.assertShortestPath(this.entrancePoint, this.exitPoint);

    // Fill in walls along the entrance and exit sides
    this.fillWallsAlongSide(this.entranceSide);
    const exitSide = this.getOppositeSide(this.entranceSide);
    this.fillWallsAlongSide(exitSide);
    this.map[this.entrancePoint.y][this.entrancePoint.x] = MAP_ENTRANCE;
    this.map[this.exitPoint.y][this.exitPoint.x] = MAP_EXIT;

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

    // Set random amount of walls
    if (this.mapType === MapType.OPEN) {
      for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        this.addInteriorWalls();
      }
    }
  }

  private addInteriorWalls(): string[][] {
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
        this.map[newY][newX] !== MAP_WALL &&
        this.map[newY][newX] !== MAP_ENTRANCE &&
        this.map[newY][newX] !== MAP_EXIT
      ) {
        this.map[newY][newX] = MAP_WALL; // Add wall if not already a wall
      }

      startX = newX;
      startY = newY;

      steps--;
    }
    return this.map;
  }

  private generateEntrancePoint(side: Side): Point {
    switch (side) {
      case Side.LEFT:
        return <Point>{ x: 1, y: Math.floor(Math.random() * this.height) };
      case Side.RIGHT:
        return <Point>{
          x: this.width - 2,
          y: Math.floor(Math.random() * this.height),
        };
      case Side.TOP:
        return <Point>{ x: Math.floor(Math.random() * this.width), y: 1 };
      case Side.BOTTOM:
        return <Point>{
          x: Math.floor(Math.random() * this.width),
          y: this.height - 2,
        };
      default:
        return <Point>{ x: 0, y: 0 };
    }
  }

  private generateMirroredAndFlippedPoint(point: Point): Point {
    return <Point>{
      x: this.width - 1 - point.x,
      y: this.height - 1 - point.y,
    };
  }

  private assertShortestPath(
    startPoint: Point,
    endPoint: Point,
    radius: number = Math.floor(Math.random() * (5 - 1) + 1)
  ): string[][] {
    const pathfinding = new Pathfinding(this.map, startPoint, endPoint);
    const pathSearch = pathfinding.search();

    const finalPath = pathSearch.length
      ? pathSearch
      : pathfinding.createDirectPath(startPoint, endPoint);

    finalPath.forEach((point) => {
      if (
        this.map[point.y][point.x] !== MAP_ENTRANCE &&
        this.map[point.y][point.x] !== MAP_EXIT
      ) {
        this.map[point.y][point.x] = MAP_FLOOR;
        this.clearRadiusAroundPoint(point, radius);
      }
    });

    return this.map;
  }

  private clearRadiusAroundPoint(point: Point, radius: number) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const newX = point.x + dx;
        const newY = point.y + dy;
        if (
          newX >= 0 &&
          newY >= 0 &&
          newX < this.width &&
          newY < this.height &&
          this.map[newY][newX] !== MAP_ENTRANCE &&
          this.map[newY][newX] !== MAP_EXIT
        ) {
          this.map[newY][newX] = MAP_FLOOR;
        }
      }
    }
  }

  private fillWallsAlongSide(side: Side) {
    switch (side) {
      case Side.LEFT:
        for (let y = 0; y < this.height; y++) {
          this.map[y][0] = MAP_WALL;
        }
        break;
      case Side.RIGHT:
        for (let y = 0; y < this.height; y++) {
          this.map[y][this.width - 1] = MAP_WALL;
        }
        break;
      case Side.TOP:
        for (let x = 0; x < this.width; x++) {
          this.map[0][x] = MAP_WALL;
        }
        break;
      case Side.BOTTOM:
        for (let x = 0; x < this.width; x++) {
          this.map[this.height - 1][x] = MAP_WALL;
        }
        break;
    }
  }

  private getOppositeSide(side: Side): Side {
    switch (side) {
      case Side.LEFT:
        return Side.RIGHT;
      case Side.RIGHT:
        return Side.LEFT;
      case Side.TOP:
        return Side.BOTTOM;
      case Side.BOTTOM:
        return Side.TOP;
    }
  }
}
