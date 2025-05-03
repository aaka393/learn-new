import { Node, Connection as ConnectionType } from '../../types/nodes';
import { calculateControlPoints, findNearestPointOnCircle } from './utils';
import { DataTransferOrb } from './DataTransferOrb';

interface ConnectionProps {
  connection: ConnectionType;
  source: Node;
  target: Node;
}

export function Connection({ connection, source, target }: ConnectionProps) {
  const sourcePoint = findNearestPointOnCircle(source.x, source.y, target.x, target.y, 30);
  const targetPoint = findNearestPointOnCircle(target.x, target.y, source.x, source.y, 30);
  const { cp1x, cp1y, cp2x, cp2y } = calculateControlPoints(
    sourcePoint.x,
    sourcePoint.y,
    targetPoint.x,
    targetPoint.y
  );

  return (
    <g>
      <path
        d={`M ${sourcePoint.x} ${sourcePoint.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetPoint.x} ${targetPoint.y}`}
        fill="none"
        stroke="#94A3B8"
        strokeWidth="2"
        strokeDasharray="4"
      />
      {connection.label && (
        <text
          x={(source.x + target.x) / 2}
          y={(source.y + target.y) / 2}
          dy="-10"
          textAnchor="middle"
          className="fill-gray-600 dark:fill-gray-200 text-sm"
        >
          {connection.label}
        </text>
      )}
      <DataTransferOrb connection={connection} source={source} target={target} />
    </g>
  );
}
