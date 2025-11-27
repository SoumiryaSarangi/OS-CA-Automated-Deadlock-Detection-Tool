/**
 * Matrix-Based Deadlock Detector
 * 
 * Implements the detection algorithm for multi-instance resources
 * using the Work/Finish approach with Available, Allocation, and Request matrices.
 */

// Removed TypeScript import

/**
 * Check if request vector <= work vector (component-wise)
 */
function vectorLessEqual(req, work) {
  return req.every((r, i) => r <= work[i]);
}

/**
 * Add two vectors component-wise
 */
function vectorAdd(a, b) {
  return a.map((x, i) => x + b[i]);
}

/**
 * Format a vector as a string for display
 */
function vectorToString(vec) {
  return '[' + vec.join(', ') + ']';
}

/**
 * Detect deadlock using matrix-based algorithm with Work and Finish vectors
 */
export function detectDeadlockMatrix(state) {
  const trace = [];
  trace.push('=== Matrix-Based Deadlock Detection ===\n');

  const n = state.processes.length;
  const m = state.resource_types.length;

  trace.push(`System: ${n} processes, ${m} resource types\n`);

  // Display initial state
  trace.push('Initial State:');
  trace.push(`Available = ${vectorToString(state.available)}`);
  trace.push('');
  trace.push('Allocation Matrix:');
  state.allocation.forEach((row, i) => {
    trace.push(`  P${i}: ${vectorToString(row)}`);
  });
  trace.push('');
  trace.push('Request Matrix:');
  state.request.forEach((row, i) => {
    trace.push(`  P${i}: ${vectorToString(row)}`);
  });
  trace.push('');

  // Initialize Work and Finish
  trace.push('Initializing Work and Finish vectors...');
  let work = [...state.available];
  const finish = Array(n).fill(false);
  const execution_order = [];

  trace.push(`Work = Available = ${vectorToString(work)}`);
  trace.push('Finish = [' + finish.map(f => f ? 'True' : 'False').join(', ') + ']\n');

  // Main detection algorithm
  trace.push('Starting detection algorithm...\n');

  let progress = true;
  let iteration = 0;

  while (progress) {
    progress = false;
    iteration++;
    trace.push(`--- Iteration ${iteration} ---`);

    for (let i = 0; i < n; i++) {
      if (!finish[i]) {
        const can_finish = vectorLessEqual(state.request[i], work);
        
        trace.push(
          `Checking P${i}: Finish[${i}] = ${finish[i]}, ` +
          `Request[${i}] = ${vectorToString(state.request[i])}, ` +
          `Work = ${vectorToString(work)}`
        );

        if (can_finish) {
          finish[i] = true;
          execution_order.push(i);
          work = vectorAdd(work, state.allocation[i]);
          progress = true;

          trace.push(
            `  ✓ P${i} can finish! Request[${i}] <= Work`
          );
          trace.push(
            `    Setting Finish[${i}] = True`
          );
          trace.push(
            `    Releasing resources: Work = Work + Allocation[${i}]`
          );
          trace.push(
            `    New Work = ${vectorToString(work)}\n`
          );
        } else {
          trace.push(
            `  ✗ P${i} cannot finish. Request[${i}] > Work\n`
          );
        }
      }
    }

    if (!progress) {
      trace.push('No more processes can finish.\n');
    }
  }

  // Determine deadlock
  trace.push('--- Final Results ---');
  trace.push('Finish = [' + finish.map(f => f ? 'True' : 'False').join(', ') + ']');
  trace.push('');

  const deadlocked_processes = new Set();
  for (let i = 0; i < n; i++) {
    if (!finish[i]) {
      deadlocked_processes.add(i);
    }
  }

  if (deadlocked_processes.size === 0) {
    trace.push('✓ All processes can finish. System is deadlock-free.');
    trace.push('Safe execution sequence: ' + 
      execution_order.map(p => `P${p}`).join(' → '));
  } else {
    trace.push('✗ System is DEADLOCKED.');
    trace.push('Deadlocked processes: ' + 
      Array.from(deadlocked_processes).map(p => `P${p}`).join(', '));
    trace.push('Processes that finished: ' + 
      execution_order.map(p => `P${p}`).join(', '));
  }

  return {
    deadlocked: deadlocked_processes.size > 0,
    deadlocked_processes,
    finish,
    execution_order,
    trace,
  };
}

/**
 * Check if system can recover after terminating specified processes
 */
export function canSystemRecover(
  state,
  terminated
) {
  const trace = [];
  
  // Create a modified state without terminated processes
  const active_processes = state.processes.filter(p => !terminated.has(p.pid));
  
  if (active_processes.length === 0) {
    trace.push('All processes terminated.');
    return { can_recover: false, trace };
  }

  // Calculate new available resources (add back resources from terminated processes)
  const new_available = [...state.available];
  for (const pid of terminated) {
    for (let j = 0; j < state.resource_types.length; j++) {
      new_available[j] += state.allocation[pid][j];
    }
  }

  // Create new state for remaining processes
  const new_allocation = [];
  const new_request = [];
  const process_map = [];

  for (let i = 0; i < state.processes.length; i++) {
    if (!terminated.has(i)) {
      new_allocation.push([...state.allocation[i]]);
      new_request.push([...state.request[i]]);
      process_map.push(i);
    }
  }

  const modified_state = {
    processes: active_processes,
    resource_types: state.resource_types,
    available: new_available,
    allocation: new_allocation,
    request: new_request,
  };

  // Run detection on modified state
  const result = detectDeadlockMatrix(modified_state);
  
  return {
    can_recover: !result.deadlocked,
    trace: result.trace,
  };
}
