import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import gsap from 'gsap';
import './VisualizationTab.css';

export default function VisualizationTab({
  systemState,
  detectionResult,
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const { deadlocked_processes } = detectionResult;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create graph data
    const processes = systemState.processes.map((p, i) => ({
      id: `P${i}`,
      type: 'process',
      x: (width / (systemState.processes.length + 1)) * (i + 1),
      y: height / 3,
      deadlocked: deadlocked_processes.has(i),
    }));

    const resources = systemState.resource_types.map((r, i) => ({
      id: `R${i}`,
      type: 'resource',
      x: (width / (systemState.resource_types.length + 1)) * (i + 1),
      y: (height * 2) / 3,
      instances: r.instances,
    }));

    const nodes = [...processes, ...resources];

    // Create edges from processes to resources (allocation)
    const allocationEdges = [];
    systemState.allocation.forEach((row, i) => {
      row.forEach((count, j) => {
        if (count > 0) {
          allocationEdges.push({
            source: nodes.find(n => n.id === `R${j}`),
            target: nodes.find(n => n.id === `P${i}`),
            type: 'allocation',
          });
        }
      });
    });

    // Create edges from processes to resources (request)
    const requestEdges = [];
    systemState.request.forEach((row, i) => {
      row.forEach((count, j) => {
        if (count > 0) {
          requestEdges.push({
            source: nodes.find(n => n.id === `P${i}`),
            target: nodes.find(n => n.id === `R${j}`),
            type: 'request',
          });
        }
      });
    });

    // Draw allocation edges (resource -> process)
    const allocationLines = svg.append('g')
      .selectAll('line')
      .data(allocationEdges)
      .enter()
      .append('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead-green)')
      .attr('opacity', 0);

    // Draw request edges (process -> resource)
    const requestLines = svg.append('g')
      .selectAll('line')
      .data(requestEdges)
      .enter()
      .append('line')
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('marker-end', 'url(#arrowhead-yellow)')
      .attr('opacity', 0);

    // Define arrowheads
    svg.append('defs').selectAll('marker')
      .data(['green', 'yellow', 'red'])
      .enter()
      .append('marker')
      .attr('id', (d) => `arrowhead-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', (d) => 
        d === 'green' ? '#10b981' : d === 'yellow' ? '#f59e0b' : '#ef4444'
      );

    // Draw nodes
    const nodeGroups = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // Add circles for nodes
    nodeGroups.append('circle')
      .attr('r', 30)
      .attr('fill', (d) => {
        if (d.type === 'process') {
          return d.deadlocked ? '#ef4444' : '#3b82f6';
        }
        return '#8b5cf6';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))')
      .attr('opacity', 0);

    // Add labels
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text((d) => d.id)
      .attr('opacity', 0);

    // Add instance count for resources
    nodeGroups.filter((d) => d.type === 'resource')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '2.5em')
      .attr('fill', '#a0a0a0')
      .attr('font-size', '11px')
      .text((d) => `(${d.instances})`)
      .attr('opacity', 0);

    // Animate everything with GSAP
    gsap.to(allocationLines.nodes(), {
      attr: { opacity: 0.7 },
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
    });

    gsap.to(requestLines.nodes(), {
      attr: { opacity: 0.7 },
      duration: 0.5,
      delay: 0.3,
      stagger: 0.05,
      ease: 'power2.out',
    });

    gsap.to(nodeGroups.selectAll('circle').nodes(), {
      attr: { opacity: 1 },
      duration: 0.5,
      delay: 0.6,
      stagger: 0.05,
      ease: 'back.out(1.7)',
    });

    gsap.to(nodeGroups.selectAll('text').nodes(), {
      attr: { opacity: 1 },
      duration: 0.5,
      delay: 0.8,
      stagger: 0.05,
      ease: 'power2.out',
    });

  }, [systemState, detectionResult]);

  return (
    <div ref={containerRef} className="visualization-tab">
      <div className="viz-header">
        <h2>System Graph Visualization</h2>
        <p className="subtitle">
          Visual representation of processes, resources, and their relationships
        </p>
      </div>

      <div className="legend card">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-symbol process-safe"></div>
            <span>Safe Process</span>
          </div>
          <div className="legend-item">
            <div className="legend-symbol process-deadlock"></div>
            <span>Deadlocked Process</span>
          </div>
          <div className="legend-item">
            <div className="legend-symbol resource"></div>
            <span>Resource</span>
          </div>
          <div className="legend-item">
            <div className="legend-line allocation"></div>
            <span>Allocation (Resource → Process)</span>
          </div>
          <div className="legend-item">
            <div className="legend-line request"></div>
            <span>Request (Process → Resource)</span>
          </div>
        </div>
      </div>

      <div className="graph-container card">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
}
