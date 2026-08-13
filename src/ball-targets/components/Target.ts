import { 
  SphereGeometry,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";

import type { Updatable } from "./types";

class Target extends Mesh<SphereGeometry> implements Updatable{
  xSpeed: number;
  ySpeed: number;

  constructor(xSpeed: number, ySpeed: number, radius: number, position: Vector3) {
    const geometry = new SphereGeometry(radius);
    const material = new MeshStandardMaterial({ color: "skyblue" });
    super(geometry, material);

    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed
    this.position.set(position.x, position.y, position.z);
  }

  tick(delta: number) {
    const position = this.position;
    if (position.x < -15 || position.x > 15) {
      this.xSpeed *= -1;
    }
    if (position.y < -10 || position.y > 10) {
      this.ySpeed *= -1;
    }
    position.x += this.xSpeed * delta;
    position.y += this.ySpeed * delta;
  }
}

export { Target };