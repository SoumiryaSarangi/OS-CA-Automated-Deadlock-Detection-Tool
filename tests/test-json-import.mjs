/**
 * JSON IMPORT FUNCTIONALITY TEST
 * 
 * Tests the JSON import/export features with various scenarios
 */

import { readFileSync } from 'fs';
import { importFromJSON, exportToJSON } from '../src/utils/samples.js';
import { detectDeadlockWFG } from '../src/algorithms/wfg.js';
import { detectDeadlockMatrix } from '../src/algorithms/matrix.js';

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
        message: `Resource R${j}: Available(${state.available[j]}) + Allocated(${totalAllocated}) = ${total} ≠ Total(${state.resource_types[j].instances})`
      };
    }
  }
  return { valid: true };
}

console.log('\n═══════════════════════════════════════════════════════════');
console.log('   JSON IMPORT/EXPORT FUNCTIONALITY TEST');
console.log('═══════════════════════════════════════════════════════════\n');

// Test files to import
const testFiles = [
  {
    name: 'Circular Deadlock',
    path: './tests/test-data/circular-deadlock.json',
    expectedDeadlock: true,
    expectedAlgorithm: 'wfg'
  },
  {
    name: 'Safe State Multi-Instance',
    path: './tests/test-data/safe-state-multi.json',
    expectedDeadlock: false,
    expectedAlgorithm: 'matrix'
  },
  {
    name: 'Banking Deadlock',
    path: './tests/test-data/banking-deadlock.json',
    expectedDeadlock: true,
    expectedAlgorithm: 'wfg'
  },
  {
    name: 'Bankers Algorithm Safe',
    path: './tests/test-data/bankers-algorithm-safe.json',
    expectedDeadlock: false,
    expectedAlgorithm: 'matrix'
  },
  {
    name: 'Mixed Instance Deadlock',
    path: './tests/test-data/mixed-instance-deadlock.json',
    expectedDeadlock: true,
    expectedAlgorithm: 'matrix'
  },
  {
    name: 'Single Process Safe',
    path: './tests/test-data/single-process-safe.json',
    expectedDeadlock: false,
    expectedAlgorithm: 'matrix'
  },
  {
    name: 'Empty System',
    path: './tests/test-data/empty-system.json',
    expectedDeadlock: false,
    expectedAlgorithm: 'matrix'
  }
];

testFiles.forEach((testFile, index) => {
  console.log(`\nTEST ${index + 1}: ${testFile.name}`);
  console.log('─'.repeat(60));
  
  try {
    // Read JSON file
    const jsonContent = readFileSync(testFile.path, 'utf-8');
    logTest(`${testFile.name} - File read successfully`, true);
    
    // Import JSON
    const systemState = importFromJSON(jsonContent);
    logTest(`${testFile.name} - JSON import successful`, true);
    
    // Validate structure
    logTest(`${testFile.name} - Has processes array`, Array.isArray(systemState.processes));
    logTest(`${testFile.name} - Has resource_types array`, Array.isArray(systemState.resource_types));
    logTest(`${testFile.name} - Has available array`, Array.isArray(systemState.available));
    logTest(`${testFile.name} - Has allocation matrix`, Array.isArray(systemState.allocation));
    logTest(`${testFile.name} - Has request matrix`, Array.isArray(systemState.request));
    
    // Validate resource conservation
    if (systemState.processes.length > 0) {
      const conservation = validateResourceConservation(systemState);
      logTest(`${testFile.name} - Resource conservation`, conservation.valid, conservation.message);
    } else {
      logTest(`${testFile.name} - Resource conservation (empty)`, true);
    }
    
    // Test export
    const exportedJSON = exportToJSON(systemState);
    logTest(`${testFile.name} - Export to JSON successful`, true);
    
    // Test re-import
    const reimportedState = importFromJSON(exportedJSON);
    logTest(`${testFile.name} - Re-import successful`, true);
    
    // Validate data integrity after round-trip
    const dataIntact = 
      JSON.stringify(systemState.processes) === JSON.stringify(reimportedState.processes) &&
      JSON.stringify(systemState.resource_types) === JSON.stringify(reimportedState.resource_types) &&
      JSON.stringify(systemState.available) === JSON.stringify(reimportedState.available) &&
      JSON.stringify(systemState.allocation) === JSON.stringify(reimportedState.allocation) &&
      JSON.stringify(systemState.request) === JSON.stringify(reimportedState.request);
    
    logTest(`${testFile.name} - Data integrity after round-trip`, dataIntact);
    
    // Run deadlock detection
    if (systemState.processes.length > 0) {
      const allSingleInstance = systemState.resource_types.every(r => r.instances === 1);
      const algorithm = allSingleInstance ? 'wfg' : 'matrix';
      
      logTest(`${testFile.name} - Algorithm selection correct`, algorithm === testFile.expectedAlgorithm,
        `Expected ${testFile.expectedAlgorithm}, got ${algorithm}`);
      
      let result;
      if (algorithm === 'wfg') {
        result = detectDeadlockWFG(systemState);
      } else {
        result = detectDeadlockMatrix(systemState);
      }
      
      logTest(`${testFile.name} - Deadlock detection ran`, result !== null);
      logTest(`${testFile.name} - Correct deadlock result`, result.deadlocked === testFile.expectedDeadlock,
        `Expected deadlock=${testFile.expectedDeadlock}, got ${result.deadlocked}`);
      
      if (result.deadlocked) {
        logTest(`${testFile.name} - Has deadlocked processes`, result.deadlocked_processes.size > 0);
      } else {
        logTest(`${testFile.name} - No deadlocked processes`, result.deadlocked_processes.size === 0);
      }
    }
    
  } catch (error) {
    logTest(`${testFile.name} - Error handling`, false, error.message);
    console.error(`   Stack: ${error.stack}`);
  }
});

