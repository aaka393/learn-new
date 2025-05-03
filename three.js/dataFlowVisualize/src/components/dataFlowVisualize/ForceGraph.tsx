import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "framer-motion";
import { Database, FileText, Users,Image , Box, X } from "lucide-react";
import { createRoot } from "react-dom/client";
import { Node, leftNodes, rightNodes } from "./flowData";

interface Link {
  source: string;
  target: string;
  value: number;
}

const getIconComponent = (id: string, group: string) => {
  const nodeIcons: Record<string, any> = {
    salesforce: Database,
    zoho: Users,
    sharepoint:Box,
    pipedrive: Box,
    "Oil&Gas Report.pdf": FileText,
    "Energy Report.xlsx": FileText,
    "Google Drive": Box,
    "onedrive": FileText,
    "analysis.jpg": Image,
  };

  const groupIcons: Record<string, any> = {
    source: Database,
    primary: FileText,
    secondary: Users,
    tertiary: Box,
  };

  const Icon = nodeIcons[id] || groupIcons[group] || Box;

  return <Icon size={16} />;
};

const DetailPanel: React.FC<{ node: Node | null; onClose: () => void }> = ({
  node,
  onClose,
}) => {
  if (!node) return null;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute right-0 top-0 h-100 w-80 dark:bg-gray-800 bg-gray-50 dark:text-white text-gray-700 p-6 shadow-xl border-l border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{node.id}</h2>
        <button onClick={onClose} className="dark:text-gray-400 text-gray-700 ">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-xl">
          <h3 className="text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
            Details
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="ml-2">{node.data.type}</span>
            </div>
            <div>
              <span className="text-gray-400">Description:</span>
              <span className="ml-2">{node.data.description || "N/A"}</span>
            </div>
            <div>
              <span className="text-gray-400">Columns:</span>
              <span className="ml-2">{node.data.columns}</span>
            </div>
          </div>
        </div>

        <div className="dark:bg-gray-700 bg-gray-50 p-4 rounded-lg shadow-xl">
          <h3 className="text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
            Data 
          </h3>
          <div className="text-sm space-y-1">
            <div className="text-gray-400">Last Updated: 2024-03-15</div>
            <div className="text-gray-400">Total Records: 15,234</div>
            <div className="text-gray-400">Status: Active</div>
          </div>
        </div>

        <div className="dark:bg-gray-700 bg-gray-50 p-4 shadow-xl rounded-lg">
          <h3 className="text-sm font-medium dark:text-gray-300 text-gray-700  mb-2">
            Related Tables
          </h3>
          <div className="text-sm space-y-1">
            <div className="text-blue-400 cursor-pointer hover:underline">
              → Soil Analysis (Primary)
            </div>
            <div className="text-blue-400 cursor-pointer hover:underline">
              → Oil Viscosity (Secondary)
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ForceGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    content: string;
    x: number;
    y: number;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = selectedNode ? window.innerWidth - 320 : window.innerWidth;
    const height = window.innerHeight;

    const centerNode: Node = {
      id: "AI Gizmo",
      group: "primary",
      value: 100,
      data: {
        type: "AI Gizmo Agent",
        description: "AI Gizmo common data agent",
        columns: 234,
      },
    };

    // Combine all nodes
    const nodes = [centerNode, ...leftNodes, ...rightNodes];

    // Create links connecting to center node
    const links: Link[] = [
      ...leftNodes.map((node) => ({
        source: node.id,
        target: centerNode.id,
        value: 1,
      })),
      ...rightNodes.map((node) => ({
        source: centerNode.id,
        target: node.id,
        value: 1,
      })),
    ];

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("class", "dark:bg-gray-900 bg-gray-50 rounded-lg");

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Create a container for all elements
    const container = svg.append("g");

    // Add arrow marker definition
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#999")
      .attr("d", "M0,-5L10,0L0,5");

    const colorScale = d3
      .scaleOrdinal()
      .domain(["source", "primary", "secondary", "tertiary"])
      .range(["#60A5FA", "#34D399", "#A78BFA", "#FACC15"]);

    // Position nodes
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;

    // Position center node
    centerNode.x = centerX;
    centerNode.y = centerY;

    // Position left nodes with equal vertical spacing
    const leftStartY = centerY - height * 0.4; // Start from top
    const leftEndY = centerY + height * 0.4; // End at bottom
    const leftSpacing = (leftEndY - leftStartY) / (leftNodes.length - 3);

    leftNodes.forEach((node, i) => {
      node.x = centerX - radius * 1.5;
      node.y = leftStartY + i * leftSpacing;
    });

    // Position right nodes in a semi-circle (unchanged)
    rightNodes.forEach((node, i) => {
      const angle = (Math.PI / (rightNodes.length - 1)) * i - Math.PI / 2;
      node.x = centerX + radius * 1.5;
      node.y = centerY + radius * Math.sin(angle);
    });

    const link = container
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#4B5563")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 2)
      .attr("stroke-dasharray", "5,5") // Dotted line effect
      .attr("marker-end", "url(#arrow)")
      .attr("stroke-dashoffset", 0);

    // Function to animate dashed lines
    function animateDashedLines() {
      link
        .attr("stroke-dashoffset", 10) // Initial offset
        .transition()
        .duration(1000) // Adjust animation speed
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0) // Move dashed pattern
        .on("end", animateDashedLines); // Repeat animation
    }
    // Start animation
    animateDashedLines();

    const nodeGroup = container
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node-group")
      .attr("cursor", "pointer")
      .on("click", (event, d: any) => {
        setSelectedNode(selectedNode?.id === d.id ? null : d);
        event.stopPropagation();
      });

    nodeGroup
      .append("rect")
      .attr("width", (d) => d.value * 2)
      .attr("height", (d) => d.value)
      .attr("x", (d) => -d.value)
      .attr("y", (d) => -d.value / 2)
      .attr("fill", (d) => colorScale(d.group) as string)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("filter", "url(#glow)")
      .attr(
        "class",
        (d) => `node-bg ${selectedNode?.id === d.id ? "selected" : ""}`
      )
      .on("mouseover", (event, d: any) => {
        setTooltip({
          content: `
            <div class="font-bold">${d.id}</div>
            <div class="text-sm">${d.data.type}</div>
            <div class="text-xs text-gray-300">Source: ${d.group}</div>
          `,
          x: event.pageX,
          y: event.pageY,
        });
      })
      .on("mouseout", () => setTooltip(null));

    nodeGroup.each(function (d: any) {
      const node = d3.select(this);
      const Icon = getIconComponent(d.id, d.group);
      const foreignObject = node
        .append("foreignObject")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", -10)
        .attr("y", -10);

      const div = foreignObject
        .append("xhtml:div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("color", "white");

      const iconElement = document.createElement("div");
      (div.node() as HTMLElement)?.appendChild(iconElement);
      const root = createRoot(iconElement);
      root.render(Icon);
    });

    nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("fill", "black") // Changed to black
      .attr("font-size", "14px")
      .attr("font-weight", "bold");

    link
      .attr("x1", (d) => nodes.find((n) => n.id === d.source)?.x || 0)
      .attr("y1", (d) => nodes.find((n) => n.id === d.source)?.y || 0)
      .attr("x2", (d) => nodes.find((n) => n.id === d.target)?.x || 0)
      .attr("y2", (d) => nodes.find((n) => n.id === d.target)?.y || 0);

    nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);

    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");

    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const initialTransform = d3.zoomIdentity
      .translate(width / 4, height / 4)
      .scale(0.7);
    svg.call(zoom.transform as any, initialTransform);

    svg.on("click", () => setSelectedNode(null));

    return () => {
      nodeGroup.each(function () {
        const node = d3.select(this);
        const foreignObject = node.select("foreignObject");
        if (foreignObject.node()) {
          const div = foreignObject.select("div");
          if (div.node()) {
            const root = div.node() as any;
            if (root._reactRootContainer) {
              root._reactRootContainer.unmount();
            }
          }
        }
      });
    };
  }, [selectedNode]);

  return (
    <div
      className={`relative w-full h-screen transition-all duration-300  ${
        selectedNode ? "pr-80" : ""
      }`}
    >
      <svg ref={svgRef} className="w-full h-full" />

      <AnimatePresence>
        {selectedNode && (
          <DetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>

      {tooltip && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bg-gray-800  text-white p-3 rounded-lg shadow-xl z-50"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: "translate(-50%, -100%)",
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
};

export default ForceGraph;
