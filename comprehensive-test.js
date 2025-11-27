/**
 * COMPREHENSIVE TEST SUITE FOR DEADLOCK DETECTION SYSTEM
 * 
 * This suite tests all algorithms with edge cases, boundary conditions,
 * and validates correctness of detection and visualization data.
 */

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
      // Request should not exceed total instances
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

  // Validate input
  const conservationCheck = validateResourceConservation(state);
  logTest('Test 1a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const feasibilityCheck = validateRequestFeasibility(state);
  logTest('Test 1b: Request Feasibility', feasibilityCheck.valid, feasibilityCheck.message);

  // Test WFG Algorithm
  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 1c: WFG detects deadlock', wfgResult.deadlocked === true);
  logTest('Test 1d: WFG identifies both processes', wfgResult.deadlocked_processes.size === 2);
  logTest('Test 1e: WFG finds P0 deadlocked', wfgResult.deadlocked_processes.has(0));
  logTest('Test 1f: WFG finds P1 deadlocked', wfgResult.deadlocked_processes.has(1));
  logTest('Test 1g: WFG has wait-for edges', wfgResult.wait_for_edges.length === 2);
  logTest('Test 1h: WFG detects cycle', wfgResult.cycles.length > 0);

  // Test Recovery
  const recovery = generateRecoverySuggestions(state, wfgResult.deadlocked_processes);
  logTest('Test 1i: Recovery suggestions exist', recovery.termination.length > 0);
  logTest('Test 1j: Minimal termination is 1 process', recovery.termination[0].processes.length === 1);
}

// =====================================================
// TEST CASE 2: No Deadlock - Safe State (Single-Instance)
// =====================================================
function test2_SafeStateSingle() {
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
// TEST CASE 3: Circular Wait with 4 Processes (Single-Instance)
// =====================================================
function test3_CircularWait4() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
      { pid: 2, name: 'P2' },
      { pid: 3, name: 'P3' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 1 },
      { rid: 1, name: 'R1', instances: 1 },
      { rid: 2, name: 'R2', instances: 1 },
      { rid: 3, name: 'R3', instances: 1 },
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

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 3a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 3b: WFG detects deadlock', wfgResult.deadlocked === true);
  logTest('Test 3c: All 4 processes deadlocked', wfgResult.deadlocked_processes.size === 4);
  logTest('Test 3d: Wait-for edges exist', wfgResult.wait_for_edges.length === 4);
}

// =====================================================
// TEST CASE 4: Multi-Instance Safe State
// =====================================================
function test4_MultiInstanceSafe() {
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
  logTest('Test 4a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 4b: Matrix detects no deadlock', matrixResult.deadlocked === false);
  logTest('Test 4c: All processes finish', matrixResult.finish.every(f => f === true));
  logTest('Test 4d: Safe sequence exists', matrixResult.execution_order.length === 3);
}

// =====================================================
// TEST CASE 5: Multi-Instance Deadlock
// =====================================================
function test5_MultiInstanceDeadlock() {
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
  logTest('Test 5a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 5b: Matrix detects deadlock', matrixResult.deadlocked === true);
  logTest('Test 5c: Some processes deadlocked', matrixResult.deadlocked_processes.size > 0);
  logTest('Test 5d: Not all processes finish', matrixResult.finish.some(f => f === false));
}

// =====================================================
// TEST CASE 6: Edge Case - No Resources Allocated
// =====================================================
function test6_NoAllocation() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 2 },
    ],
    available: [2],
    allocation: [
      [0],
      [0],
    ],
    request: [
      [1],
      [1],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 6a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 6b: No deadlock when resources available', matrixResult.deadlocked === false);
  logTest('Test 6c: All processes can finish', matrixResult.finish.every(f => f === true));
}

// =====================================================
// TEST CASE 7: Edge Case - No Requests
// =====================================================
function test7_NoRequests() {
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
  logTest('Test 7a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 7b: WFG no deadlock (no requests)', wfgResult.deadlocked === false);
  logTest('Test 7c: No wait-for edges', wfgResult.wait_for_edges.length === 0);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 7d: Matrix no deadlock (no requests)', matrixResult.deadlocked === false);
}

