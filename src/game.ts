import { Player } from "./entities/player";
import { MapGenerator, MapType } from "./map/map-generator";
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
  private mapGenerator: MapGenerator;

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

    this.mapGenerator = new MapGenerator(
      this.mapWidth,
      this.mapHeight,
      MapType.DUNGEON
    );

    this.player = new Player({ position: this.mapGenerator.entrancePoint });

    this.map = [];
    this.mapRenderer = new MapRenderer(canvas, [], tileSize); // Initialize with empty map
  }

  public start() {
    this.map = this.mapGenerator.generateMap();
    this.player.setStartingPoint(this.mapGenerator.entrancePoint);

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
    this.player.render(this.context); // Draw the player
  }

  private handleInput(event: KeyboardEvent) {
    let newX = this.player.position.x;
    let newY = this.player.position.y;

    switch (event.key) {
      case "w":
        newY -= 1;
        break;
      case "a":
        newX -= 1;
        break;
      case "s":
        newY += 1;
        break;
      case "d":
        newX += 1;
        break;
    }

    if (this.isWithinBounds(newX, newY) && this.map[newY][newX] !== "#") {
      this.player.move(newX, newY);
    }
  }

  public isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight;
  }
}
