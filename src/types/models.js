/**
 * Core Data Models for Deadlock Detective
 * 
 * JavaScript port of the Python models with validation
 */

/**
 * Validate Process object
 */
export function validateProcess(process) {
  if (process.pid < 0) {
    throw new Error(`Process ID must be non-negative, got ${process.pid}`);
  }
  if (!process.name || process.name.trim() === '') {
    throw new Error('Process name cannot be empty');
  }
}

/**
 * Validate ResourceType object
 */
export function validateResourceType(resource) {
  if (resource.rid < 0) {
    throw new Error(`Resource ID must be non-negative, got ${resource.rid}`);
  }
  if (!resource.name || resource.name.trim() === '') {
    throw new Error('Resource name cannot be empty');
  }
  if (resource.instances < 0) {
    throw new Error(`Instance count must be non-negative, got ${resource.instances}`);
  }
}

/**
 * Validate SystemState object
 */
export function validateSystemState(state) {
  const n = state.processes.length;
  const m = state.resource_types.length;

  // Validate processes
  state.processes.forEach(validateProcess);

  // Validate resource types
  state.resource_types.forEach(validateResourceType);

  // Validate dimensions
  if (state.available.length !== m) {
    throw new Error(`Available vector must have ${m} elements, got ${state.available.length}`);
  }

  if (state.allocation.length !== n) {
    throw new Error(`Allocation matrix must have ${n} rows, got ${state.allocation.length}`);
  }

  if (state.request.length !== n) {
    throw new Error(`Request matrix must have ${n} rows, got ${state.request.length}`);
  }

  // Validate allocation matrix dimensions
  state.allocation.forEach((row, i) => {
    if (row.length !== m) {
      throw new Error(`Allocation[${i}] must have ${m} columns, got ${row.length}`);
    }
  });

  // Validate request matrix dimensions
  state.request.forEach((row, i) => {
    if (row.length !== m) {
      throw new Error(`Request[${i}] must have ${m} columns, got ${row.length}`);
    }
  });

  // Validate non-negative values
  state.available.forEach((val, i) => {
    if (val < 0) {
      throw new Error(`Available[${i}] must be non-negative, got ${val}`);
    }
  });

  state.allocation.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val < 0) {
        throw new Error(`Allocation[${i}][${j}] must be non-negative, got ${val}`);
      }
    });
  });

  state.request.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val < 0) {
        throw new Error(`Request[${i}][${j}] must be non-negative, got ${val}`);
      }
    });
  });

  // Validate resource conservation
  for (let j = 0; j < m; j++) {
    let allocated = 0;
    for (let i = 0; i < n; i++) {
      allocated += state.allocation[i][j];
    }
    const total = state.available[j] + allocated;
    if (total !== state.resource_types[j].instances) {
      throw new Error(
        `Resource conservation violated for ${state.resource_types[j].name}: ` +
        `Available(${state.available[j]}) + Allocated(${allocated}) = ${total} ` +
        `!= Total(${state.resource_types[j].instances})`
      );
    }
  }
}

/**
 * Create a default empty system state
 */
export function createEmptySystemState(numProcesses = 3, numResources = 3) {
  const processes = Array.from({ length: numProcesses }, (_, i) => ({
    pid: i,
    name: `P${i}`,
  }));

  const resource_types = Array.from({ length: numResources }, (_, i) => ({
    rid: i,
    name: `R${i}`,
    instances: 1,
  }));

  const available = Array(numResources).fill(0);
  const allocation = Array.from({ length: numProcesses }, () => Array(numResources).fill(0));
  const request = Array.from({ length: numProcesses }, () => Array(numResources).fill(0));

  return {
    processes,
    resource_types,
    available,
    allocation,
    request,
  };
}
