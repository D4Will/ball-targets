import { SphereGeometry, Mesh, MeshStandardMaterial } from "three";

function createSphere(): Mesh<SphereGeometry> {
  const material = new MeshStandardMaterial({ color: 0xAA00AA});
  const geometry = new SphereGeometry();
  const sphere = new Mesh(geometry, material);

  return sphere;
}

export { createSphere };