/**
 * COMPREHENSIVE SAMPLE DATASET VALIDATION
 * 
 * Validates all sample datasets for correctness
 */

import { SAMPLES } from './src/utils/samples.js';
import { detectDeadlockWFG } from './src/algorithms/wfg.js';
import { detectDeadlockMatrix } from './src/algorithms/matrix.js';

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
        message: `Resource R${j} (${state.resource_types[j].name}): Available(${state.available[j]}) + Allocated(${totalAllocated}) = ${total} ≠ Total(${state.resource_types[j].instances})`
      };
    }
  }
  return { valid: true };
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log('   SAMPLE DATASET VALIDATION');
console.log('═══════════════════════════════════════════════════════════\n');

// Expected results for each sample
const expectedResults = {
  'Circular Deadlock (Single-Instance)': { deadlock: true, singleInstance: true },
  'Two Process Deadlock (Single-Instance)': { deadlock: true, singleInstance: true },
  'Chain Deadlock (Single-Instance)': { deadlock: true, singleInstance: true },
  'Database Lock Deadlock (Single-Instance)': { deadlock: true, singleInstance: true },
  'Dining Philosophers (Deadlock)': { deadlock: true, singleInstance: true },
  'Multi-Instance Deadlock': { deadlock: true, singleInstance: false },
  'Partial Deadlock': { deadlock: true, singleInstance: false },
  
  'Safe State': { deadlock: false, singleInstance: false },
  'Simple Safe State': { deadlock: false, singleInstance: false },
  'Single-Instance Safe': { deadlock: false, singleInstance: true },
  'Sequential Safe (Single-Instance)': { deadlock: false, singleInstance: true },
  'No Requests (Trivial Safe)': { deadlock: false, singleInstance: false },
  'Banker\'s Algorithm (Safe)': { deadlock: false, singleInstance: false },
  'Complex Safe State': { deadlock: false, singleInstance: false },
  'Large System (Safe)': { deadlock: false, singleInstance: false },
};

Object.entries(SAMPLES).forEach(([name, sample], index) => {
  console.log(`\nTEST ${index + 1}: ${name}`);
  console.log('─'.repeat(60));
  
  // Validate resource conservation
  const conservation = validateResourceConservation(sample);
  logTest(`${name} - Resource Conservation`, conservation.valid, conservation.message);
  
  // Check if all resources are single-instance
  const allSingleInstance = sample.resource_types.every(r => r.instances === 1);
  
  // Validate matrix dimensions
  const validDimensions = 
    sample.allocation.length === sample.processes.length &&
    sample.request.length === sample.processes.length &&
    sample.available.length === sample.resource_types.length &&
    sample.allocation.every(row => row.length === sample.resource_types.length) &&
    sample.request.every(row => row.length === sample.resource_types.length);
  
  logTest(`${name} - Valid Matrix Dimensions`, validDimensions);
  
  // Run appropriate algorithm
  let result;
  if (allSingleInstance) {
    result = detectDeadlockWFG(sample);
    logTest(`${name} - Uses WFG (single-instance)`, true);
  } else {
    result = detectDeadlockMatrix(sample);
    logTest(`${name} - Uses Matrix (multi-instance)`, true);
  }
  
  // Check expected deadlock state
  const expected = expectedResults[name];
  if (expected) {
    logTest(`${name} - Correct deadlock detection`, result.deadlocked === expected.deadlock,
      `Expected ${expected.deadlock}, got ${result.deadlocked}`);
    
    logTest(`${name} - Correct instance type`, allSingleInstance === expected.singleInstance,
      `Expected single-instance: ${expected.singleInstance}, got: ${allSingleInstance}`);
  }
  
  // Additional validation
  if (result.deadlocked) {
    logTest(`${name} - Has deadlocked processes`, result.deadlocked_processes.size > 0);
  } else {
    logTest(`${name} - No deadlocked processes`, result.deadlocked_processes.size === 0);
  }
  
  logTest(`${name} - Has trace output`, result.trace && result.trace.length > 0);
  
  // Validate no negative values
  const noNegatives = 
    sample.available.every(v => v >= 0) &&
    sample.allocation.every(row => row.every(v => v >= 0)) &&
    sample.request.every(row => row.every(v => v >= 0));
  
  logTest(`${name} - No negative values`, noNegatives);
  
  // Validate no requests exceed total resources
  let requestsValid = true;
  let requestError = '';
  for (let i = 0; i < sample.processes.length; i++) {
    for (let j = 0; j < sample.resource_types.length; j++) {
      if (sample.request[i][j] > sample.resource_types[j].instances) {
        requestsValid = false;
        requestError = `P${i} requests ${sample.request[i][j]} of R${j}, but only ${sample.resource_types[j].instances} exist`;
        break;
      }
    }
    if (!requestsValid) break;
  }
  
  logTest(`${name} - Valid resource requests`, requestsValid, requestError);
});

// =====================================================
// SUMMARY
// =====================================================
console.log('\n═══════════════════════════════════════════════════════════');
console.log('   SAMPLE VALIDATION SUMMARY');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Total Samples: ${Object.keys(SAMPLES).length}`);
console.log(`Total Tests:   ${totalTests}`);
console.log(`✅ Passed:     ${passedTests}`);
console.log(`❌ Failed:     ${failedTests}`);
console.log(`Success Rate:  ${((passedTests / totalTests) * 100).toFixed(2)}%`);
console.log('═══════════════════════════════════════════════════════════\n');

if (failedTests === 0) {
  console.log('🎉 ALL SAMPLE DATASETS VALIDATED!\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME SAMPLE VALIDATIONS FAILED.\n');
  process.exit(1);
}
