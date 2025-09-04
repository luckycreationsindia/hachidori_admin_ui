import {NodeDetail} from "@/interfaces/waypoint";
import React from "react";

interface NodePointProps {
    node: NodeDetail;
    isSelected: boolean;
    onClick: (node: NodeDetail) => void;
    scaleFactor: number;
    offset: { x: number; y: number };
}

const NodePoint: React.FC<NodePointProps> = ({node, isSelected, onClick, scaleFactor, offset}) => {
    const nodeStyle = {
        top: `${(node.Node_Y - offset.y) / scaleFactor}px`,
        left: `${(node.Node_X - offset.x) / scaleFactor}px`,
    };

    return (
        <div
            key={node.Node_ID}
            style={nodeStyle}
            onClick={() => onClick(node)}
            className={`absolute w-4 h-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-125
        ${node.IsDestn ? 'bg-blue-500' : 'bg-gray-400'}
        ${isSelected ? 'bg-green-500 scale-125 ring-2 ring-green-700' : ''}
        ${node.SpecialNode === 1 ? 'bg-purple-500' : ''}
      `}
            title={node.NodeName}
        >
            <span className="text-xs text-white absolute -top-4 left-1/2 -translate-x-1/2">{node.NodeName}</span>
        </div>
    );
};

export default NodePoint;