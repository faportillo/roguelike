import { Game } from "./game";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  const mapWidth = 20;
  const mapHeight = 20;
  const tileSize = 20;

  const game = new Game(canvas, mapWidth, mapHeight, tileSize);
  game.start();
});
