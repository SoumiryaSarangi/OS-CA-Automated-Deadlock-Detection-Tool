/**
 * DEBUG TEST FOR PARTIAL DEADLOCK CASE
 */

import { detectDeadlockMatrix } from '../src/algorithms/matrix.js';

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

console.log('Testing Partial Deadlock scenario...\n');
console.log('Initial State:');
console.log('Available:', state.available);
console.log('Allocation:', state.allocation);
console.log('Request:', state.request);
console.log('\n');

const result = detectDeadlockMatrix(state);

console.log('Result:', result.deadlocked ? 'DEADLOCK DETECTED' : 'NO DEADLOCK');
console.log('Deadlocked processes:', Array.from(result.deadlocked_processes));
console.log('Finish array:', result.finish);
console.log('Execution order:', result.execution_order);
console.log('\n');
console.log('Trace:');
result.trace.forEach(line => console.log(line));
