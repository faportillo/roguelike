import { Point } from "./point";

export class MapListNode {
  public prev: MapListNode | null;
  public next: MapListNode | null;
  public map: string[][];
  public entrancePoint: Point;
  public exitPoint: Point;

  constructor(
    map: string[][],
    entrancePoint: Point,
    exitPoint: Point,
    prev: MapListNode | null = null,
    next: MapListNode | null = null
  ) {
    this.map = map;
    this.entrancePoint = entrancePoint;
    this.exitPoint = exitPoint;
    this.prev = prev;
    this.next = next;
  }
}
