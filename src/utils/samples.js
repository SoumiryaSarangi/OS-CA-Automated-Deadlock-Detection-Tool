/**
 * Sample Datasets and JSON Utilities
 * 
 * Pre-loaded scenarios and JSON import/export functionality
 */

import { validateSystemState } from '../types/models.js';

const SCHEMA_VERSION = '1.0';

/**
 * Convert SystemState to JSON-serializable object
 */
export function systemStateToJSON(state) {
  return {
    schema_version: SCHEMA_VERSION,
    processes: state.processes.map(p => ({ pid: p.pid, name: p.name })),
    resource_types: state.resource_types.map(r => ({
      rid: r.rid,
      name: r.name,
      instances: r.instances,
    })),
    available: state.available,
    allocation: state.allocation,
    request: state.request,
  };
}

/**
 * Convert JSON object to SystemState
 */
export function jsonToSystemState(data) {
  if (data.schema_version !== SCHEMA_VERSION) {
    throw new Error(
      `Schema version mismatch: expected '${SCHEMA_VERSION}', got '${data.schema_version}'`
    );
  }

  const state = {
    processes: data.processes.map(p => ({ pid: p.pid, name: p.name })),
    resource_types: data.resource_types.map(r => ({
      rid: r.rid,
      name: r.name,
      instances: r.instances,
    })),
    available: data.available,
    allocation: data.allocation,
    request: data.request,
  };

  validateSystemState(state);
  return state;
}

/**
 * Sample Dataset 1: Classic Circular Deadlock
 */
export const SAMPLE_DEADLOCK_CIRCULAR = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 1 },
    { rid: 1, name: 'R1', instances: 1 },
    { rid: 2, name: 'R2', instances: 1 },
  ],
  available: [0, 0, 0],
  allocation: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  request: [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0],
  ],
};

/**
 * Sample Dataset 2: Safe State (No Deadlock)
 */
export const SAMPLE_SAFE_STATE = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 10 },
    { rid: 1, name: 'R1', instances: 5 },
    { rid: 2, name: 'R2', instances: 7 },
  ],
  available: [3, 3, 2],
  allocation: [
    [0, 1, 0],
    [2, 0, 0],
    [5, 1, 5],
  ],
  request: [
    [7, 4, 3],
    [1, 2, 2],
    [0, 0, 0],
  ],
};

/**
 * Sample Dataset 3: Multi-Instance Deadlock
 */
export const SAMPLE_MULTI_INSTANCE_DEADLOCK = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
    { pid: 3, name: 'P3' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 3 },
    { rid: 1, name: 'R1', instances: 2 },
  ],
  available: [0, 0],
  allocation: [
    [1, 0],
    [1, 1],
    [1, 0],
    [0, 1],
  ],
  request: [
    [0, 1],
    [0, 1],
    [1, 0],
    [1, 0],
  ],
};

/**
 * Sample Dataset 4: Partial Deadlock
 */
export const SAMPLE_PARTIAL_DEADLOCK = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
    { pid: 3, name: 'P3' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 2 },
    { rid: 1, name: 'R1', instances: 2 },
  ],
  available: [0, 0],
  allocation: [
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0],
  ],
  request: [
    [0, 1],
    [0, 1],
    [1, 0],
    [0, 0],
  ],
};

/**
 * Sample Dataset 5: Complex Safe State
 */
export const SAMPLE_COMPLEX_SAFE = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
    { pid: 3, name: 'P3' },
    { pid: 4, name: 'P4' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 10 },
    { rid: 1, name: 'R1', instances: 5 },
    { rid: 2, name: 'R2', instances: 7 },
  ],
  available: [0, 0, 0],
  allocation: [
    [3, 2, 2],
    [2, 1, 1],
    [3, 0, 2],
    [1, 1, 1],
    [1, 1, 1],
  ],
  request: [
    [0, 0, 0],
    [2, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
    [0, 0, 2],
  ],
};

/**
 * Sample Dataset 6: Banker's Algorithm Safe State
 */
export const SAMPLE_BANKERS_SAFE = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
    { pid: 3, name: 'P3' },
    { pid: 4, name: 'P4' },
  ],
  resource_types: [
    { rid: 0, name: 'A', instances: 10 },
    { rid: 1, name: 'B', instances: 5 },
    { rid: 2, name: 'C', instances: 7 },
  ],
  available: [3, 3, 2],
  allocation: [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ],
  request: [
    [7, 4, 3],
    [1, 2, 2],
    [6, 0, 0],
    [0, 1, 1],
    [4, 3, 1],
  ],
};

/**
 * Sample Dataset 7: Simple Safe State (3 Processes)
 */
export const SAMPLE_SIMPLE_SAFE = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 5 },
    { rid: 1, name: 'R1', instances: 3 },
  ],
  available: [2, 1],
  allocation: [
    [2, 0],
    [1, 1],
    [0, 1],
  ],
  request: [
    [1, 2],
    [1, 1],
    [2, 1],
  ],
};

