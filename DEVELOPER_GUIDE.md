# 🧑‍💻 Developer Guide - Deadlock Detective

## Technical Documentation for Contributors and Developers

This guide provides in-depth technical information about the Deadlock Detective codebase, architecture, algorithms, and development practices.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Data Models](#core-data-models)
5. [Detection Algorithms](#detection-algorithms)
6. [Recovery Algorithms](#recovery-algorithms)
7. [Component Architecture](#component-architecture)
8. [State Management](#state-management)
9. [Visualization System](#visualization-system)
10. [Performance](#performance)
11. [Contributing](#contributing)

---

## Architecture Overview

### High-Level Design

```
┌──────────────────────────────────────┐
│         React Application            │
│  (Single Page App - SPA Pattern)     │
└──────────────────────────────────────┘
           │
           ├─── Components (UI Layer)
           │    ├── Header
           │    ├── InputTab
           │    ├── VisualizationTab
           │    └── ResultsTab
           │
           ├─── Algorithms (Logic Layer)
           │    ├── matrix.js (Detection)
           │    ├── wfg.js (Detection)
           │    └── recovery.js (Strategy)
           │
           ├─── Types (Data Layer)
           │    └── models.js
           │
           └─── Utils (Helper Layer)
                └── samples.js
```

### Design Principles

1. **Separation of Concerns**: UI, logic, and data are separate
2. **Immutability**: State is never mutated directly
3. **Component-Based**: Reusable, modular UI components
4. **Algorithm Isolation**: Detection logic independent of UI
5. **Type Safety**: JSDoc comments for type hints

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI framework |
| **Vite** | 7.2.4 | Build tool & dev server |
| **JavaScript (ES6+)** | Latest | Programming language |
| **D3.js** | 7.9.0 | Graph visualization |
| **GSAP** | 3.13.0 | Animations |
| **CSS3** | Latest | Styling |

### Development Tools

- **ESLint** - Code linting
- **npm** - Package management
- **Git** - Version control

### Why These Technologies?

**React:**
- Component-based architecture
- Virtual DOM for performance
- Large ecosystem and community
- Easy to learn and use

**Vite:**
- Lightning-fast HMR (Hot Module Replacement)
- Optimized builds with Rollup
- Native ES modules support
- Better DX than webpack

**D3.js:**
- Powerful data-driven visualizations
- SVG manipulation
- Large library of examples
- Industry standard for graphs

**GSAP:**
- Smooth 60fps animations
- Better performance than CSS
- Timeline-based animations
- Cross-browser compatibility

---

## Project Structure

```
OS-CA-Automated-Deadlock-Detection-Tool/
│
├── public/                 # Static assets
│   └── vite.svg
│
├── src/                   # Source code
│   ├── algorithms/        # Core detection logic
│   │   ├── matrix.js      # Matrix-based detection (multi-instance)
│   │   ├── wfg.js         # Wait-For Graph (single-instance)
│   │   └── recovery.js    # Recovery strategy generation
│   │
│   ├── components/        # React UI components
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── InputTab.jsx
│   │   ├── InputTab.css
│   │   ├── VisualizationTab.jsx
│   │   ├── VisualizationTab.css
│   │   ├── ResultsTab.jsx
│   │   └── ResultsTab.css
│   │
│   ├── types/            # Data models and type definitions
│   │   └── models.js      # SystemState, Process, Resource
│   │
│   ├── utils/            # Utility functions
│   │   └── samples.js     # Sample datasets, JSON I/O
│   │
│   ├── App.jsx           # Main application component
│   ├── App.css           # Global app styles
│   ├── main.jsx          # Entry point
│   └── index.css         # Global CSS variables
│
├── test-data/            # Sample JSON files
│   ├── circular-deadlock.json
│   ├── safe-state-multi.json
│   ├── banking-deadlock.json
│   └── ...
│
├── index.html            # HTML entry point
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies
├── jsconfig.json         # JavaScript configuration
└── eslint.config.js      # Linting rules
```

---

## Core Data Models

### Process

Represents a single process in the system.

```javascript
/**
 * @typedef {Object} Process
 * @property {number} pid - Process ID (0, 1, 2, ...)
 * @property {string} name - Display name ("P0", "P1", ...)
 */
const process = {
  pid: 0,
  name: "P0"
};
```

### ResourceType

Represents a resource type with instance count.

```javascript
/**
 * @typedef {Object} ResourceType
 * @property {number} rid - Resource ID (0, 1, 2, ...)
 * @property {string} name - Display name ("R0", "R1", ...)
 * @property {number} instances - Total instances available
 */
const resourceType = {
  rid: 0,
  name: "R0",
  instances: 3
};
```

### SystemState

Complete system state for deadlock detection.

```javascript
/**
 * @typedef {Object} SystemState
 * @property {Process[]} processes - List of processes
 * @property {ResourceType[]} resource_types - List of resources
 * @property {number[]} available - Available[m] vector
 * @property {number[][]} allocation - Allocation[n][m] matrix
 * @property {number[][]} request - Request[n][m] matrix
 */
const systemState = {
  processes: [
    { pid: 0, name: "P0" },
    { pid: 1, name: "P1" }
  ],
  resource_types: [
    { rid: 0, name: "R0", instances: 3 },
    { rid: 1, name: "R1", instances: 2 }
  ],
  available: [1, 0],
  allocation: [
    [1, 1],  // P0 allocation
    [1, 1]   // P1 allocation
  ],
  request: [
    [0, 1],  // P0 request
    [1, 0]   // P1 request
  ]
};
```

### Invariants

**Matrix Dimensions:**
- `n` = number of processes
- `m` = number of resource types
- `available`: length `m`
- `allocation`: `n × m` matrix
- `request`: `n × m` matrix

**Resource Conservation:**

For each resource j:
```
available[j] + Σ(allocation[i][j]) = resource_types[j].instances
```

---

## Detection Algorithms

### Matrix-Based Detection

**File:** `src/algorithms/matrix.js`

**Function:** `detectDeadlockMatrix(state)`

**Algorithm:** Work/Finish vector approach (Banker's Algorithm variant)

```
Input: SystemState
Output: DetectionResult

1. Initialize:
   Work ← Available
   Finish[i] ← false for all i

2. Repeat until no progress:
   For each process i:
     If Finish[i] == false AND Request[i] ≤ Work:
       Finish[i] ← true
       Work ← Work + Allocation[i]

3. Determine deadlock:
   If any Finish[i] == false:
     Those processes are deadlocked
```

**Time Complexity:** O(n² × m)
- Outer loop: ≤ n iterations
- Inner loop: n processes
- Vector comparison: O(m)

**Space Complexity:** O(n + m)

**Key Functions:**

```javascript
// Check if request ≤ work (component-wise)
function vectorLessEqual(req, work) {
  return req.every((r, i) => r <= work[i]);
}

// Add two vectors
function vectorAdd(a, b) {
  return a.map((x, i) => x + b[i]);
}

// Main detection
export function detectDeadlockMatrix(state) {
  // ... implementation
}
```

**Example Trace:**

```
=== Matrix-Based Deadlock Detection ===

System: 3 processes, 3 resource types

Initial State:
Available = [0, 0, 0]
Work = [0, 0, 0]
Finish = [false, false, false]

--- Iteration 1 ---
Checking P0: Request[0] = [0, 1, 0]
  Request[0] > Work → Cannot finish

Checking P1: Request[1] = [0, 0, 1]
  Request[1] > Work → Cannot finish

Checking P2: Request[2] = [1, 0, 0]
  Request[2] > Work → Cannot finish

No progress made.

Result: Deadlocked processes = {P0, P1, P2}
```

### Wait-For Graph (WFG) Algorithm

**File:** `src/algorithms/wfg.js`

**Function:** `detectDeadlockWFG(state)`

**Algorithm:** Graph cycle detection using DFS

```
Input: SystemState
Output: DetectionResult

1. Build Wait-For Graph:
   For each process i and resource j:
     If Request[i][j] > 0:
       For each process k where Allocation[k][j] > 0:
         Add edge: i → k

2. Detect Cycles:
   Use DFS with recursion stack
   If back edge found → Cycle exists

3. Extract Deadlocked Processes:
   All processes in cycles
```

**Time Complexity:** O(n²)
- Graph building: O(m × n²)
- DFS: O(n + edges) = O(n²)

**Space Complexity:** O(n²) for adjacency list

**Key Functions:**

```javascript
// Build wait-for graph
function buildWaitForGraph(state) {
  const adjacency = new Map();
  const edges = [];
  
  // For each process requesting resources
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (state.request[i][j] > 0) {
        // Find who holds this resource
        for (let k = 0; k < n; k++) {
          if (k !== i && state.allocation[k][j] > 0) {
            adjacency.get(i).add(k);
            edges.push({ from_pid: i, to_pid: k, resource_id: j });
          }
        }
      }
    }
  }
  
  return { adjacency, edges };
}

// Detect cycles using DFS
function detectCycles(adjacency, n) {
  const cycles = [];
  const visited = new Set();
  const recStack = new Set();
  
  function dfs(node, path) {
    visited.add(node);
    recStack.add(node);
    path.push(node);
    
    for (const neighbor of adjacency.get(node)) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, path);
      } else if (recStack.has(neighbor)) {
        // Cycle found!
        const cycleStart = path.indexOf(neighbor);
        cycles.push(path.slice(cycleStart));
      }
    }
    
    recStack.delete(node);
    path.pop();
  }
  
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      dfs(i, []);
    }
  }
  
  return cycles;
}
```

**Important Note:**

WFG is **only correct** for single-instance resources. For multi-instance, use matrix-based detection.

---

## Recovery Algorithms

**File:** `src/algorithms/recovery.js`

### Process Termination

Finds minimal sets of processes to terminate.

```javascript
export function findMinimalTerminationSet(state, deadlocked_pids) {
  const suggestions = [];
  
  // Try progressively larger subsets
  for (let size = 1; size <= deadlocked_pids.size; size++) {
    const subsets = generateSubsets(deadlocked_pids, size);
    
    for (const subset of subsets) {
      const result = canSystemRecover(state, subset);
      
      if (result.can_recover) {
        suggestions.push({
          action: "terminate",
          processes: subset,
          explanation: result.trace
        });
      }
    }
    
    if (suggestions.length > 0) {
      return suggestions;  // Return minimal solutions
    }
  }
  
  return suggestions;
}
```

**Strategy:**
- Tries terminating 1, 2, 3, ... processes
- Returns first successful sets (minimal)
- Multiple solutions possible

### Resource Preemption

Suggests taking resources from processes.

```javascript
export function suggestPreemptionTargets(state, deadlocked_pids) {
  const suggestions = [];
  
  for (const pid of deadlocked_pids) {
    const held_resources = [];
    
    for (let j = 0; j < state.resource_types.length; j++) {
      if (state.allocation[pid][j] > 0) {
        held_resources.push(j);
      }
    }
    
    if (held_resources.length > 0) {
      suggestions.push({
        action: "preempt",
        processes: [pid],
        resources: held_resources,
        explanation: `Preempt ${held_resources.map(r => 'R' + r).join(', ')} from P${pid}`
      });
    }
  }
  
  return suggestions;
}
```

**Strategy:**
- For each deadlocked process
- List resources it holds
- Suggest preempting those resources
- Process must be rolled back

---

## Component Architecture

### App.jsx - Main Application

**State:**

```javascript
const [currentTab, setCurrentTab] = useState('input');
const [systemState, setSystemState] = useState(createEmptySystemState());
const [detectionResult, setDetectionResult] = useState(null);
```

**Key Functions:**

```javascript
const handleAnalyze = () => {
  // 1. Select algorithm based on resource instances
  const allSingleInstance = systemState.resource_types.every(r => r.instances === 1);
  const algorithm = allSingleInstance ? 'wfg' : 'matrix';
  
  // 2. Run detection
  const result = algorithm === 'wfg' 
    ? detectDeadlockWFG(systemState)
    : detectDeadlockMatrix(systemState);
  
  // 3. Generate recovery strategies
  const recovery = result.deadlocked 
    ? generateRecoverySuggestions(systemState, result.deadlocked_processes)
    : null;
  
  // 4. Update state
  setDetectionResult({ ...result, recovery, algorithm });
  setCurrentTab('results');
};
```

### InputTab.jsx - Data Entry

**Props:**

```javascript
{
  systemState: SystemState,
  setSystemState: (state) => void,
  onAnalyze: () => void
}
```

**Key Functions:**

```javascript
// Load sample dataset
const handleLoadSample = (sampleName) => {
  const sample = getSampleByName(sampleName);
  setSystemState(sample);
};

// Update allocation cell
const updateAllocation = (pid, rid, value) => {
  const newAllocation = [...systemState.allocation];
  newAllocation[pid][rid] = parseInt(value) || 0;
  
  setSystemState({
    ...systemState,
    allocation: newAllocation
  });
};

// Export to JSON
const handleExportJSON = () => {
  const json = JSON.stringify(systemState, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'system-state.json';
  a.click();
};
```

### VisualizationTab.jsx - Graph Display

**Props:**

```javascript
{
  systemState: SystemState,
  detectionResult: DetectionResult
}
```

**Rendering Logic:**

```javascript
useEffect(() => {
  const svg = d3.select(svgRef.current);
  svg.selectAll('*').remove();
  
  // 1. Create node data
  const nodes = [
    ...processes.map(p => ({
      id: `P${p.pid}`,
      type: 'process',
      deadlocked: detectionResult.deadlocked_processes.has(p.pid)
    })),
    ...resources.map(r => ({
      id: `R${r.rid}`,
      type: 'resource'
    }))
  ];
  
  // 2. Create edge data
  const edges = [];
  
  // Allocation edges (green)
  allocation.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val > 0) {
        edges.push({
          source: `R${j}`,
          target: `P${i}`,
          type: 'allocation'
        });
      }
    });
  });
  
  // Request edges (yellow)
  request.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val > 0) {
        edges.push({
          source: `P${i}`,
          target: `R${j}`,
          type: 'request'
        });
      }
    });
  });
  
  // 3. Draw graph with D3
  drawGraph(svg, nodes, edges);
}, [systemState, detectionResult]);
```

**D3.js Graph Drawing:**

```javascript
function drawGraph(svg, nodes, edges) {
  const width = 800;
  const height = 600;
  
  // Draw edges
  svg.selectAll('line')
    .data(edges)
    .enter()
    .append('line')
    .attr('stroke', d => d.type === 'allocation' ? '#10b981' : '#fbbf24')
    .attr('stroke-dasharray', d => d.type === 'request' ? '5,5' : '0')
    .attr('stroke-width', 2);
  
  // Draw nodes
  svg.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('r', 30)
    .attr('fill', d => {
      if (d.type === 'resource') return '#8b5cf6';
      return d.deadlocked ? '#ef4444' : '#3b82f6';
    });
  
  // Add labels
  svg.selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .text(d => d.id)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff');
}
```

### ResultsTab.jsx - Results Display

**Props:**

```javascript
{
  detectionResult: DetectionResult
}
```

**Sections:**

1. **Status Banner** - Safe/Deadlocked indicator
2. **Detection Trace** - Step-by-step logs
3. **Recovery Strategies** - Termination/preemption options

---

## State Management

### State Flow

```
User Input → systemState (App)
                ↓
           handleAnalyze()
                ↓
        Detection Algorithm
                ↓
         detectionResult (App)
                ↓
        ┌───────┴────────┐
        ↓                ↓
  VisualizationTab   ResultsTab
```

### Immutability Pattern

**Always:**

```javascript
// ✅ Good - Create new object
setSystemState({
  ...systemState,
  allocation: newAllocation
});
```

**Never:**

```javascript
// ❌ Bad - Mutate existing state
systemState.allocation = newAllocation;
setSystemState(systemState);
```

---

## Visualization System

### D3.js Integration

**SVG Creation:**

```javascript
const svg = d3.select(svgRef.current)
  .attr('width', width)
  .attr('height', height);
```

**Data Binding:**

```javascript
svg.selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('r', 30)
  .attr('cx', (d, i) => i * 100)
  .attr('cy', 300);
```

### GSAP Animations

**Page Load:**

```javascript
useEffect(() => {
  gsap.fromTo(
    mainRef.current,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  );
}, []);
```

**Tab Transitions:**

```javascript
useEffect(() => {
  gsap.fromTo(
    '.tab-content',
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.4 }
  );
}, [currentTab]);
```

---

## Performance

### Algorithm Performance

| Algorithm | Complexity | Max Practical Size |
|-----------|------------|-------------------|
| Matrix | O(n²×m) | n=100, m=50 |
| WFG | O(n²) | n=1000 |
| Recovery | O(2ⁿ) | n=10 |

### React Performance

**Optimization Techniques:**

```javascript
// Use React.memo for expensive components
const VisualizationTab = React.memo(({ systemState, detectionResult }) => {
  // ...
});

// Use useCallback for event handlers
const handleLoadSample = useCallback((name) => {
  // ...
}, []);

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

---

## Contributing

### Getting Started

```bash
# Fork repository
git clone https://github.com/YOUR_USERNAME/OS-CA-Automated-Deadlock-Detection-Tool.git
cd OS-CA-Automated-Deadlock-Detection-Tool

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run dev

# Commit and push
git add .
git commit -m "Add your feature"
git push origin feature/your-feature-name

# Open Pull Request on GitHub
```

### Code Style

**JavaScript:**
- Use ES6+ features
- Prefer `const` over `let`
- Use arrow functions
- Add JSDoc comments

**React:**
- Functional components only
- Use hooks (useState, useEffect, etc.)
- Props destructuring
- Meaningful component names

**CSS:**
- Use CSS variables
- Mobile-first approach
- BEM naming convention

### Commit Messages

```
feat: Add new recovery strategy visualization
fix: Correct WFG cycle detection logic
docs: Update algorithm guide
style: Improve button hover effects
refactor: Extract matrix utils
test: Add unit tests for recovery
perf: Optimize graph rendering
```

---

## Future Enhancements

### Potential Features

1. **Unit Testing**
   - Jest + React Testing Library
   - Algorithm correctness tests
   - Component snapshot tests

2. **TypeScript Migration**
   - Full type safety
   - Better IDE support
   - Catch errors at compile time

3. **Advanced Visualization**
   - Force-directed layout
   - Interactive node dragging
   - Zoom and pan
   - Export as SVG/PNG

4. **Educational Mode**
   - Step-by-step animation
   - Interactive tutorials
   - Quiz mode

5. **Collaboration**
   - Share via URL
   - Cloud save/load
   - Real-time collaboration

---

## API Reference

### Algorithm Functions

```javascript
// Matrix-based detection
detectDeadlockMatrix(state: SystemState): DetectionResult

// Wait-For Graph detection
detectDeadlockWFG(state: SystemState): DetectionResult

// Recovery strategies
generateRecoverySuggestions(
  state: SystemState,
  deadlocked: Set<number>
): RecoveryStrategy[]
```

### Utility Functions

```javascript
// Create empty system state
createEmptySystemState(): SystemState

// Get sample by name
getSampleByName(name: string): SystemState

// Validate system state
validateSystemState(state: SystemState): boolean
```

---

## Resources

### Documentation
- [React Docs](https://react.dev/)
- [D3.js Docs](https://d3js.org/)
- [GSAP Docs](https://greensock.com/docs/)
- [Vite Docs](https://vitejs.dev/)

### Textbooks
- *Operating System Concepts* (Silberschatz et al.)
- *Modern Operating Systems* (Tanenbaum)

---

**Happy Coding! 🚀**
