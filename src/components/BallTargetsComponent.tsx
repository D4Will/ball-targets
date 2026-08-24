import { useEffect, useRef } from "react";
import { BallTargets } from "../ball-targets/BallTargets";

export function BallTargetsComponent() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const game = new BallTargets(containerRef.current);
    game.start();

    return () => {
      game.dispose();
    };
  }, []);

  return (
    <>
      <div ref={containerRef} id="scene-container" />
      <div className="crosshair"></div>
    </>
  );
}