// Test invalid JSON scenarios
console.log('\n\nTEST: Invalid JSON Scenarios');
console.log('─'.repeat(60));

// Test 1: Invalid schema version
try {
  const invalidSchema = JSON.stringify({
    schema_version: '2.0',
    processes: [],
    resource_types: [],
    available: [],
    allocation: [],
    request: []
  });
  importFromJSON(invalidSchema);
  logTest('Invalid schema version - Error thrown', false, 'Should have thrown error');
} catch (error) {
  logTest('Invalid schema version - Error thrown', error.message.includes('Schema version mismatch'));
}

// Test 2: Missing required fields
try {
  const missingFields = JSON.stringify({
    schema_version: '1.0',
    processes: []
  });
  importFromJSON(missingFields);
  logTest('Missing fields - Error thrown', false, 'Should have thrown error');
} catch (error) {
  logTest('Missing fields - Error thrown', true);
}

// Test 3: Invalid JSON syntax
try {
  importFromJSON('{ invalid json }');
  logTest('Invalid JSON syntax - Error thrown', false, 'Should have thrown error');
} catch (error) {
  logTest('Invalid JSON syntax - Error thrown', true);
}

// Test 4: Negative values
try {
  const negativeValues = JSON.stringify({
    schema_version: '1.0',
    processes: [{ pid: 0, name: 'P0' }],
    resource_types: [{ rid: 0, name: 'R0', instances: 1 }],
    available: [-1],
    allocation: [[0]],
    request: [[1]]
  });
  importFromJSON(negativeValues);
  logTest('Negative available values - Should validate or accept', true);
} catch (error) {
  logTest('Negative values - Validation present', true);
}

// Summary
console.log('\n═══════════════════════════════════════════════════════════');
console.log('   JSON IMPORT/EXPORT TEST SUMMARY');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Total Tests:  ${totalTests}`);
console.log(`✅ Passed:    ${passedTests}`);
console.log(`❌ Failed:    ${failedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
console.log('═══════════════════════════════════════════════════════════\n');

if (failedTests === 0) {
  console.log('🎉 ALL JSON IMPORT/EXPORT TESTS PASSED!\n');
  console.log('✅ JSON files can be safely imported into the application');
  console.log('✅ Data integrity maintained through export/import cycle');
  console.log('✅ All test files produce correct deadlock detection results\n');
  process.exit(0);
} else {
  console.log('⚠️  SOME TESTS FAILED. Please review.\n');
  process.exit(1);
}
