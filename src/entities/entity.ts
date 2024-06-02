export class Entity {
  public x: number;
  public y: number;
  public char: string;

  constructor(x: number, y: number, char: string) {
    this.x = x;
    this.y = y;
    this.char = char;
  }

  public move(
    dx: number,
    dy: number,
    game: { isWithinBounds: (x: number, y: number) => boolean }
  ) {
    const newX = this.x + dx;
    const newY = this.y + dy;

    // Boundary checks using Game's method
    if (game.isWithinBounds(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }
}
