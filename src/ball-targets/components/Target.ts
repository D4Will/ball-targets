import { SphereGeometry, Mesh, MeshStandardMaterial } from "three";
import type { Updatable } from "./types";

class Target extends Mesh<SphereGeometry> implements Updatable{
  constructor() {
    const geometry = new SphereGeometry();
    const material = new MeshStandardMaterial({ color: 0xAA00AA});
    super(geometry, material);
  }

  tick() {
    const position = this.position;
    if (position.x < -30) {
      position.x += 0.1;
    }
    else if (position.x > 30) {
      position.x -= 0.1;
    }
    else {
      const randomSign = Math.random() < 0.5 ? -1 : 1;
      position.x += 0.03 * randomSign;
    }
  }
}

export { Target };