/**
 * Wait-For Graph (WFG) Deadlock Detector
 * 
 * Implements deadlock detection for single-instance resources using
 * a wait-for graph approach. A cycle in the WFG indicates deadlock.
 */

/**
 * Build a wait-for graph from the system state
 */
function buildWaitForGraph(state) {
  const n = state.processes.length;
  const m = state.resource_types.length;
  const adjacency = new Map();
  const edges = [];

  // Initialize adjacency list
  for (let i = 0; i < n; i++) {
    adjacency.set(i, new Set());
  }

  // Build wait-for edges
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (state.request[i][j] > 0) {
        // Process i requests resource j
        // Find all processes that hold resource j
        for (let k = 0; k < n; k++) {
          if (k !== i && state.allocation[k][j] > 0) {
            // Process k holds resource j
            // Add edge i -> k
            adjacency.get(i).add(k);
            edges.push({
              from_pid: i,
              to_pid: k,
              resource_id: j,
            });
          }
        }
      }
    }
  }

  return { adjacency, edges };
}

/**
 * Detect cycles using DFS with cycle detection
 */
function detectCycles(adjacency, n) {
  const cycles = [];
  const visited = new Set();
  const recStack = new Set();
  const path = [];

  function dfs(node) {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    const neighbors = adjacency.get(node) || new Set();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          return true;
        }
      } else if (recStack.has(neighbor)) {
        // Cycle detected
        const cycleStart = path.indexOf(neighbor);
        const cycleProcesses = path.slice(cycleStart);
        
        // Build cycle edges
        const cycleEdges = [];
        for (let i = 0; i < cycleProcesses.length; i++) {
          const from = cycleProcesses[i];
          const to = cycleProcesses[(i + 1) % cycleProcesses.length];
          // Find the resource connecting them (simplified)
          cycleEdges.push({
            from_pid: from,
            to_pid: to,
            resource_id: -1, // Will be updated later if needed
          });
        }

        cycles.push({
          processes: [...cycleProcesses],
          edges: cycleEdges,
        });
        return true;
      }
    }

    path.pop();
    recStack.delete(node);
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      dfs(i);
    }
  }

  return cycles;
}

/**
 * Detect deadlock using wait-for graph algorithm
 */
export function detectDeadlockWFG(state) {
  const trace = [];
  trace.push('=== Wait-For Graph Deadlock Detection ===\n');

  const n = state.processes.length;
  const m = state.resource_types.length;

  trace.push(`System: ${n} processes, ${m} resource types\n`);

  // Build wait-for graph
  trace.push('Building wait-for graph...\n');
  const { adjacency, edges } = buildWaitForGraph(state);

  trace.push(`Wait-for edges (${edges.length}):`);
  if (edges.length === 0) {
    trace.push('  No wait-for edges found. No process is waiting.\n');
  } else {
    edges.forEach(edge => {
      trace.push(
        `  P${edge.from_pid} → P${edge.to_pid} ` +
        `(waiting for R${edge.resource_id})`
      );
    });
    trace.push('');
  }

  // Detect cycles
  trace.push('Detecting cycles in wait-for graph...\n');
  const cycles = detectCycles(adjacency, n);

  const deadlocked_processes = new Set();
  cycles.forEach(cycle => {
    cycle.processes.forEach(pid => deadlocked_processes.add(pid));
  });

  if (cycles.length === 0) {
    trace.push('✓ No cycles detected. System is deadlock-free.\n');
    return {
      deadlocked: false,
      deadlocked_processes,
      cycles: [],
      wait_for_edges: edges,
      trace,
    };
  } else {
    trace.push(`✗ Found ${cycles.length} cycle(s). System is DEADLOCKED.\n`);
    cycles.forEach((cycle, idx) => {
      const cycleStr = cycle.processes.map(p => `P${p}`).join(' → ');
      trace.push(`Cycle ${idx + 1}: ${cycleStr} → P${cycle.processes[0]}`);
    });
    trace.push('');
    trace.push('Deadlocked processes: ' + 
      Array.from(deadlocked_processes).map(p => `P${p}`).join(', '));
    
    return {
      deadlocked: true,
      deadlocked_processes,
      cycles,
      wait_for_edges: edges,
      trace,
    };
  }
}