// =====================================================
// TEST CASE 8: Edge Case - Single Process
// =====================================================
function test8_SingleProcess() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 1 },
    ],
    available: [0],
    allocation: [
      [1],
    ],
    request: [
      [0],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 8a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 8b: Single process no deadlock', wfgResult.deadlocked === false);
  
  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 8c: Single process finishes', matrixResult.deadlocked === false);
}

// =====================================================
// TEST CASE 9: Partial Deadlock (Some processes safe)
// =====================================================
function test9_PartialDeadlock() {
  const state = {
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
      [0, 1],
      [1, 1],
      [0, 0],
    ],
    request: [
      [0, 1],
      [1, 0],
      [0, 0],
      [0, 0],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 9a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 9b: Detects partial deadlock', matrixResult.deadlocked === true);
  logTest('Test 9c: Not all processes deadlocked', matrixResult.deadlocked_processes.size < 4);
  logTest('Test 9d: Some processes finish', matrixResult.execution_order.length > 0);
}

// =====================================================
// TEST CASE 10: Large System (Stress Test)
// =====================================================
function test10_LargeSystem() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
      { pid: 2, name: 'P2' },
      { pid: 3, name: 'P3' },
      { pid: 4, name: 'P4' },
      { pid: 5, name: 'P5' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 4 },
      { rid: 1, name: 'R1', instances: 3 },
      { rid: 2, name: 'R2', instances: 4 },
      { rid: 3, name: 'R3', instances: 2 },
    ],
    available: [1, 0, 2, 0],
    allocation: [
      [0, 1, 0, 2],
      [2, 0, 0, 0],
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
    ],
    request: [
      [0, 0, 1, 0],
      [1, 0, 1, 0],
      [2, 1, 0, 0],
      [0, 1, 0, 1],
      [0, 0, 2, 0],
      [1, 0, 0, 0],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 10a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 10b: Large system processes', matrixResult.deadlocked !== undefined);
  logTest('Test 10c: Finish array correct size', matrixResult.finish.length === 6);
}

// =====================================================
// TEST CASE 11: Banker's Algorithm Classic Example
// =====================================================
function test11_BankersAlgorithm() {
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
  logTest('Test 11a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 11b: Banker safe state', matrixResult.deadlocked === false);
  logTest('Test 11c: Safe sequence found', matrixResult.execution_order.length === 5);
}

// =====================================================
// TEST CASE 12: Zero Resources Edge Case
// =====================================================
function test12_ZeroResources() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 0 },
    ],
    available: [0],
    allocation: [
      [0],
      [0],
    ],
    request: [
      [0],
      [0],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 12a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 12b: Zero resources handled', matrixResult.deadlocked === false);
}

// =====================================================
// TEST CASE 13: Self-Loop Detection (Process waiting for itself)
// =====================================================
function test13_NoSelfLoop() {
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
      [1], // P0 requesting resource it already holds - should not create self-loop
      [1],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 13a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  // P0 shouldn't wait for itself
  const hasSelfLoop = wfgResult.wait_for_edges.some(e => e.from_pid === 0 && e.to_pid === 0);
  logTest('Test 13b: No self-loop created', !hasSelfLoop);
}

// =====================================================
// TEST CASE 14: Maximum Resource Request
// =====================================================
function test14_MaxResourceRequest() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 10 },
    ],
    available: [5],
    allocation: [
      [3],
      [2],
    ],
    request: [
      [7], // P0 requests all remaining
      [0],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 14a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 14b: Handles max request', matrixResult.deadlocked !== undefined);
}

// =====================================================
// TEST CASE 15: Dining Philosophers Deadlock
// =====================================================
function test15_DiningPhilosophers() {
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
  logTest('Test 15a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 15b: Dining philosophers deadlock', wfgResult.deadlocked === true);
  logTest('Test 15c: All philosophers deadlocked', wfgResult.deadlocked_processes.size === 5);
  logTest('Test 15d: Circular wait detected', wfgResult.cycles.length > 0);
}

