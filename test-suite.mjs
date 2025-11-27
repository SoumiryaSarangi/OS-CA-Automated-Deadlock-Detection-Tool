/**
 * COMPREHENSIVE TEST SUITE FOR DEADLOCK DETECTION SYSTEM
 * 
 * This suite tests all algorithms with edge cases, boundary conditions,
 * and validates correctness of detection and visualization data.
 */

// Import with .js extensions for ES modules
import { detectDeadlockWFG } from './src/algorithms/wfg.js';
import { detectDeadlockMatrix } from './src/algorithms/matrix.js';
import { generateRecoverySuggestions } from './src/algorithms/recovery.js';

// Test counter
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Test result logger
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

// Validation helpers
function validateResourceConservation(state) {
  for (let j = 0; j < state.resource_types.length; j++) {
    let totalAllocated = 0;
    for (let i = 0; i < state.processes.length; i++) {
      totalAllocated += state.allocation[i][j];
    }
    const total = state.available[j] + totalAllocated;
    if (total !== state.resource_types[j].instances) {
      return {
        valid: false,
        message: `Resource R${j}: Available(${state.available[j]}) + Allocated(${totalAllocated}) = ${total} ≠ Total(${state.resource_types[j].instances})`
      };
    }
  }
  return { valid: true };
}

function validateRequestFeasibility(state) {
  for (let i = 0; i < state.processes.length; i++) {
    for (let j = 0; j < state.resource_types.length; j++) {
      if (state.request[i][j] < 0) {
        return { valid: false, message: `P${i} has negative request for R${j}` };
      }
      if (state.allocation[i][j] < 0) {
        return { valid: false, message: `P${i} has negative allocation for R${j}` };
      }
      if (state.request[i][j] > state.resource_types[j].instances) {
        return { valid: false, message: `P${i} requests ${state.request[i][j]} of R${j}, but only ${state.resource_types[j].instances} exist` };
      }
    }
  }
  return { valid: true };
}

// =====================================================
// TEST CASE 1: Simple Two-Process Deadlock (Single-Instance)
// =====================================================
function test1_TwoProcessDeadlock() {
  console.log('TEST 1: Simple Two-Process Deadlock');
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 1 },
      { rid: 1, name: 'R1', instances: 1 },
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

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 1a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const feasibilityCheck = validateRequestFeasibility(state);
  logTest('Test 1b: Request Feasibility', feasibilityCheck.valid, feasibilityCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 1c: WFG detects deadlock', wfgResult.deadlocked === true);
  logTest('Test 1d: WFG identifies both processes', wfgResult.deadlocked_processes.size === 2);
  logTest('Test 1e: WFG finds P0 deadlocked', wfgResult.deadlocked_processes.has(0));
  logTest('Test 1f: WFG finds P1 deadlocked', wfgResult.deadlocked_processes.has(1));
  logTest('Test 1g: WFG has wait-for edges', wfgResult.wait_for_edges.length === 2);
  logTest('Test 1h: WFG detects cycle', wfgResult.cycles.length > 0);

  const recovery = generateRecoverySuggestions(state, wfgResult.deadlocked_processes);
  logTest('Test 1i: Recovery suggestions exist', recovery.termination.length > 0);
  logTest('Test 1j: Minimal termination is 1 process', recovery.termination[0].processes.length === 1);
}