/**
 * Sample Dataset 8: No Resources Requested (Trivial Safe)
 */
export const SAMPLE_NO_REQUESTS = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 4 },
    { rid: 1, name: 'R1', instances: 2 },
    { rid: 2, name: 'R2', instances: 3 },
  ],
  available: [2, 1, 1],
  allocation: [
    [1, 0, 1],
    [1, 1, 0],
    [0, 0, 1],
  ],
  request: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

/**
 * Sample Dataset 9: Dining Philosophers Deadlock
 */
export const SAMPLE_DINING_PHILOSOPHERS = {
  processes: [
    { pid: 0, name: 'Philosopher 0' },
    { pid: 1, name: 'Philosopher 1' },
    { pid: 2, name: 'Philosopher 2' },
    { pid: 3, name: 'Philosopher 3' },
    { pid: 4, name: 'Philosopher 4' },
  ],
  resource_types: [
    { rid: 0, name: 'Fork 0', instances: 1 },
    { rid: 1, name: 'Fork 1', instances: 1 },
    { rid: 2, name: 'Fork 2', instances: 1 },
    { rid: 3, name: 'Fork 3', instances: 1 },
    { rid: 4, name: 'Fork 4', instances: 1 },
  ],
  available: [0, 0, 0, 0, 0],
  allocation: [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ],
  request: [
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0],
  ],
};

/**
 * Sample Dataset 10: Large Safe State
 */
export const SAMPLE_LARGE_SAFE = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
    { pid: 3, name: 'P3' },
    { pid: 4, name: 'P4' },
    { pid: 5, name: 'P5' },
  ],
  resource_types: [
    { rid: 0, name: 'CPU', instances: 6 },
    { rid: 1, name: 'Memory', instances: 8 },
    { rid: 2, name: 'Disk', instances: 4 },
    { rid: 3, name: 'Network', instances: 3 },
  ],
  available: [1, 2, 1, 1],
  allocation: [
    [1, 1, 0, 0],
    [1, 2, 1, 0],
    [1, 0, 1, 1],
    [0, 1, 0, 0],
    [1, 1, 0, 1],
    [1, 1, 1, 0],
  ],
  request: [
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 0, 0, 1],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
  ],
};

/**
 * Sample Dataset 11: Simple Chain Deadlock (Single-Instance)
 */
export const SAMPLE_CHAIN_DEADLOCK = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
    { pid: 3, name: 'P3' },
  ],
  resource_types: [
    { rid: 0, name: 'Printer', instances: 1 },
    { rid: 1, name: 'Scanner', instances: 1 },
    { rid: 2, name: 'Plotter', instances: 1 },
    { rid: 3, name: 'CD-ROM', instances: 1 },
  ],
  available: [0, 0, 0, 0],
  allocation: [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
  request: [
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
    [1, 0, 0, 0],
  ],
};

/**
 * Sample Dataset 12: Two Process Deadlock (Single-Instance)
 */
export const SAMPLE_TWO_PROCESS_DEADLOCK = {
  processes: [
    { pid: 0, name: 'Process A' },
    { pid: 1, name: 'Process B' },
  ],
  resource_types: [
    { rid: 0, name: 'File1', instances: 1 },
    { rid: 1, name: 'File2', instances: 1 },
  ],
  available: [0, 0],
  allocation: [
    [1, 0],
    [0, 1],
  ],
  request: [
    [0, 1],
    [1, 0],
  ],
};

/**
 * Sample Dataset 13: Single-Instance Safe State
 */
export const SAMPLE_SINGLE_INSTANCE_SAFE = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
  ],
  resource_types: [
    { rid: 0, name: 'Mutex A', instances: 1 },
    { rid: 1, name: 'Mutex B', instances: 1 },
    { rid: 2, name: 'Mutex C', instances: 1 },
  ],
  available: [0, 1, 0],
  allocation: [
    [1, 0, 0],
    [0, 0, 1],
    [0, 0, 0],
  ],
  request: [
    [0, 0, 0],
    [0, 1, 0],
    [1, 0, 0],
  ],
};

/**
 * Sample Dataset 14: Database Lock Deadlock (Single-Instance)
 */
export const SAMPLE_DATABASE_DEADLOCK = {
  processes: [
    { pid: 0, name: 'Transaction T1' },
    { pid: 1, name: 'Transaction T2' },
    { pid: 2, name: 'Transaction T3' },
  ],
  resource_types: [
    { rid: 0, name: 'Table Lock A', instances: 1 },
    { rid: 1, name: 'Table Lock B', instances: 1 },
    { rid: 2, name: 'Table Lock C', instances: 1 },
  ],
  available: [0, 0, 0],
  allocation: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  request: [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0],
  ],
};

/**
 * Sample Dataset 15: No Deadlock with Sequential Access (Single-Instance)
 */
