import {
  Group,
  MeshStandardMaterial,
  BoxGeometry,
  Mesh,
  TextureLoader,
  SRGBColorSpace,
  RepeatWrapping,
  Texture,
  type TextureEventMap,
} from "three";

import baseColorTexUrl from "../../assets/textures/overgrown_concrete_pavers_diff_1k.jpg";
import normalTextUrl from "../../assets/textures/overgrown_concrete_pavers_nor_gl_1k.jpg";
import type { point } from "./types";

function createBox(
  point1: point,
  point2: point,
  colorMap: Texture<HTMLImageElement, TextureEventMap>,
  normalMap: Texture<HTMLImageElement, TextureEventMap>,
): Mesh<BoxGeometry> {

  const material = new MeshStandardMaterial({
    map: colorMap,
    normalMap: normalMap,
  });

  const width = point2.x - point1.x;
  const height = point2.y - point1.y;
  const depth = point2.z - point1.z;

  const geometry = new BoxGeometry(Math.abs(width), Math.abs(height), Math.abs(depth));
  const flat = new Mesh(geometry, material);
  flat.position.set(
    point1.x + width / 2,
    point1.y + height / 2,
    point1.z + depth / 2,
  )

  geometry.dispose();

  return flat;
}

export class Structure extends Group {
  // textureLoader: TextureLoader;
  // texture: Texture<HTMLImageElement, TextureEventMap>;

  constructor() {
    super();
    const textureLoader = new TextureLoader();

    const baseColorTex = textureLoader.load(baseColorTexUrl);
    baseColorTex.colorSpace = SRGBColorSpace;
    baseColorTex.wrapS = RepeatWrapping;
    baseColorTex.wrapT = RepeatWrapping;
    baseColorTex.repeat.set(4, 4);

    const normalTex = textureLoader.load(normalTextUrl);
    normalTex.wrapS = RepeatWrapping;
    normalTex.wrapT = RepeatWrapping;
    normalTex.repeat.copy(baseColorTex.repeat);

    const floor = createBox(
      { x: -10, y: -5, z: 5 },
      { x: 10, y: -4.5, z: -15 },
      baseColorTex,
      normalTex
    );

    const frontWall = createBox(
      { x: -10, y: 10, z: -15 },
      { x: 10, y: -4.5, z: -14.5 },
      baseColorTex,
      normalTex
    );
    
    const rightWall = createBox(
      { x: 10, y: 5, z: 5 },
      { x: 9.5, y: -4.5, z: -14.5 },
      baseColorTex,
      normalTex
    );

    const leftWall = createBox(
      { x: -10, y: 0, z: 5 },
      { x: -9.5, y: -4.5, z: -14.5 },
      baseColorTex,
      normalTex
    );

    const backWall = createBox(
      { x: -9.5, y: -2, z: 5 },
      { x: 9.5, y: -4.5, z: 4.5 },
      baseColorTex,
      normalTex
    );

    this.add(floor, frontWall, rightWall, leftWall, backWall);
  }
}
