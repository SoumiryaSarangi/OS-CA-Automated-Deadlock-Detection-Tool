/**
 * Process Scheduling Simulator
 * 
 * Intended Purpose:
 * A standalone utility module for simulating different CPU scheduling algorithms
 * commonly used in operating systems. This complements the Deadlock Detective project
 * by providing additional OS process management utilities. Includes implementations
 * of FCFS, SJF, Round Robin, and Priority scheduling with performance metrics.
 * 
 * This module is independent and can be used for educational purposes to understand
 * how different scheduling algorithms affect process execution and system performance.
 */

/**
 * Calculate average waiting time for a set of processes
 * @param {Array<number>} waitingTimes - Array of waiting times for each process
 * @returns {number} Average waiting time
 */
export function calculateAverageWaitingTime(waitingTimes) {
  if (waitingTimes.length === 0) return 0;
  const sum = waitingTimes.reduce((acc, time) => acc + time, 0);
  return sum / waitingTimes.length;
}

/**
 * Calculate average turnaround time for a set of processes
 * @param {Array<number>} turnaroundTimes - Array of turnaround times
 * @returns {number} Average turnaround time
 */
export function calculateAverageTurnaroundTime(turnaroundTimes) {
  if (turnaroundTimes.length === 0) return 0;
  const sum = turnaroundTimes.reduce((acc, time) => acc + time, 0);
  return sum / turnaroundTimes.length;
}

/**
 * First Come First Serve (FCFS) Scheduling Algorithm
 * @param {Array<{id: string, arrivalTime: number, burstTime: number}>} processes
 * @returns {Object} Scheduling results with metrics
 */
export function scheduleFCFS(processes) {
  const n = processes.length;
  const results = [];
  let currentTime = 0;
  
  // Sort by arrival time
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  for (let i = 0; i < n; i++) {
    const process = sorted[i];
    const startTime = Math.max(currentTime, process.arrivalTime);
    const completionTime = startTime + process.burstTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    
    results.push({
      processId: process.id,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime
    });
    
    currentTime = completionTime;
  }
  
  const waitingTimes = results.map(r => r.waitingTime);
  const turnaroundTimes = results.map(r => r.turnaroundTime);
  
  return {
    algorithm: 'FCFS',
    schedule: results,
    avgWaitingTime: calculateAverageWaitingTime(waitingTimes),
    avgTurnaroundTime: calculateAverageTurnaroundTime(turnaroundTimes)
  };
}

/**
 * Shortest Job First (SJF) Non-Preemptive Scheduling
 * @param {Array<{id: string, arrivalTime: number, burstTime: number}>} processes
 * @returns {Object} Scheduling results with metrics
 */
export function scheduleSJF(processes) {
  const n = processes.length;
  const results = [];
  const remaining = [...processes];
  let currentTime = 0;
  let completed = 0;
  
  while (completed < n) {
    // Get processes that have arrived
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      // No process available, jump to next arrival
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }
    
    // Select process with shortest burst time
    const shortest = available.reduce((min, p) => 
      p.burstTime < min.burstTime ? p : min
    );
    
    const startTime = currentTime;
    const completionTime = startTime + shortest.burstTime;
    const turnaroundTime = completionTime - shortest.arrivalTime;
    const waitingTime = turnaroundTime - shortest.burstTime;
    
    results.push({
      processId: shortest.id,
      arrivalTime: shortest.arrivalTime,
      burstTime: shortest.burstTime,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime
    });
    
    currentTime = completionTime;
    remaining.splice(remaining.indexOf(shortest), 1);
    completed++;
  }
  
  const waitingTimes = results.map(r => r.waitingTime);
  const turnaroundTimes = results.map(r => r.turnaroundTime);
  
  return {
    algorithm: 'SJF',
    schedule: results,
    avgWaitingTime: calculateAverageWaitingTime(waitingTimes),
    avgTurnaroundTime: calculateAverageTurnaroundTime(turnaroundTimes)
  };
}

/**
 * Round Robin Scheduling Algorithm
 * @param {Array<{id: string, arrivalTime: number, burstTime: number}>} processes
 * @param {number} timeQuantum - Time quantum for round robin
 * @returns {Object} Scheduling results with metrics
 */
