import { MeshStandardMaterial, BoxGeometry, Mesh, TextureLoader, SRGBColorSpace, RepeatWrapping} from "three";

import baseColorTexUrl from "../../assets/textures/overgrown_concrete_pavers_diff_1k.jpg";
import normalTextUrl from "../../assets/textures/overgrown_concrete_pavers_nor_gl_1k.jpg";

export function createBackground(width: number, height: number, distance: number) {
  const dimensions = {
    x: width,
    y: height,
  };

  const textureLoader = new TextureLoader();

  const baseColorTex = textureLoader.load(baseColorTexUrl);
  baseColorTex.colorSpace = SRGBColorSpace;
  baseColorTex.wrapS = RepeatWrapping;
  baseColorTex.wrapT = RepeatWrapping;
  baseColorTex.repeat.set(4, 2);

  const normalTex = textureLoader.load(normalTextUrl); 
  normalTex.wrapS = RepeatWrapping;
  normalTex.wrapT = RepeatWrapping;
  normalTex.repeat.copy(baseColorTex.repeat);

  const material = new MeshStandardMaterial({
    map: baseColorTex,
    normalMap: normalTex,
  });
  const geometry = new BoxGeometry(dimensions.x, dimensions.y, .5);
  const background = new Mesh(geometry, material);

  background.position.z = -1 * distance;

  return background;
}