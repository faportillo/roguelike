import { MapGenerator, MapType } from "./map-generator";
import { MapListNode } from "./map-list-node";
import { Point } from "./point";

export class MapList {
  private head: MapListNode | null;
  private tail: MapListNode | null;
  private width: number;
  private height: number;
  private tileSize: number;

  constructor(width: number, height: number, tileSize: number) {
    this.head = null;
    this.tail = null;
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
  }

  public generateAndAddMap(mapType: MapType = MapType.DUNGEON): void {
    const mapGenerator = new MapGenerator(this.width, this.height, mapType);
    const map = mapGenerator.generateMap();
    const entrancePoint = mapGenerator.entrancePoint;
    const exitPoint = mapGenerator.exitPoint;

    const newNode = new MapListNode(map, entrancePoint, exitPoint);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      if (this.tail) this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  public getHead(): MapListNode | null {
    return this.head;
  }

  public getTail(): MapListNode | null {
    return this.tail;
  }
}
