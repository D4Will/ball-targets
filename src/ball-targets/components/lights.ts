import { DirectionalLight, HemisphereLight, Light } from "three";

function createLights(): Light[] {
  const ambientLight = new HemisphereLight(0xFFFFFF, 0x666666, 2);

  const mainLight = new DirectionalLight(0xFFFFFF, 5);
  mainLight.position.set(1, 6, 1);

  return [ambientLight, mainLight];
}

export { createLights };