export const SAMPLE_SEQUENTIAL_SAFE = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
    { pid: 3, name: 'P3' },
  ],
  resource_types: [
    { rid: 0, name: 'Lock 0', instances: 1 },
    { rid: 1, name: 'Lock 1', instances: 1 },
    { rid: 2, name: 'Lock 2', instances: 1 },
  ],
  available: [1, 0, 0],
  allocation: [
    [0, 1, 0],
    [0, 0, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  request: [
    [0, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
  ],
};

/**
 * Sample descriptions for tooltips
 */
export const SAMPLE_DESCRIPTIONS = {
  'No Requests (Trivial Safe)': '3 processes with allocated resources but no pending requests. System is trivially safe.',
  'Simple Safe State': '3 processes with 2 resources. System can satisfy all requests sequentially. Matrix algorithm finds safe sequence.',
  'Two Process Deadlock (Single-Instance)': '2 processes holding one resource each and requesting the other. Classic mutual wait deadlock.',
  'Circular Deadlock (Single-Instance)': '3 processes forming a circular wait chain (P0→P1→P2→P0). Detected by cycle in Wait-For Graph.',
  'Single-Instance Safe': '3 processes with mutex locks. P0 has acquired Lock A, system can still proceed safely.',
  'Sequential Safe (Single-Instance)': '4 processes accessing locks sequentially. Safe due to ordered resource acquisition pattern.',
  'Chain Deadlock (Single-Instance)': '4 processes (P0→P1→P2→P3→P0) forming circular chain with printer/scanner resources.',
  'Database Lock Deadlock (Single-Instance)': '3 database transactions with table locks forming circular dependency.',
  'Banker\'s Algorithm (Safe)': '5 processes competing for CPU/Memory/Disk. Classic Banker\'s algorithm scenario with safe sequence.',
  'Multi-Instance Deadlock': '4 processes with multi-instance resources. Deadlock despite multiple instances of R0 and R1.',
  'Partial Deadlock': '4 processes where only subset (P0, P1, P2) are deadlocked. P3 can finish independently.',
  'Complex Safe State': '5 processes with 3 resource types. Complex allocation pattern but system remains safe.',
  'Dining Philosophers (Deadlock)': '5 philosophers, each holding one fork and waiting for adjacent fork. Classic circular deadlock.',
  'Large System (Safe)': '6 processes with 4 resource types (CPU/Memory/Disk/Network). Large-scale safe state scenario.',
};

/**
 * All sample datasets - Organized from Easy to Complex (Duplicates Removed)
 */
export const SAMPLES = {
  // ===== EASY: Basic Safe States =====
  'No Requests (Trivial Safe)': SAMPLE_NO_REQUESTS,
  'Simple Safe State': SAMPLE_SIMPLE_SAFE,
  
  // ===== EASY-MEDIUM: Simple Deadlocks =====
  'Two Process Deadlock (Single-Instance)': SAMPLE_TWO_PROCESS_DEADLOCK,
  'Circular Deadlock (Single-Instance)': SAMPLE_DEADLOCK_CIRCULAR,
  
  // ===== MEDIUM: More Complex Scenarios =====
  'Single-Instance Safe': SAMPLE_SINGLE_INSTANCE_SAFE,
  'Sequential Safe (Single-Instance)': SAMPLE_SEQUENTIAL_SAFE,
  'Chain Deadlock (Single-Instance)': SAMPLE_CHAIN_DEADLOCK,
  'Database Lock Deadlock (Single-Instance)': SAMPLE_DATABASE_DEADLOCK,
  
  // ===== MEDIUM-HARD: Multi-Instance Resources =====
  'Banker\'s Algorithm (Safe)': SAMPLE_BANKERS_SAFE,
  'Multi-Instance Deadlock': SAMPLE_MULTI_INSTANCE_DEADLOCK,
  'Partial Deadlock': SAMPLE_PARTIAL_DEADLOCK,
  
  // ===== HARD: Complex & Unique Cases =====
  'Complex Safe State': SAMPLE_COMPLEX_SAFE,
  'Dining Philosophers (Deadlock)': SAMPLE_DINING_PHILOSOPHERS,
  'Large System (Safe)': SAMPLE_LARGE_SAFE,
};

/**
 * Export system state as JSON string
 */
export function exportToJSON(state) {
  return JSON.stringify(systemStateToJSON(state), null, 2);
}

/**
 * Import system state from JSON string
 */
export function importFromJSON(jsonString) {
  const data = JSON.parse(jsonString);
  return jsonToSystemState(data);
}

/**
 * Local Storage helpers for quick persistence
 */
const LS_KEY = 'deadlock_detective_system_state';

export function saveStateToLocalStorage(state) {
  try {
    const payload = systemStateToJSON(state);
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.warn('Failed to save state:', e);
    return false;
  }
}

export function loadStateFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return jsonToSystemState(parsed);
  } catch (e) {
    console.warn('Failed to load state:', e);
    return null;
  }
}

export function clearStateFromLocalStorage() {
  try {
    localStorage.removeItem(LS_KEY);
    return true;
  } catch (e) {
    console.warn('Failed to clear state:', e);
    return false;
  }
}
