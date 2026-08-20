import { 
  SphereGeometry,
  Mesh,
  MeshStandardMaterial,
} from "three";

import type { Updatable, point } from "./types";

type TargetTickBehavior = (target: Target, delta: number) => void;

class Target extends Mesh<SphereGeometry> implements Updatable{
  tickBehavior: TargetTickBehavior;

  constructor(
    position: point = { x: 0, y: 0, z: 0 },
    radius: number = .5,
    tickBehavior: TargetTickBehavior = () => {},
  ) {
    const geometry = new SphereGeometry(radius);
    const material = new MeshStandardMaterial({ color: 0x4477CC });
    super(geometry, material);

    this.tickBehavior = tickBehavior;

    this.position.set(position.x, position.y, position.z);
  }

  tick(delta: number) {
    this.tickBehavior(this, delta);
  }
}

export { Target };