import { 
  SphereGeometry,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  SRGBColorSpace,
} from "three";

import type { Updatable } from "./types";
import concreteTextureUrl from "../../assets/rough_concrete.jpg";

class Target extends Mesh<SphereGeometry> implements Updatable{
  xSpeed: number;
  ySpeed: number;

  constructor(xSpeed: number, ySpeed: number) {
    const geometry = new SphereGeometry();
    const material = createMaterial();
    super(geometry, material);

    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed
    this.position.z = -10;
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

function createMaterial(): MeshStandardMaterial {
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load(concreteTextureUrl);
  texture.colorSpace = SRGBColorSpace;
  const material = new MeshStandardMaterial({ map: texture });

  return material;
}

export { Target };