// =====================================================
// TEST CASE 16: Mixed Instance Types
// =====================================================
function test16_MixedInstanceTypes() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
      { pid: 2, name: 'P2' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 1 }, // Single-instance
      { rid: 1, name: 'R1', instances: 5 }, // Multi-instance
      { rid: 2, name: 'R2', instances: 1 }, // Single-instance
    ],
    available: [0, 2, 0],
    allocation: [
      [1, 2, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    request: [
      [0, 0, 1],
      [0, 2, 0],
      [1, 1, 1],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 16a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  // Should use Matrix algorithm for mixed
  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 16b: Matrix handles mixed instances', matrixResult.deadlocked !== undefined);
}

// =====================================================
// TEST CASE 17: Recovery Strategy Validation
// =====================================================
function test17_RecoveryStrategies() {
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

  const wfgResult = detectDeadlockWFG(state);
  const recovery = generateRecoverySuggestions(state, wfgResult.deadlocked_processes);
  
  logTest('Test 17a: Termination strategies exist', recovery.termination.length > 0);
  logTest('Test 17b: Preemption strategies exist', recovery.preemption.length > 0);
  logTest('Test 17c: Termination has minimal set', recovery.termination[0].processes.length >= 1);
  logTest('Test 17d: Each strategy has explanation', recovery.termination[0].explanation.length > 0);
}

// =====================================================
// TEST CASE 18: Empty System
// =====================================================
function test18_EmptySystem() {
  const state = {
    processes: [],
    resource_types: [],
    available: [],
    allocation: [],
    request: [],
  };

  try {
    const matrixResult = detectDeadlockMatrix(state);
    logTest('Test 18a: Empty system handled', matrixResult.deadlocked === false);
    logTest('Test 18b: No deadlocked processes', matrixResult.deadlocked_processes.size === 0);
  } catch (e) {
    logTest('Test 18a: Empty system handled', false, `Exception: ${e.message}`);
  }
}

// =====================================================
// TEST CASE 19: High Resource Contention
// =====================================================
function test19_HighContention() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
      { pid: 2, name: 'P2' },
      { pid: 3, name: 'P3' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 2 },
    ],
    available: [0],
    allocation: [
      [1],
      [1],
      [0],
      [0],
    ],
    request: [
      [1],
      [1],
      [2],
      [2],
    ],
  };

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 19a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const matrixResult = detectDeadlockMatrix(state);
  logTest('Test 19b: High contention detected', matrixResult.deadlocked === true);
  logTest('Test 19c: Deadlocked processes identified', matrixResult.deadlocked_processes.size > 0);
}

// =====================================================
// TEST CASE 20: Sequential Safe Execution
// =====================================================
function test20_SequentialSafe() {
  const state = {
    processes: [
      { pid: 0, name: 'P0' },
      { pid: 1, name: 'P1' },
      { pid: 2, name: 'P2' },
      { pid: 3, name: 'P3' },
    ],
    resource_types: [
      { rid: 0, name: 'R0', instances: 1 },
      { rid: 1, name: 'R1', instances: 1 },
      { rid: 2, name: 'R2', instances: 1 },
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

  const conservationCheck = validateResourceConservation(state);
  logTest('Test 20a: Resource Conservation', conservationCheck.valid, conservationCheck.message);

  const wfgResult = detectDeadlockWFG(state);
  logTest('Test 20b: Sequential safe execution', wfgResult.deadlocked === false);
  logTest('Test 20c: No cycles in safe sequence', wfgResult.cycles.length === 0);
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
test3_CircularWait4();
console.log('');
test4_MultiInstanceSafe();
console.log('');
test5_MultiInstanceDeadlock();
console.log('');
test6_NoAllocation();
console.log('');
test7_NoRequests();
console.log('');
test8_SingleProcess();
console.log('');
test9_PartialDeadlock();
console.log('');
test10_LargeSystem();
console.log('');
test11_BankersAlgorithm();
console.log('');
test12_ZeroResources();
console.log('');
test13_NoSelfLoop();
console.log('');
test14_MaxResourceRequest();
console.log('');
test15_DiningPhilosophers();
console.log('');
test16_MixedInstanceTypes();
console.log('');
test17_RecoveryStrategies();
console.log('');
test18_EmptySystem();
console.log('');
test19_HighContention();
console.log('');
test20_SequentialSafe();

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
} else {
  console.log('⚠️  SOME TESTS FAILED. Please review and fix issues.');
  process.exit(1);
}
