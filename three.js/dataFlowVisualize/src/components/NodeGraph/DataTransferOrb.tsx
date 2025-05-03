import { useEffect, useState } from "react";
import { Connection, Node } from "../../types/nodes";
import {
  findNearestPointOnCircle,
  calculateControlPoints,
  getBezierPoint,
} from "./utils";

interface DataTransferOrbProps {
  connection: Connection;
  source: Node;
  target: Node;
}

export function DataTransferOrb({
  connection,
  source,
  target,
}: DataTransferOrbProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const animate = () => {
      setProgress((prev) => (prev >= 1 ? 0 : prev + 0.015));
    };

    const animationFrame = requestAnimationFrame(function loop() {
      animate();
      requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const sourcePoint = findNearestPointOnCircle(
    source.x,
    source.y,
    target.x,
    target.y,
    30
  );
  const targetPoint = findNearestPointOnCircle(
    target.x,
    target.y,
    source.x,
    source.y,
    30
  );

  const { cp1x, cp1y, cp2x, cp2y } = calculateControlPoints(
    sourcePoint.x,
    sourcePoint.y,
    targetPoint.x,
    targetPoint.y
  );

  const currentPoint = getBezierPoint(
    progress,
    sourcePoint,
    { x: cp1x, y: cp1y },
    { x: cp2x, y: cp2y },
    targetPoint
  );

  return (
    <g>
      <defs>
        <radialGradient id="orbGradient">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        cx={currentPoint.x}
        cy={currentPoint.y}
        r="6"
        fill="url(#orbGradient)"
        className="animate-pulse"
      >
        <animate
          attributeName="r"
          values="4;6;4"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}
