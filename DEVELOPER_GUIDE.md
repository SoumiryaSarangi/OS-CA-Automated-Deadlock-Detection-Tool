# 🧑‍💻 Developer Guide - Deadlock Detective

## Technical Documentation for Contributors and Developers

This guide provides in-depth technical information about the Deadlock Detective codebase, architecture, and algorithms.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Data Models](#core-data-models)
3. [Detection Algorithms](#detection-algorithms)
4. [Recovery Strategies](#recovery-strategies)
5. [Component Structure](#component-structure)
6. [State Management](#state-management)
7. [Animation System](#animation-system)
8. [Testing](#testing)
9. [Contributing](#contributing)

---

## Architecture Overview

### Technology Stack

**Frontend Framework:**
- React 18 with functional components and hooks
- TypeScript 5 for type safety
- Vite for fast development and builds

**Visualization:**
- D3.js for SVG-based graph rendering
- GSAP for smooth animations and transitions

**Styling:**
- Custom CSS with CSS variables
- Dark theme with minimal design
- Fully responsive layout

### Project Structure

```
src/
├── algorithms/       # Core detection and recovery logic
│   ├── wfg.ts       # Wait-For Graph algorithm
│   ├── matrix.ts    # Matrix-based detection
│   └── recovery.ts  # Recovery strategy generation
│
├── components/      # React UI components
│   ├── Header.tsx   # App header
│   ├── InputTab.tsx # Data entry interface
│   ├── VisualizationTab.tsx  # D3 graph visualization
│   └── ResultsTab.tsx        # Results display
│
├── types/          # TypeScript type definitions
│   └── models.ts   # SystemState, Process, Resource types
│
├── utils/          # Utility functions
│   └── samples.ts  # Sample data and JSON I/O
│
├── App.tsx         # Main application component
└── main.tsx        # Entry point
```

---

## Core Data Models

### Process

Represents a process in the system.

```typescript
interface Process {
  pid: number;      // Process ID (0, 1, 2, ...)
  name: string;     // Display name ("P0", "P1", ...)
}
```

**Validation:**
- `pid` must be non-negative
- `name` cannot be empty

### ResourceType

Represents a type of resource with instance count.

```typescript
interface ResourceType {
  rid: number;         // Resource ID (0, 1, 2, ...)
  name: string;        // Display name ("R0", "R1", ...)
  instances: number;   // Total instances available
}
```

**Validation:**
- `rid` must be non-negative
- `instances` must be non-negative
- `name` cannot be empty

### SystemState

Complete system state for deadlock detection.

```typescript
interface SystemState {
  processes: Process[];
  resource_types: ResourceType[];
  available: number[];           // Available[m]
  allocation: number[][];        // Allocation[n][m]
  request: number[][];           // Request[n][m]
}
```

**Matrix Dimensions:**
- `n` = number of processes
- `m` = number of resource types
- `available`: length `m`
- `allocation`: `n × m` matrix
- `request`: `n × m` matrix

**Invariants:**
1. All matrices must have correct dimensions
2. All values must be non-negative
3. Resource conservation: For each resource j,
   ```
   Available[j] + Σ(Allocation[i][j]) = ResourceTypes[j].instances
   ```

---

## Detection Algorithms

### Matrix-Based Detection

**File:** `src/algorithms/matrix.ts`

**Function:** `detectDeadlockMatrix(state: SystemState): MatrixDetectionResult`

**Algorithm (Banker's Algorithm Variant):**

```
Input: SystemState with n processes, m resources
Output: MatrixDetectionResult

1. Initialize:
   Work ← Available
   Finish[i] ← False for all i ∈ [0, n-1]
   execution_order ← []

2. Repeat until no progress:
   Found ← False
   For i = 0 to n-1:
     If Finish[i] == False AND Request[i] ≤ Work:
       Finish[i] ← True
       Work ← Work + Allocation[i]
       execution_order.append(i)
       Found ← True
   
   If NOT Found:
     Break

3. Determine deadlock:
   deadlocked_processes ← {i | Finish[i] == False}
   
4. Return:
   - deadlocked: |deadlocked_processes| > 0
   - deadlocked_processes
   - finish vector
   - execution_order
   - trace (step-by-step log)
```

**Time Complexity:** O(n² × m)
- Outer loop: at most n iterations
- Inner loop: n processes
- Vector comparison: O(m)

**Space Complexity:** O(n + m)

**Key Functions:**

```typescript
// Check if request vector ≤ work vector
function vectorLessEqual(req: number[], work: number[]): boolean

// Add two vectors component-wise
function vectorAdd(a: number[], b: number[]): number[]

// Main detection function
function detectDeadlockMatrix(state: SystemState): MatrixDetectionResult
```

### Wait-For Graph (WFG) Detection

**File:** `src/algorithms/wfg.ts`

**Function:** `detectDeadlockWFG(state: SystemState): WFGDetectionResult`

**Algorithm:**

```
Input: SystemState with n processes, m resources
Output: WFGDetectionResult

1. Build Wait-For Graph:
   adjacency ← empty graph with n nodes
   edges ← []
   
   For i = 0 to n-1:
     For j = 0 to m-1:
       If Request[i][j] > 0:
         For k = 0 to n-1 (k ≠ i):
           If Allocation[k][j] > 0:
             adjacency[i].add(k)
             edges.append((i, k, j))

2. Detect Cycles using DFS:
   cycles ← []
   visited ← empty set
   recStack ← empty set
   
   For each node i:
     If i not in visited:
       DFS(i, visited, recStack, cycles)

3. Extract deadlocked processes:
   deadlocked_processes ← union of all processes in cycles

4. Return:
   - deadlocked: |cycles| > 0
   - deadlocked_processes
   - cycles
   - wait_for_edges
   - trace
```

**Time Complexity:** O(n² + m × n²)
- Graph building: O(m × n²)
- Cycle detection: O(n + edges) = O(n²)

**Space Complexity:** O(n²) for adjacency list

**Key Functions:**

```typescript
// Build wait-for graph from system state
function buildWaitForGraph(state: SystemState): {
  adjacency: Map<number, Set<number>>;
  edges: WaitForEdge[];
}

// Detect cycles using DFS
function detectCycles(
  adjacency: Map<number, Set<number>>,
  n: number
): CycleInfo[]
```

**Important Note:**
WFG is only correct for **single-instance** resources. For multi-instance resources, use matrix-based detection.

---

## Recovery Strategies

**File:** `src/algorithms/recovery.ts`

### Process Termination

**Function:** `findMinimalTerminationSet(state, deadlocked_pids)`

**Algorithm:**

```
Input: SystemState, deadlocked process IDs
Output: List of RecoverySuggestions

1. For size = 1 to |deadlocked_pids|:
   For each subset S of deadlocked_pids with |S| = size:
     terminated ← S
     can_recover ← canSystemRecover(state, terminated)
     
     If can_recover:
       suggestions.append(
         action: "terminate",
         processes: terminated,
         explanation: recovery trace
       )
   
   If suggestions not empty:
     Return suggestions  # Return minimal solutions

2. Return suggestions
```

**Strategy:**
- Try terminating progressively larger sets
- Return the smallest set that breaks the deadlock
- Multiple solutions of the same size may exist

### Resource Preemption

**Function:** `suggestPreemptionTargets(state, deadlocked_pids)`

**Algorithm:**

```
Input: SystemState, deadlocked process IDs
Output: List of RecoverySuggestions

For each pid in deadlocked_pids:
  held_resources ← {j | Allocation[pid][j] > 0}
  
  If held_resources not empty:
    suggestions.append(
      action: "preempt",
      processes: {pid},
      resources: held_resources,
      explanation: details
    )

Return suggestions
```

**Strategy:**
- Suggest preempting resources from each deadlocked process
- Process would need to be rolled back and restarted
- Simpler than termination but requires rollback mechanism

---

## Component Structure

### App.tsx - Main Application

**State:**
```typescript
const [currentTab, setCurrentTab] = useState<Tab>('input');
const [systemState, setSystemState] = useState<SystemState>(createEmptySystemState());
const [detectionResult, setDetectionResult] = useState<any>(null);
const [algorithm, setAlgorithm] = useState<'wfg' | 'matrix'>('matrix');
```

**Key Functions:**
- `handleAnalyze()` - Runs detection and switches to results tab
- `handleTabChange(tab)` - Changes active tab

### InputTab.tsx - Data Entry

**Props:**
```typescript
interface InputTabProps {
  systemState: SystemState;
  setSystemState: (state: SystemState) => void;
  algorithm: 'wfg' | 'matrix';
  setAlgorithm: (algo: 'wfg' | 'matrix') => void;
  onAnalyze: () => void;
}
```

**Key Functions:**
- `handleLoadSample(name)` - Loads pre-configured sample
- `handleExportJSON()` - Exports state to JSON file
- `handleImportJSON()` - Imports state from JSON file
- `updateAllocation(pid, rid, value)` - Updates allocation matrix
- `updateRequest(pid, rid, value)` - Updates request matrix
- `updateResourceInstances(rid, value)` - Updates resource instances

### VisualizationTab.tsx - Graph Visualization

**Props:**
```typescript
interface VisualizationTabProps {
  systemState: SystemState;
  detectionResult: any;
}
```

**Rendering Logic:**
1. Create node data (processes and resources)
2. Create edge data (allocations and requests)
3. Position nodes in 2D space
4. Draw edges with D3.js
5. Draw nodes with D3.js
6. Animate with GSAP

**Node Positioning:**
- Processes: Top row, evenly spaced
- Resources: Bottom row, evenly spaced

**Color Coding:**
- Safe process: Blue (#3b82f6)
- Deadlocked process: Red (#ef4444)
- Resource: Purple (#8b5cf6)

**Edge Types:**
- Allocation: Green solid line with arrowhead
- Request: Yellow dashed line with arrowhead

### ResultsTab.tsx - Results Display

**Props:**
```typescript
interface ResultsTabProps {
  detectionResult: any;
}
```

**Sections:**
1. Status Banner - Shows safe/deadlocked status
2. Detection Trace - Step-by-step algorithm execution
3. Recovery Strategies - Termination and preemption suggestions

---

## State Management

### State Flow

```
User Input (InputTab)
      ↓
System State (App)
      ↓
Detection Algorithm
      ↓
Detection Result (App)
      ↓
├─→ VisualizationTab (renders graph)
└─→ ResultsTab (shows analysis)
```

### State Updates

**Immutability:**
All state updates use immutable patterns:

```typescript
// Good
setSystemState({
  ...systemState,
  allocation: newAllocation,
});

// Bad
systemState.allocation = newAllocation;
setSystemState(systemState);
```

---

## Animation System

### GSAP Integration

**Page Load Animation:**
```typescript
useEffect(() => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  );
}, []);
```

**Tab Transition:**
```typescript
useEffect(() => {
  gsap.fromTo(
    '.tab-content',
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
  );
}, [currentTab]);
```

**Graph Node Animation:**
```typescript
gsap.to(nodes, {
  attr: { opacity: 1 },
  duration: 0.5,
  stagger: 0.05,
  ease: 'back.out(1.7)',
});
```

---

## Testing

### Manual Testing Checklist

**Input Tab:**
- [ ] Load each sample dataset
- [ ] Edit allocation values
- [ ] Edit request values
- [ ] Edit resource instances
- [ ] Switch algorithms
- [ ] Export to JSON
- [ ] Import from JSON

**Visualization Tab:**
- [ ] Graph renders correctly
- [ ] Deadlocked processes are red
- [ ] Safe processes are blue
- [ ] Edges show correct relationships
- [ ] Animations are smooth

**Results Tab:**
- [ ] Status banner shows correct state
- [ ] Trace is complete and readable
- [ ] Recovery strategies make sense
- [ ] All processes accounted for

### Test Scenarios

1. **Circular Deadlock**: Should detect deadlock, show cycle
2. **Safe State**: Should show no deadlock, safe sequence
3. **Partial Deadlock**: Should show some deadlocked, some safe
4. **Empty Available**: Should detect deadlock if requests exist
5. **No Requests**: Should show safe state

---

## Contributing

### Code Style

- Use TypeScript strict mode
- Follow React hooks best practices
- Use functional components only
- Prefer const over let
- Use meaningful variable names

### Commit Messages

```
feat: Add new recovery strategy visualization
fix: Correct WFG cycle detection logic
docs: Update algorithm guide
style: Improve button hover effects
refactor: Extract matrix utils to separate file
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit PR with clear description

---

## Performance Considerations

### Algorithm Performance

- Matrix detection: O(n² × m) - acceptable for n, m < 100
- WFG detection: O(n²) - very fast
- Recovery: Exponential worst case, but practical for small n

### React Performance

- Use `React.memo()` for expensive components
- Avoid inline function definitions in render
- Use `useCallback()` for event handlers
- Use `useMemo()` for expensive calculations

### D3 Performance

- Limit number of nodes to < 50 for smooth animations
- Use `requestAnimationFrame` for complex updates
- Debounce resize events

---

## Future Enhancements

### Potential Features

1. **Custom Process/Resource Creation**
   - Add/remove processes dynamically
   - Add/remove resources dynamically

2. **Animation Controls**
   - Play/pause detection animation
   - Step through algorithm manually

3. **Export Options**
   - Export graph as SVG/PNG
   - Export results as PDF

4. **Advanced Visualization**
   - 3D graph rendering
   - Force-directed layout
   - Interactive node dragging

5. **Educational Mode**
   - Quiz questions
   - Guided tutorials
   - Algorithm comparison side-by-side

---

## References

### Algorithm Sources

- **Silberschatz, Galvin, Gagne**: Operating System Concepts (10th Edition)
- **Tanenbaum**: Modern Operating Systems
- **Banker's Algorithm**: Dijkstra, 1965

### Libraries

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [D3.js Documentation](https://d3js.org/)
- [GSAP Documentation](https://greensock.com/docs/)

---

**Happy Coding! 🚀**
