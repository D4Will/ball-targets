import { DirectionalLight, Light } from "three";

function createLights(): Light {
  const directionalLight = new DirectionalLight(0xFFFFFF, 8);
  directionalLight.position.set(10, 10, 10)

  return directionalLight;
}

export { createLights };