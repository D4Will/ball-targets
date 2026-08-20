import { AgXToneMapping, SRGBColorSpace, WebGLRenderer } from "three";

function createRenderer(): WebGLRenderer {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.toneMapping = AgXToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = SRGBColorSpace;

  return renderer;
}

export { createRenderer };