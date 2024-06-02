import { Player } from "./entities/player";
import { MapGenerator } from "./map/map-generator";
import { MapRenderer } from "./map/map-renderer";

export class Game {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private mapWidth: number;
  private mapHeight: number;
  private tileSize: number;
  private map: string[][];
  private player: Player;
  private mapRenderer: MapRenderer;

  constructor(
    canvas: HTMLCanvasElement,
    mapWidth: number,
    mapHeight: number,
    tileSize: number
  ) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d")!;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.tileSize = tileSize;
    this.player = new Player(5, 5);
    this.map = [];
    this.mapRenderer = new MapRenderer(canvas, [], tileSize); // Initialize with empty map
  }

  public start() {
    const generator = new MapGenerator(this.mapWidth, this.mapHeight);
    this.map = generator.generateMap();
    this.mapRenderer = new MapRenderer(this.canvas, this.map, this.tileSize); // Update map renderer with generated map

    window.addEventListener("keydown", (e) => this.handleInput(e));
    this.gameLoop();
  }

  private gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  private update() {
    // Update game state
  }

  private render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.mapRenderer.renderMap(); // Render the map
    this.drawEntity(this.player); // Draw the player
  }

  private drawEntity(entity: { x: number; y: number; char: string }) {
    this.context.fillStyle = "white";
    this.context.font = "20px monospace";
    this.context.fillText(
      entity.char,
      entity.x * this.tileSize,
      entity.y * this.tileSize + 20
    );
  }

  private handleInput(event: KeyboardEvent) {
    switch (event.key) {
      case "w":
        this.player.move(0, -1, this);
        break;
      case "a":
        this.player.move(-1, 0, this);
        break;
      case "s":
        this.player.move(0, 1, this);
        break;
      case "d":
        this.player.move(1, 0, this);
        break;
    }
  }

  public isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight;
  }
}
