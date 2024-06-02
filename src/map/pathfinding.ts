import { Point } from "./point";
import { MAP_WALL } from "./constants/map-constants";

interface Node {
  point: Point;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

export class Pathfinding {
  constructor(
    private readonly map: string[][],
    private readonly startPoint: Point,
    private readonly endPoint: Point
  ) {}

  private heuristic(point: Point, endPoint: Point): number {
    // Manhattan distance
    return Math.abs(point.x + point.y - endPoint.x - endPoint.y);
  }

  private isWalkable(point: Point): boolean {
    return (
      point.x >= 0 &&
      point.y >= 0 &&
      point.x < this.map[0].length &&
      point.y < this.map.length &&
      this.map[point.y][point.x] !== MAP_WALL
    );
  }

  search(): Point[] {
    const openList: Node[] = [];
    const closedList: Node[] = [];
    const startNode: Node = {
      point: this.startPoint,
      g: 0,
      h: this.heuristic(this.startPoint, this.endPoint),
      f: 0,
      parent: null,
    };
    startNode.f = startNode.g + startNode.h;
    openList.push(startNode);

    while (openList.length > 0) {
      let lowestFIndex = 0;
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].f < openList[lowestFIndex].f) {
          lowestFIndex = i;
        }
      }
      const currentNode = openList[lowestFIndex];
      // Move the current node to the closed list
      openList.splice(lowestFIndex, 1);
      closedList.push(currentNode);

      // Check if we've reached the end point
      if (
        currentNode.point.x === this.endPoint.x &&
        currentNode.point.y === this.endPoint.y
      ) {
        const path: Point[] = [];
        let curr: Node | null = currentNode;
        while (curr) {
          path.push(curr.point);
          curr = curr.parent;
        }
        return path.reverse();
      }

      // Generate neighbors
      const neighbors = [
        { x: currentNode.point.x, y: currentNode.point.y - 1 },
        { x: currentNode.point.x, y: currentNode.point.y + 1 },
        { x: currentNode.point.x - 1, y: currentNode.point.y },
        { x: currentNode.point.x + 1, y: currentNode.point.y },
      ];
      for (const neighbor of neighbors) {
        const neighborPoint: Point = { x: neighbor.x, y: neighbor.y };
        if (!this.isWalkable(neighborPoint)) continue;

        // Check if the neighbor is already in the closed list
        if (
          closedList.find(
            (node) =>
              node.point.x === neighborPoint.x &&
              node.point.y === neighborPoint.y
          )
        ) {
          continue;
        }

        const gScore = currentNode.g + 1;
        let neighborNode = openList.find(
          (node) =>
            node.point.x === neighborPoint.x && node.point.y === neighborPoint.y
        );

        if (!neighborNode) {
          neighborNode = {
            point: neighborPoint,
            g: gScore,
            h: this.heuristic(neighborPoint, this.endPoint),
            f: 0,
            parent: currentNode,
          };
          neighborNode.f = neighborNode.g + neighborNode.h;
          openList.push(neighborNode);
        } else if (gScore < neighborNode.g) {
          neighborNode.g = gScore;
          neighborNode.f = neighborNode.g + neighborNode.h;
          neighborNode.parent = currentNode;
        }
      }
    }
    return [];
  }
}
