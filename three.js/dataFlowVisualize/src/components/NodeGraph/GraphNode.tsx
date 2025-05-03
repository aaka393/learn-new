import { Node } from '../../types/nodes';
import { NodeIcon } from './NodeIcon';
import { useState } from 'react';
import { PDFPreview } from './PDFPreview';
import { NodeDialog } from '../NodeDialog';

interface GraphNodeProps {
  node: Node;
  isDragged: boolean;
  onMouseDown: (nodeId: string) => void;
}

export function GraphNode({ node, isDragged, onMouseDown }: GraphNodeProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleMouseDown = () => {
    setIsDragging(true);
    onMouseDown(node.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      e.stopPropagation();
      if (node.type === 'pdf') {
        setShowPdfPreview(true);
      }
      setShowDialog(true);
    }
    setIsDragging(false);
  };

  return (
    <>
      <g
        transform={`translate(${node.x},${node.y})`}
        className="cursor-move"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <circle
          r="30"
          className={`fill-white dark:fill-gray-900 stroke-2 ${
            isDragged ? 'stroke-blue-500' : 'stroke-gray-700'
          } transition-colors`}
        />
        <foreignObject
          x="-12"
          y="-12"
          width="24"
          height="24"
          className="overflow-visible"
        >
          <div className="flex items-center justify-center rounded-full overflow-hidden" style={{ mask: 'url(#circleMask)' }}>
            <NodeIcon type={node.type} />
          </div>
        </foreignObject>
        <text
          y="45"
          textAnchor="middle"
          className="fill-gray-700 text-sm font-medium dark:fill-gray-200"
        >
          {node.label}
        </text>
      </g>

      {showPdfPreview && node.type === 'pdf' && (
        <PDFPreview 
          onClose={() => setShowPdfPreview(false)} 
        />
      )}

      <NodeDialog 
        isOpen={showDialog} 
        onClose={() => setShowDialog(false)}
        node={node}
      />

      <defs>
        <mask id="circleMask">
          <circle r="12" cx="12" cy="12" fill="white" />
        </mask>
      </defs>
    </>
  );
}
