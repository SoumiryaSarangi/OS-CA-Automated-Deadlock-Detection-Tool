/**
 * Recovery Strategies for Deadlock Resolution
 * 
 * Suggests recovery actions when deadlock is detected:
 * 1. Process Termination: Identify minimal set of processes to terminate
 * 2. Resource Preemption: Suggest which resources to preempt from which processes
 */

import { canSystemRecover } from './matrix.js';

/**
 * Generate all combinations of a set
 */
function* combinations(arr, size) {
  if (size === 0) {
    yield [];
    return;
  }
  if (arr.length < size) {
    return;
  }
  
  const [first, ...rest] = arr;
  
  // Include first element
  for (const combo of combinations(rest, size - 1)) {
    yield [first, ...combo];
  }
  
  // Exclude first element
  yield* combinations(rest, size);
}

/**
 * Find minimal sets of processes to terminate to break deadlock
 */
export function findMinimalTerminationSet(
  state,
  deadlocked_pids
) {
  const suggestions = [];

  if (deadlocked_pids.size === 0) {
    return suggestions;
  }

  const deadlocked_array = Array.from(deadlocked_pids).sort((a, b) => a - b);

  // Try progressively larger sets
  for (let size = 1; size <= deadlocked_array.length; size++) {
    for (const subset of combinations(deadlocked_array, size)) {
      const terminated = new Set(subset);
      const { can_recover, trace } = canSystemRecover(state, terminated);

      if (can_recover) {
        const process_names = Array.from(terminated)
          .sort((a, b) => a - b)
          .map(pid => `P${pid}`)
          .join(', ');

        const explanation = 
          `Terminating ${process_names} releases their allocated resources.\n` +
          'After termination:\n' +
          trace.join('\n');

        suggestions.push({
          action_type: 'terminate',
          description: `Terminate ${terminated.size} process(es): ${process_names}`,
          processes: subset,
          explanation,
        });
      }
    }

    // If we found solutions of this size, return them (minimal solutions)
    if (suggestions.length > 0) {
      return suggestions;
    }
  }

  return suggestions;
}

/**
 * Suggest resource preemption as an alternative to process termination
 */
export function suggestPreemptionTargets(
  state,
  deadlocked_pids
) {
  const suggestions = [];

  if (deadlocked_pids.size === 0) {
    return suggestions;
  }

  // For each deadlocked process, suggest preempting resources it holds
  for (const pid of Array.from(deadlocked_pids).sort((a, b) => a - b)) {
    const held_resources = new Set();
    let total_held = 0;

    for (let j = 0; j < state.resource_types.length; j++) {
      if (state.allocation[pid][j] > 0) {
        held_resources.add(j);
        total_held += state.allocation[pid][j];
      }
    }

    if (held_resources.size > 0) {
      const resource_names = Array.from(held_resources)
        .sort((a, b) => a - b)
        .map(rid => `R${rid}`)
        .join(', ');

      const explanation = 
        `Preempt resources ${resource_names} from P${pid}.\n` +
        `This releases ${total_held} resource instance(s) back to the available pool.\n` +
        `P${pid} would need to be rolled back and restarted later.`;

      suggestions.push({
        action_type: 'preempt',
        description: `Preempt resources from P${pid}: ${resource_names}`,
        processes: new Set([pid]),
        resources: held_resources,
        explanation,
      });
    }
  }

  return suggestions;
}

/**
 * Generate all recovery suggestions for a deadlocked system
 */
export function generateRecoverySuggestions(
  state,
  deadlocked_pids
) {
  return {
    termination: findMinimalTerminationSet(state, deadlocked_pids),
    preemption: suggestPreemptionTargets(state, deadlocked_pids),
  };
}