export function scheduleRoundRobin(processes, timeQuantum = 2) {
  const n = processes.length;
  const queue = [];
  const remainingTime = {};
  const startTimes = {};
  const completionTimes = {};
  
  // Initialize remaining times
  processes.forEach(p => {
    remainingTime[p.id] = p.burstTime;
  });
  
  // Sort by arrival time
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let index = 0;
  let completed = 0;
  
  // Add first process
  if (sorted.length > 0) {
    queue.push(sorted[0]);
    index = 1;
  }
  
  while (completed < n) {
    if (queue.length === 0) {
      // Jump to next arrival if queue is empty
      if (index < sorted.length) {
        currentTime = sorted[index].arrivalTime;
        queue.push(sorted[index]);
        index++;
      }
      continue;
    }
    
    const process = queue.shift();
    
    // Record start time
    if (!startTimes[process.id]) {
      startTimes[process.id] = currentTime;
    }
    
    // Execute for time quantum or remaining time
    const execTime = Math.min(timeQuantum, remainingTime[process.id]);
    currentTime += execTime;
    remainingTime[process.id] -= execTime;
    
    // Add newly arrived processes to queue
    while (index < sorted.length && sorted[index].arrivalTime <= currentTime) {
      queue.push(sorted[index]);
      index++;
    }
    
    // Check if process completed
    if (remainingTime[process.id] === 0) {
      completionTimes[process.id] = currentTime;
      completed++;
    } else {
      // Add back to queue
      queue.push(process);
    }
  }
  
  // Calculate metrics
  const results = processes.map(p => {
    const completionTime = completionTimes[p.id];
    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    
    return {
      processId: p.id,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      startTime: startTimes[p.id],
      completionTime,
      turnaroundTime,
      waitingTime
    };
  });
  
  const waitingTimes = results.map(r => r.waitingTime);
  const turnaroundTimes = results.map(r => r.turnaroundTime);
  
  return {
    algorithm: 'Round Robin',
    timeQuantum,
    schedule: results,
    avgWaitingTime: calculateAverageWaitingTime(waitingTimes),
    avgTurnaroundTime: calculateAverageTurnaroundTime(turnaroundTimes)
  };
}

/**
 * Priority Scheduling (Non-Preemptive)
 * @param {Array<{id: string, arrivalTime: number, burstTime: number, priority: number}>} processes
 * @returns {Object} Scheduling results with metrics
 * Note: Lower priority number = higher priority
 */
export function schedulePriority(processes) {
  const n = processes.length;
  const results = [];
  const remaining = [...processes];
  let currentTime = 0;
  let completed = 0;
  
  while (completed < n) {
    // Get processes that have arrived
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      // Jump to next arrival
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }
    
    // Select process with highest priority (lowest number)
    const highestPriority = available.reduce((min, p) => 
      p.priority < min.priority ? p : min
    );
    
    const startTime = currentTime;
    const completionTime = startTime + highestPriority.burstTime;
    const turnaroundTime = completionTime - highestPriority.arrivalTime;
    const waitingTime = turnaroundTime - highestPriority.burstTime;
    
    results.push({
      processId: highestPriority.id,
      arrivalTime: highestPriority.arrivalTime,
      burstTime: highestPriority.burstTime,
      priority: highestPriority.priority,
      startTime,
      completionTime,
      turnaroundTime,
      waitingTime
    });
    
    currentTime = completionTime;
    remaining.splice(remaining.indexOf(highestPriority), 1);
    completed++;
  }
  
  const waitingTimes = results.map(r => r.waitingTime);
  const turnaroundTimes = results.map(r => r.turnaroundTime);
  
  return {
    algorithm: 'Priority',
    schedule: results,
    avgWaitingTime: calculateAverageWaitingTime(waitingTimes),
    avgTurnaroundTime: calculateAverageTurnaroundTime(turnaroundTimes)
  };
}

/**
 * Compare multiple scheduling algorithms for the same process set
 * @param {Array<{id: string, arrivalTime: number, burstTime: number, priority?: number}>} processes
 * @param {number} timeQuantum - Time quantum for round robin
 * @returns {Object} Comparison results for all algorithms
 */
export function compareSchedulingAlgorithms(processes, timeQuantum = 2) {
  const fcfs = scheduleFCFS(processes);
  const sjf = scheduleSJF(processes);
  const rr = scheduleRoundRobin(processes, timeQuantum);
  
  const results = {
    fcfs,
    sjf,
    roundRobin: rr
  };
  
  // Add priority if priority values exist
  if (processes.every(p => p.priority !== undefined)) {
    results.priority = schedulePriority(processes);
  }
  
  // Find best algorithm based on average waiting time
  const algorithms = Object.keys(results);
  const bestAlgorithm = algorithms.reduce((best, current) => {
    return results[current].avgWaitingTime < results[best].avgWaitingTime ? current : best;
  });
  
  return {
    results,
    bestAlgorithm,
    recommendation: `${results[bestAlgorithm].algorithm} provides the lowest average waiting time`
  };
}
