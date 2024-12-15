import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface SyntaxTreeProps {
  data: TreeNode;
}

const SyntaxTree: React.FC<SyntaxTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); 

    const margin = { top: 30, right: 90, bottom: 30, left: 90 };
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const g = svg.append("g")
        .attr("transform", `translate(${width / 2 + margin.left},${margin.top})`);

    const tree = d3.tree<TreeNode>().size([width, height]);

    const root = d3.hierarchy(data);
    const treeData = tree(root);

    const link = g.selectAll(".link")
      .data(treeData.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
        .x(d => d.x)
        .y(d => d.y));
    
    link.style("stroke", "blue").style("stroke-width", 2);
        

    const node = g.selectAll(".node")
      .data(treeData.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", d => `translate(${d.x},${d.y})`);


    node.append("circle")
      .attr("r", 6);

  
    node.append("text")
      .attr("dy", ".35em")
      .attr("y", d => d.children ? -20 : 20)
      .style("text-anchor", "middle")
      .style("font-size", "26px")
      .style("fill", "red") 
      .text(d => d.data.name);

  }, [data]);

  return (
    <svg ref={svgRef} width="100%" height="600" />
  );
};

export default SyntaxTree;

