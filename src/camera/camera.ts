export class Camera {
  constructor(
    public x: number,
    public y: number,
    public readonly width: number,
    public readonly height: number
  ) {}

  // Update camera position to follow the player
  follow(
    playerPosition: { x: number; y: number },
    mapWidth: number,
    mapHeight: number
  ) {
    // Center the camera on the player
    this.x = playerPosition.x - this.width / 2;
    this.y = playerPosition.y - this.height / 2;

    // Clamp the camera position to the map boundaries
    this.x = Math.max(0, Math.min(this.x, mapWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, mapHeight - this.height));
  }
}
