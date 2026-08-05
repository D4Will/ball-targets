import { BallTargets } from "./ball-targets/BallTargets";

function main() {
  const container = document.querySelector("#scene-container") as HTMLDivElement;

  const ballTargets = new BallTargets(container);

  ballTargets.render();
}

main();