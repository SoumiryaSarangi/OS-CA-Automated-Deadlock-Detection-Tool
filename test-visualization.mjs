/**
 * VISUALIZATION AND UI DATA STRUCTURE VALIDATION
 * 
 * Tests that all data structures match what the UI components expect
 */

import { detectDeadlockWFG } from './src/algorithms/wfg.js';
import { detectDeadlockMatrix } from './src/algorithms/matrix.js';
import { generateRecoverySuggestions } from './src/algorithms/recovery.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function logTest(testName, passed, message = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`❌ FAIL: ${testName}`);
    if (message) console.error(`   ${message}`);
  }
}

// =====================================================
// TEST VISUALIZATION DATA STRUCTURES
// =====================================================

console.log('\n═══════════════════════════════════════════════════════════');
console.log('   VISUALIZATION DATA STRUCTURE TESTS');
console.log('═══════════════════════════════════════════════════════════\n');

// Test WFG output structure
console.log('TEST 1: WFG Output Structure');
const wfgState = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 1 },
    { rid: 1, name: 'R1', instances: 1 },
  ],
  available: [0, 0],
  allocation: [[1, 0], [0, 1]],
  request: [[0, 1], [1, 0]],
};

const wfgResult = detectDeadlockWFG(wfgState);

logTest('WFG returns deadlocked (boolean)', typeof wfgResult.deadlocked === 'boolean');
logTest('WFG returns deadlocked_processes (Set)', wfgResult.deadlocked_processes instanceof Set);
logTest('WFG returns cycles (Array)', Array.isArray(wfgResult.cycles));
logTest('WFG returns wait_for_edges (Array)', Array.isArray(wfgResult.wait_for_edges));
logTest('WFG returns trace (Array)', Array.isArray(wfgResult.trace));

// Validate wait_for_edges structure
if (wfgResult.wait_for_edges.length > 0) {
  const edge = wfgResult.wait_for_edges[0];
  logTest('WFG edge has from_pid', typeof edge.from_pid === 'number');
  logTest('WFG edge has to_pid', typeof edge.to_pid === 'number');
  logTest('WFG edge has resource_id', typeof edge.resource_id === 'number');
}

// Validate cycle structure
if (wfgResult.cycles.length > 0) {
  const cycle = wfgResult.cycles[0];
  logTest('WFG cycle has processes array', Array.isArray(cycle.processes));
  logTest('WFG cycle has edges array', Array.isArray(cycle.edges));
}

console.log('');

// Test Matrix output structure
console.log('TEST 2: Matrix Output Structure');
const matrixState = {
  processes: [
    { pid: 0, name: 'P0' },
    { pid: 1, name: 'P1' },
    { pid: 2, name: 'P2' },
  ],
  resource_types: [
    { rid: 0, name: 'R0', instances: 3 },
    { rid: 1, name: 'R1', instances: 2 },
  ],
  available: [0, 0],
  allocation: [[2, 1], [1, 0], [0, 1]],
  request: [[1, 1], [1, 2], [3, 1]],
};

const matrixResult = detectDeadlockMatrix(matrixState);

logTest('Matrix returns deadlocked (boolean)', typeof matrixResult.deadlocked === 'boolean');
logTest('Matrix returns deadlocked_processes (Set)', matrixResult.deadlocked_processes instanceof Set);
logTest('Matrix returns finish (Array)', Array.isArray(matrixResult.finish));
logTest('Matrix returns execution_order (Array)', Array.isArray(matrixResult.execution_order));
logTest('Matrix returns trace (Array)', Array.isArray(matrixResult.trace));

logTest('Matrix finish array correct length', matrixResult.finish.length === matrixState.processes.length);
logTest('Matrix finish contains booleans', matrixResult.finish.every(f => typeof f === 'boolean'));

console.log('');

// Test Recovery output structure
console.log('TEST 3: Recovery Suggestions Structure');
const recovery = generateRecoverySuggestions(matrixState, matrixResult.deadlocked_processes);

logTest('Recovery has termination array', Array.isArray(recovery.termination));
logTest('Recovery has preemption array', Array.isArray(recovery.preemption));

if (recovery.termination.length > 0) {
  const suggestion = recovery.termination[0];
  logTest('Termination has action_type', typeof suggestion.action_type === 'string');
  logTest('Termination has description', typeof suggestion.description === 'string');
  logTest('Termination has processes array', Array.isArray(suggestion.processes));
  logTest('Termination has explanation', typeof suggestion.explanation === 'string');
}

if (recovery.preemption.length > 0) {
  const suggestion = recovery.preemption[0];
  logTest('Preemption has action_type', typeof suggestion.action_type === 'string');
  logTest('Preemption has description', typeof suggestion.description === 'string');
  logTest('Preemption has processes', suggestion.processes instanceof Set);
  logTest('Preemption has resources', suggestion.resources instanceof Set);
  logTest('Preemption has explanation', typeof suggestion.explanation === 'string');
}

console.log('');

// Test D3.js graph data structure
console.log('TEST 4: Graph Visualization Data');

// Ensure processes and resources can be distinguished
const processes = wfgState.processes.map(p => ({ ...p, type: 'process' }));
const resources = wfgState.resource_types.map(r => ({ ...r, type: 'resource' }));

