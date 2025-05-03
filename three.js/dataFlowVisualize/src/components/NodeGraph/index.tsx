import { GraphData } from '../../types/nodes';
import ThreeGraph from './ThreeGraph';

interface NodeGraphProps {
  data: GraphData;
}

export function NodeGraph({ data }: NodeGraphProps) {
  return (
    <ThreeGraph data={data} />
  );
}
