import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Zap } from 'lucide-react';
import * as d3 from 'd3';
import gsap from 'gsap';
import './VisualizationTab.css';

export default function VisualizationTab({
  systemState,
  detectionResult,
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(1500);
  const animationRef = useRef(null);

  // Generate animation steps
  useEffect(() => {
    if (!systemState || !detectionResult) return;
    
    const animationSteps = generateAnimationSteps();
    setSteps(animationSteps);
    setCurrentStep(0);
  }, [systemState, detectionResult]);

  // Auto-play animation
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      animationRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1 && isPlaying) {
      setIsPlaying(false);
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [isPlaying, currentStep, steps.length, speed]);

  // Generate simulation steps
  const generateAnimationSteps = () => {
    const steps = [];
    const algorithmType = detectionResult.algorithm;
    
    // Step 0: Initial state
    steps.push({
      type: 'init',
      title: 'Initial System State',
      description: 'Starting deadlock detection analysis',
      nodes: buildInitialNodes(),
      edges: { allocation: [], request: [] },
      highlights: []
    });

    // Step 1: Show all allocations
    const allAllocations = [];
    systemState.allocation.forEach((row, i) => {
      row.forEach((count, j) => {
        if (count > 0) {
          allAllocations.push({ from: j, to: i, type: 'allocation', count });
        }
      });
    });

    allAllocations.forEach((edge, idx) => {
      steps.push({
        type: 'show-allocation',
        title: `Allocation ${idx + 1}/${allAllocations.length}`,
        description: `R${edge.from} has allocated ${edge.count} instance(s) to P${edge.to}`,
        nodes: buildInitialNodes(),
        edges: { 
          allocation: allAllocations.slice(0, idx + 1), 
          request: [] 
        },
        highlights: [{ type: 'process', id: edge.to }, { type: 'resource', id: edge.from }]
      });
    });

    // Step 2: Show all requests
    const allRequests = [];
    systemState.request.forEach((row, i) => {
      row.forEach((count, j) => {
        if (count > 0) {
          allRequests.push({ from: i, to: j, type: 'request', count });
        }
      });
    });

    allRequests.forEach((edge, idx) => {
      steps.push({
        type: 'show-request',
        title: `Request ${idx + 1}/${allRequests.length}`,
        description: `P${edge.from} is requesting ${edge.count} instance(s) of R${edge.to}`,
        nodes: buildInitialNodes(),
        edges: { 
          allocation: allAllocations, 
          request: allRequests.slice(0, idx + 1)
        },
        highlights: [{ type: 'process', id: edge.from }, { type: 'resource', id: edge.to }]
      });
    });

    // Step 3: Algorithm execution
    if (algorithmType === 'matrix') {
      addMatrixSteps(steps, allAllocations, allRequests);
    } else {
      addWFGSteps(steps, allAllocations, allRequests);
    }

    return steps;
  };

  const buildInitialNodes = () => {
    const nodes = [];
    systemState.processes.forEach((p, i) => {
      nodes.push({
        id: i,
        label: `P${i}`,
        type: 'process',
        status: 'normal'
      });
    });
    systemState.resource_types.forEach((r, i) => {
      nodes.push({
        id: i,
        label: `R${i}`,
        type: 'resource',
        instances: r.instances
      });
    });
    return nodes;
  };

  const addMatrixSteps = (steps, allAllocations, allRequests) => {
    const n = systemState.processes.length;
    let available = [...systemState.available];
    let finish = Array(n).fill(false);
    let iteration = 0;
    let progress = true;

    while (progress) {
      progress = false;
      iteration++;

      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          const request = systemState.request[i];
          const canFinish = request.every((r, j) => r <= available[j]);

          const nodes = buildInitialNodes();
          nodes.forEach(node => {
            if (node.type === 'process') {
              if (finish[node.id]) node.status = 'finished';
              else if (node.id === i) node.status = 'checking';
            }
          });

          steps.push({
            type: 'check-process',
            title: `Checking P${i}`,
            description: `Can P${i} finish? Request: [${request.join(', ')}], Available: [${available.join(', ')}] → ${canFinish ? '✓ Yes' : '✗ No'}`,
            nodes,
            edges: { allocation: allAllocations, request: allRequests },
            highlights: [{ type: 'process', id: i }],
            available: [...available],
            finish: [...finish]
          });

          if (canFinish) {
            finish[i] = true;
            available = available.map((a, j) => a + systemState.allocation[i][j]);
            progress = true;

            const finishedNodes = buildInitialNodes();
            finishedNodes.forEach(node => {
              if (node.type === 'process') {
                if (finish[node.id]) node.status = 'finished';
              }
            });

            steps.push({
              type: 'process-finish',
              title: `P${i} Finishes`,
              description: `P${i} releases resources. New Available: [${available.join(', ')}]`,
              nodes: finishedNodes,
              edges: { allocation: allAllocations, request: allRequests },
              highlights: [{ type: 'process', id: i }],
              available: [...available],
              finish: [...finish]
            });
          }
        }
      }
    }

    // Final result
    const finalNodes = buildInitialNodes();
    const deadlockedProcesses = [];
    finalNodes.forEach(node => {
      if (node.type === 'process') {
        if (finish[node.id]) {
          node.status = 'finished';
        } else {
          node.status = 'deadlocked';
          deadlockedProcesses.push(node.id);
        }
      }
    });

    steps.push({
      type: 'result',
      title: deadlockedProcesses.length === 0 ? 'System is Safe!' : 'Deadlock Detected!',
      description: deadlockedProcesses.length === 0 
        ? 'All processes can complete successfully' 
        : `Deadlocked processes: ${deadlockedProcesses.map(p => `P${p}`).join(', ')}`,
      nodes: finalNodes,
      edges: { allocation: allAllocations, request: allRequests },
      highlights: deadlockedProcesses.map(id => ({ type: 'process', id })),
      available: [...available],
      finish: [...finish]
    });
  };

  const addWFGSteps = (steps, allAllocations, allRequests) => {
    // Similar WFG steps would go here
    const finalNodes = buildInitialNodes();
    detectionResult.deadlocked_processes.forEach(pid => {
      const node = finalNodes.find(n => n.type === 'process' && n.id === pid);
      if (node) node.status = 'deadlocked';
    });

    steps.push({
      type: 'result',
      title: detectionResult.deadlocked ? 'Deadlock Detected!' : 'System is Safe!',
      description: detectionResult.deadlocked 
        ? `Deadlocked processes: ${Array.from(detectionResult.deadlocked_processes).map(p => `P${p}`).join(', ')}`
        : 'No cycles detected',
      nodes: finalNodes,
      edges: { allocation: allAllocations, request: allRequests },
      highlights: Array.from(detectionResult.deadlocked_processes).map(id => ({ type: 'process', id }))
    });
  };

  // Render current step
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || steps.length === 0) return;
    
    renderStep(steps[currentStep]);
  }, [currentStep, steps]);

  const renderStep = (step) => {
    if (!step) return;

    const { deadlocked_processes } = detectionResult;
    
    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Use a fixed coordinate system that will scale to fit
    const viewBoxWidth = 1000;
    const viewBoxHeight = 600;
    
    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    const width = viewBoxWidth;
    const height = viewBoxHeight;

    // Create graph data from step
    const processes = step.nodes.filter(n => n.type === 'process').map((n, i) => ({
      id: `P${n.id}`,
      pid: n.id,
      type: 'process',
      x: (width / (step.nodes.filter(node => node.type === 'process').length + 1)) * (i + 1),
      y: height / 3,
      status: n.status || 'normal',
      highlighted: step.highlights?.some(h => h.type === 'process' && h.id === n.id)
    }));

    const resources = step.nodes.filter(n => n.type === 'resource').map((n, i) => ({
      id: `R${n.id}`,
      rid: n.id,
      type: 'resource',
      x: (width / (step.nodes.filter(node => node.type === 'resource').length + 1)) * (i + 1),
      y: (height * 2) / 3,
      instances: n.instances,
      highlighted: step.highlights?.some(h => h.type === 'resource' && h.id === n.id)
    }));

    const nodes = [...processes, ...resources];

    // Create edges from step data
    const allocationEdges = (step.edges.allocation || []).map(e => ({
      source: nodes.find(n => n.type === 'resource' && n.rid === e.from),
      target: nodes.find(n => n.type === 'process' && n.pid === e.to),
      type: 'allocation',
    })).filter(e => e.source && e.target);

    const requestEdges = (step.edges.request || []).map(e => ({
      source: nodes.find(n => n.type === 'process' && n.pid === e.from),
      target: nodes.find(n => n.type === 'resource' && n.rid === e.to),
      type: 'request',
    })).filter(e => e.source && e.target);

    // Define arrowheads
    svg.append('defs').selectAll('marker')
      .data(['green', 'yellow', 'red'])
      .enter()
      .append('marker')
      .attr('id', (d) => `arrowhead-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', (d) => d === 'green' || d === 'yellow' ? 35 : 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', (d) => 
        d === 'green' ? '#10b981' : d === 'yellow' ? '#f59e0b' : '#ef4444'
      );

    // Draw nodes FIRST (static, no animations)
    const nodeGroups = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // Draw process nodes (circles)
    nodeGroups.filter(d => d.type === 'process')
      .append('circle')
      .attr('r', 30)
      .attr('fill', (d) => {
        if (d.status === 'checking') return '#f59e0b';
        if (d.status === 'finished') return '#10b981';
        if (d.status === 'deadlocked') return '#ef4444';
        return '#3b82f6';
      })
      .attr('stroke', (d) => d.highlighted ? '#fbbf24' : '#fff')
      .attr('stroke-width', (d) => d.highlighted ? 4 : 2)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))')
      .attr('opacity', 1);

    // Draw resource nodes (rectangles with instance dots)
    const resourceNodes = nodeGroups.filter(d => d.type === 'resource');
    
    const rectWidth = 60;
    const dotSize = 8;
    const dotSpacing = 12;
    
    resourceNodes.each(function(d) {
      const group = d3.select(this);
      const instances = d.instances || 1;
      const rectHeight = Math.max(40, instances * dotSpacing + 20);
      
      // Draw rectangle
      group.append('rect')
        .attr('x', -rectWidth / 2)
        .attr('y', -rectHeight / 2)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('rx', 8)
        .attr('fill', '#8b5cf6')
        .attr('stroke', d.highlighted ? '#fbbf24' : '#fff')
        .attr('stroke-width', d.highlighted ? 4 : 2)
        .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))')
        .attr('opacity', 1);
      
      // Draw instance dots
      const startY = -(instances - 1) * dotSpacing / 2;
      for (let i = 0; i < instances; i++) {
        group.append('circle')
          .attr('cx', 0)
          .attr('cy', startY + i * dotSpacing)
          .attr('r', dotSize / 2)
          .attr('fill', '#fff')
          .attr('opacity', 0.9);
      }
    });

    // Add process labels
    nodeGroups.filter(d => d.type === 'process')
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#fff')
      .attr('font-weight', '600')
      .attr('font-size', '14px')
      .text((d) => d.id)
      .attr('opacity', 1);

    // Add resource labels (below rectangle)
    resourceNodes.each(function(d) {
      const group = d3.select(this);
      const instances = d.instances || 1;
      const rectHeight = Math.max(40, instances * dotSpacing + 20);
      
      // Add resource ID below rectangle
      group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', `${rectHeight / 2 + 18}px`)
        .attr('fill', '#fff')
        .attr('font-weight', '600')
        .attr('font-size', '14px')
        .text(d.id)
        .attr('opacity', 1);
      
      // Add instance count label below ID
      group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', `${rectHeight / 2 + 34}px`)
        .attr('fill', '#a0a0a0')
        .attr('font-size', '11px')
        .text(`(${instances})`)
        .attr('opacity', 1);
    });

    // NOW draw edges (after nodes)
    // Draw allocation edges (resource -> process)
    const allocationLines = svg.append('g')
      .attr('class', 'edges-allocation')
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
      .attr('opacity', 0.7);

    // Draw request edges with smart curvature (process -> resource)
    const requestLines = svg.append('g')
      .attr('class', 'edges-request')
      .selectAll('path')
      .data(requestEdges)
      .enter()
      .append('path')
      .attr('d', (d) => {
        // Check if there's an allocation edge between the same nodes (reverse direction)
        const hasOverlap = allocationEdges.some(ae => 
          ae.source.x === d.target.x && ae.source.y === d.target.y &&
          ae.target.x === d.source.x && ae.target.y === d.source.y
        );
        
        if (hasOverlap) {
          // Add subtle curve when overlapping
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; // Subtle arc
          return `M ${d.source.x},${d.source.y} A ${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        } else {
          // Straight line when no overlap
          return `M ${d.source.x},${d.source.y} L ${d.target.x},${d.target.y}`;
        }
      })
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('fill', 'none')
      .attr('marker-end', 'url(#arrowhead-yellow)')
      .attr('opacity', 0.7);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (index) => {
    setCurrentStep(index);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = steps[currentStep] || {};

  return (
    <div ref={containerRef} className="visualization-tab">
      {/* Step Info at Top */}
      <div className="step-info-header card">
        <span className="step-badge">Step {currentStep + 1} of {steps.length}</span>
        <h3 className="step-title">{currentStepData.title}</h3>
        <p className="step-desc">{currentStepData.description}</p>
      </div>

      {/* Main Content Area: Sidebar + Diagram */}
      <div className="viz-main-content">
        {/* Legend Sidebar */}
        <div className="legend-sidebar card">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-symbol process-safe"></div>
            <span>Normal Process</span>
          </div>
          <div className="legend-item">
            <div className="legend-symbol process-checking"></div>
            <span>Checking</span>
          </div>
          <div className="legend-item">
            <div className="legend-symbol process-finished"></div>
            <span>Finished</span>
          </div>
          <div className="legend-item">
            <div className="legend-symbol process-deadlock"></div>
            <span>Deadlocked</span>
          </div>
          <div className="legend-item">
            <div className="legend-symbol resource"></div>
            <span>Resource</span>
          </div>
          <div className="legend-item">
            <div className="legend-line allocation"></div>
            <span>Allocation</span>
          </div>
          <div className="legend-item">
            <div className="legend-line request"></div>
            <span>Request</span>
          </div>
        </div>
      </div>

        {/* Diagram Container */}
        <div className="graph-container card">
          <svg ref={svgRef}></svg>
        </div>
      </div>

      {/* Bottom Controls with Progress Dots */}
      <div className="simulation-controls card">
        <div className="progress-section">
          <div className="step-info">
            <span className="step-badge">Step {currentStep + 1} of {steps.length}</span>
            <h3 className="step-title">{currentStepData.title}</h3>
            <p className="step-desc">{currentStepData.description}</p>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-track">
              {steps.map((s, idx) => (
                <div 
                  key={idx}
                  className={`progress-dot ${idx === currentStep ? 'active' : idx < currentStep ? 'completed' : ''}`}
                  onClick={() => handleStepClick(idx)}
                  title={s.title}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="controls-main">
          <button onClick={handleReset} className="ctrl-btn" title="Reset" disabled={currentStep === 0}>
            <RotateCcw size={20} />
          </button>
          <button onClick={handlePrevious} className="ctrl-btn" title="Previous" disabled={currentStep === 0}>
            <SkipBack size={20} />
          </button>
          <button onClick={handlePlayPause} className="ctrl-btn ctrl-btn-primary" title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={handleNext} className="ctrl-btn" title="Next" disabled={currentStep === steps.length - 1}>
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
