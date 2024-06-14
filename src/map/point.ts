export class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public manhattanDistance(point: Point): number {
    return Math.abs(this.x - point.x) + Math.abs(this.y - point.y);
  }

  public set x(newX: number) {
    this.x = newX;
  }
  public get x() {
    return this._x;
  }

  public set y(newY: number) {
    this.y = newY;
  }
  public get y() {
    return this._y;
  }
}