logTest('Processes have required fields', processes.every(p => 
  typeof p.pid === 'number' && typeof p.name === 'string'
));

logTest('Resources have required fields', resources.every(r => 
  typeof r.rid === 'number' && typeof r.name === 'string' && typeof r.instances === 'number'
));

// Test edge data for D3
const edges = wfgResult.wait_for_edges.map(e => ({
  source: `P${e.from_pid}`,
  target: `P${e.to_pid}`,
  resource: `R${e.resource_id}`
}));

logTest('Graph edges have source/target', edges.every(e => 
  typeof e.source === 'string' && typeof e.target === 'string'
));

console.log('');

// Test trace messages
console.log('TEST 5: Trace Messages Format');
logTest('WFG trace not empty', wfgResult.trace.length > 0);
logTest('WFG trace contains strings', wfgResult.trace.every(t => typeof t === 'string'));
logTest('Matrix trace not empty', matrixResult.trace.length > 0);
logTest('Matrix trace contains strings', matrixResult.trace.every(t => typeof t === 'string'));

console.log('');

// Test large dataset handling
console.log('TEST 6: Large Dataset Performance');
const largeState = {
  processes: Array.from({ length: 20 }, (_, i) => ({ pid: i, name: `P${i}` })),
  resource_types: Array.from({ length: 10 }, (_, i) => ({ rid: i, name: `R${i}`, instances: 5 })),
  available: Array(10).fill(1),
  allocation: Array.from({ length: 20 }, () => Array(10).fill(0)),
  request: Array.from({ length: 20 }, () => Array(10).fill(0)),
};

// Make first 10 processes allocate resources
for (let i = 0; i < 10; i++) {
  largeState.allocation[i][i] = 2;
  largeState.available[i] = 3;
}

const startTime = Date.now();
const largeResult = detectDeadlockMatrix(largeState);
const endTime = Date.now();

logTest('Large dataset completes', largeResult !== null);
logTest('Large dataset fast (<1000ms)', (endTime - startTime) < 1000, `Took ${endTime - startTime}ms`);
logTest('Large dataset has correct process count', largeResult.finish.length === 20);

console.log('');

// Test edge cases for UI
console.log('TEST 7: UI Edge Cases');

// Empty state
const emptyState = {
  processes: [],
  resource_types: [],
  available: [],
  allocation: [],
  request: [],
};

try {
  const emptyResult = detectDeadlockMatrix(emptyState);
  logTest('Empty state handled gracefully', emptyResult.deadlocked === false);
} catch (e) {
  logTest('Empty state handled gracefully', false, `Exception: ${e.message}`);
}

// Single process
const singleState = {
  processes: [{ pid: 0, name: 'P0' }],
  resource_types: [{ rid: 0, name: 'R0', instances: 1 }],
  available: [1],
  allocation: [[0]],
  request: [[0]],
};

const singleResult = detectDeadlockWFG(singleState);
logTest('Single process handled', singleResult.deadlocked === false);
logTest('Single process has correct data', singleResult.wait_for_edges.length === 0);

// Zero resources
const zeroResourceState = {
  processes: [{ pid: 0, name: 'P0' }],
  resource_types: [{ rid: 0, name: 'R0', instances: 0 }],
  available: [0],
  allocation: [[0]],
  request: [[0]],
};

const zeroResult = detectDeadlockMatrix(zeroResourceState);
logTest('Zero resource instances handled', zeroResult.deadlocked === false);

console.log('');

// Test deadlocked_processes Set conversions
console.log('TEST 8: Set to Array Conversions for UI');
const deadlockedArray = Array.from(wfgResult.deadlocked_processes);
logTest('Set converts to array', Array.isArray(deadlockedArray));
logTest('Set array contains numbers', deadlockedArray.every(p => typeof p === 'number'));

const sortedDeadlocked = deadlockedArray.sort((a, b) => a - b);
logTest('PIDs sortable', sortedDeadlocked.every((p, i, arr) => i === 0 || p >= arr[i - 1]));

console.log('');

// Test resource conservation in all operations
console.log('TEST 9: Resource Conservation Validation');

function validateConservation(state) {
  for (let j = 0; j < state.resource_types.length; j++) {
    let totalAllocated = 0;
    for (let i = 0; i < state.processes.length; i++) {
      totalAllocated += state.allocation[i][j];
    }
    const total = state.available[j] + totalAllocated;
    if (total !== state.resource_types[j].instances) {
      return false;
    }
  }
  return true;
}

logTest('WFG test state conserves resources', validateConservation(wfgState));
logTest('Matrix test state conserves resources', validateConservation(matrixState));
logTest('Large test state conserves resources', validateConservation(largeState));

console.log('');

// =====================================================
// SUMMARY
// =====================================================
console.log('═══════════════════════════════════════════════════════════');
console.log('   VISUALIZATION TEST SUMMARY');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Total Tests:  ${totalTests}`);
console.log(`✅ Passed:    ${passedTests}`);
console.log(`❌ Failed:    ${failedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
console.log('═══════════════════════════════════════════════════════════\n');

if (failedTests === 0) {
  console.log('🎉 ALL VISUALIZATION TESTS PASSED!\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED.\n');
  process.exit(1);
}