// =====================================================
// TEST CASE 2: No Deadlock - Safe State (Single-Instance)
// =====================================================
function test2_SafeStateSingle() {
  console.log('TEST 2: No Deadlock - Safe State');
  const state = {
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

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 2a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 2b: WFG detects no deadlock', wfgResult.deadlocked === false);
  logTest('Test 2c: No processes deadlocked', wfgResult.deadlocked_processes.size === 0);
}

// =====================================================
// TEST CASE 3: Multi-Instance Safe State  
// =====================================================
function test3_MultiInstanceSafe() {
  console.log('TEST 3: Multi-Instance Safe State');
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
      { pid: 2, name: 'P2' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 3 },
      { rid: 1, name: 'R1', instances: 2 },
    ],
    available: [1, 0],
    allocation: [
      [1, 1],
      [1, 0],
      [0, 1],
    ],
    request: [
      [0, 1],
      [1, 0],
      [1, 0],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 3a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 3b: Matrix detects no deadlock', matrixResult.deadlocked === false);
  logTest('Test 3c: All processes finish', matrixResult.finish.every(f => f === true));
  logTest('Test 3d: Safe sequence exists', matrixResult.execution_order.length === 3);
}

// =====================================================
// TEST CASE 4: Multi-Instance Deadlock
// =====================================================
function test4_MultiInstanceDeadlock() {
  console.log('TEST 4: Multi-Instance Deadlock');
  const state = {
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
    allocation: [
      [2, 1],
      [1, 0],
      [0, 1],
    ],
    request: [
      [1, 1],
      [1, 2],
      [3, 1],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 4a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 4b: Matrix detects deadlock', matrixResult.deadlocked === true);
  logTest('Test 4c: Some processes deadlocked', matrixResult.deadlocked_processes.size > 0);
  logTest('Test 4d: Not all processes finish', matrixResult.finish.some(f => f === false));
}

// =====================================================
// TEST CASE 5: Edge Case - No Requests
// =====================================================
function test5_NoRequests() {
  console.log('TEST 5: Edge Case - No Requests');
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 1 },
    ],
    available: [0],
    allocation: [
      [1],
      [0],
    ],
    request: [
      [0],
      [0],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 5a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 5b: WFG no deadlock (no requests)', wfgResult.deadlocked === false);
  logTest('Test 5c: No wait-for edges', wfgResult.wait_for_edges.length === 0);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 5d: Matrix no deadlock (no requests)', matrixResult.deadlocked === false);
}

// =====================================================
// TEST CASE 6: Dining Philosophers Deadlock
// =====================================================
function test6_DiningPhilosophers() {
  console.log('TEST 6: Dining Philosophers Deadlock');
  const state = {
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

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 6a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 6b: Dining philosophers deadlock', wfgResult.deadlocked === true);
  logTest('Test 6c: All philosophers deadlocked', wfgResult.deadlocked_processes.size === 5);
  logTest('Test 6d: Circular wait detected', wfgResult.cycles.length > 0);
}

// =====================================================
// TEST CASE 7: Banker's Algorithm Classic Example
// =====================================================
function test7_BankersAlgorithm() {
  console.log('TEST 7: Banker\'s Algorithm');
  const state = {
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

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 7a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 7b: Banker safe state', matrixResult.deadlocked === false);
  logTest('Test 7c: Safe sequence found', matrixResult.execution_order.length === 5);
}

// =====================================================
// TEST CASE 8: Empty System Edge Case
// =====================================================
function test8_EmptySystem() {
  console.log('TEST 8: Empty System');
  const state = {
    processes: [],
    resource_types: [],
    available: [],
    allocation: [],
    request: [],
  };

  try {
    const matrixResult = detectDeadlockMatrix(state);
    logTest('Test 8a: Empty system handled', matrixResult.deadlocked === false);
    logTest('Test 8b: No deadlocked processes', matrixResult.deadlocked_processes.size === 0);
  } catch (e) {
    logTest('Test 8a: Empty system handled', false, `Exception: ${e.message}`);
  }
}

// =====================================================
// TEST CASE 9: No Self-Loop
// =====================================================
function test9_NoSelfLoop() {
  console.log('TEST 9: No Self-Loop Detection');
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 1 },
    ],
    available: [0],
    allocation: [
      [1],
      [0],
    ],
    request: [
      [1], // P0 requesting resource it already holds
      [1],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 9a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  const hasSelfLoop = wfgResult.wait_for_edges.some(e => e.from_pid === 0 && e.to_pid === 0);
  logTest('Test 9b: No self-loop created', !hasSelfLoop);
}

// =====================================================
// TEST CASE 10: Partial Deadlock
// =====================================================
function test10_PartialDeadlock() {
  console.log('TEST 10: Partial Deadlock');
  // True partial deadlock: P0 and P1 are in circular wait
  // P2 and P3 can finish but are blocked waiting for more resources
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
      { pid: 2, name: 'P2' },
      { pid: 3, name: 'P3' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 3 },
      { rid: 1, name: 'R1', instances: 3 },
    ],
    available: [0, 0],
    allocation: [
      [2, 0],
      [0, 2],
      [1, 1],
      [0, 0],
    ],
    request: [
      [0, 2], // P0 wants R1 (held by P1)
      [2, 0], // P1 wants R0 (held by P0)
      [1, 1], // P2 wants more than available
      [0, 0], // P3 has no requests
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 10a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 10b: Detects partial deadlock', matrixResult.deadlocked === true);
  logTest('Test 10c: Not all processes deadlocked', matrixResult.deadlocked_processes.size < 4);
  logTest('Test 10d: P3 can finish (no requests)', matrixResult.finish[3] === true);
}

// =====================================================
// RUN ALL TESTS
// =====================================================
console.log('\n');
console.log('═══════════════════════════════════════════════════════════');
console.log('   COMPREHENSIVE DEADLOCK DETECTION TEST SUITE');
console.log('═══════════════════════════════════════════════════════════');
console.log('\n');

test1_TwoProcessDeadlock();
console.log('');
test2_SafeStateSingle();
console.log('');
test3_MultiInstanceSafe();
console.log('');
test4_MultiInstanceDeadlock();
console.log('');
test5_NoRequests();
console.log('');
test6_DiningPhilosophers();
console.log('');
test7_BankersAlgorithm();
console.log('');
test8_EmptySystem();
console.log('');
test9_NoSelfLoop();
console.log('');
test10_PartialDeadlock();

// =====================================================
// SUMMARY
// =====================================================
console.log('\n');
console.log('═══════════════════════════════════════════════════════════');
console.log('   TEST SUMMARY');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Total Tests:  ${totalTests}`);
console.log(`✅ Passed:    ${passedTests}`);
console.log(`❌ Failed:    ${failedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
console.log('═══════════════════════════════════════════════════════════');
console.log('\n');

if (failedTests === 0) {
  console.log('🎉 ALL TESTS PASSED! System is production-ready.');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED. Please review and fix issues.');
  process.exit(1);
}
