# 🖥️ Project Guide - Understanding the Code

## 📁 Project Structure (What Each File Does)

```
Deadlock Detective React/
│
├── 📄 index.html                → HTML entry point
├── 📄 package.json              → Dependencies and scripts
├── 📄 vite.config.js            → Build configuration
│
├── 📁 src/                      → Source code folder
│   ├── 📄 main.jsx              → Main file - Entry point
│   ├── 📄 App.jsx               → Main app component
│   ├── 📄 App.css               → App styling
│   ├── 📄 index.css             → Global styles
│   │
│   ├── 📁 algorithms/           → Detection algorithms folder
│   │   ├── wfg.js               → Wait-For Graph detection
│   │   ├── matrix.js            → Matrix detection (Banker's algorithm)
│   │   └── recovery.js          → Generate recovery suggestions
│   │
│   ├── 📁 components/           → React UI components
│   │   ├── Header.jsx           → App header
│   │   ├── InputTab.jsx         → Tab for entering data
│   │   ├── CreateProblemCard.jsx → Create custom problems
│   │   ├── VisualizationTab.jsx → Tab for viewing D3.js graph
│   │   └── ResultsTab.jsx       → Tab for viewing results
│   │
│   ├── 📁 types/                → Data models
│   │   └── models.js            → SystemState, Process, Resource types
│   │
│   └── 📁 utils/                → Utilities
│       └── samples.js           → Sample datasets & JSON I/O
│
├── 📁 test-data/                → Sample JSON files
│   ├── circular-deadlock.json
│   ├── safe-state-multi.json
│   └── ...
│
├── 📁 public/                   → Static assets
│
└── 📁 Documentation/
    ├── 1_UNDERSTANDING_DEADLOCKS.md
    ├── 2_PROBLEM_STATEMENT.md
    ├── 3_DETECTION_ALGORITHMS.md
    ├── 4_PROJECT_GUIDE.md (this file)
    └── 5_USER_GUIDE.md
```

---

## 🎯 How the Project Works (Big Picture)

```
┌─────────────┐
│    USER     │
│  (Browser)  │
└──────┬──────┘
       │ Enters data in web interface
       ↓
┌─────────────────────────────────┐
│   INPUT TAB (InputTab.jsx)      │
│   • Edit matrices                │
│   • Load samples                 │
│   • Create custom problems       │
└─────────┬───────────────────────┘
          │ Sends data to...
          ↓
┌──────────────────────────────────┐
│  DETECTION ALGORITHMS            │
│  • algorithms/wfg.js             │
│  • algorithms/matrix.js          │
│  (Does the math calculations!)   │
└─────────┬────────────────────────┘
          │ Returns results...
          ↓
┌──────────────────────────────────┐
│  RESULTS TAB (ResultsTab.jsx)   │
│  • Shows: Deadlock? YES/NO       │
│  • Shows: Step-by-step trace     │
│  • Shows: Recovery strategies    │
└──────────────────────────────────┘
          │ Also creates...
          ↓
┌──────────────────────────────────┐
│  VISUALIZATION TAB               │
│  (VisualizationTab.jsx)          │
│  • D3.js interactive graph       │
│  • Red = Deadlocked              │
│  • Blue = Safe                   │
└──────────────────────────────────┘
```

---

## 📄 File Explanations (For Beginners)

### 1. **main.jsx** - The Starting Point

**What it does:** Starts the React application

**Simple explanation:**

```javascript
// This file is like the "ON" button
// It renders the App component into the DOM
```

**Key code:**

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**When to look at it:** When you want to understand how the app starts

---

### 2. **types/models.js** - Data Structures

**What it does:** Defines how we store information about processes and resources

**Think of it as:** The blueprint/template for our data

**Key functions:**

#### Function 1: validateProcess

```javascript
export function validateProcess(process) {
  if (process.pid < 0) {
    throw new Error(`Process ID must be non-negative`);
  }
  if (!process.name || process.name.trim() === '') {
    throw new Error('Process name cannot be empty');
  }
}
```

#### Function 2: validateSystemState

```javascript
export function validateSystemState(state) {
  // Validates:
  // - All processes have valid IDs and names
  // - All resources have valid instances
  // - Matrix dimensions match
  // - Resource conservation law holds
}
```

#### Function 3: createEmptySystemState

```javascript
export function createEmptySystemState(numProcesses = 3, numResources = 3) {
  return {
    processes: [{pid: 0, name: 'P0'}, ...],
    resource_types: [{rid: 0, name: 'R0', instances: 1}, ...],
    available: [0, 0, 0],
    allocation: [[0,0,0], [0,0,0], ...],
    request: [[0,0,0], [0,0,0], ...]
  };
}
```

**This is the MAIN data structure** - holds everything!

---

### 3. **algorithms/wfg.js** - Wait-For Graph Algorithm

**What it does:** Checks for deadlock using cycle detection

**Main function:**

```javascript
export function detectDeadlockWFG(systemState)
```

**How it works (simplified code flow):**

```javascript
Step 1: Build the wait-for graph
  - For each process that has a request
  - Find which process holds that resource
  - Create edge: requesting_process → holding_process

Step 2: Detect cycles using DFS
  - Start from each process
  - Follow edges and track path
  - If we revisit a process in current path → CYCLE!

Step 3: Return result
  return {
    deadlocked: true/false,
    deadlocked_processes: [0, 1, 2],
    cycles: [[0, 1, 2, 0]],
    trace: ["Step-by-step explanation..."]
  }
```

**Example output:**

```javascript
{
  deadlocked: true,
  deadlocked_processes: [0, 1, 2],
  cycles: [[0, 1, 2, 0]],  // P0→P1→P2→P0
  wait_for_graph: { edges: [...] },
  trace: ["Building wait-for graph...", "Cycle detected: P0 → P1 → P2 → P0"]
}
```

---

### 4. **algorithms/matrix.js** - Matrix Detection Algorithm

**What it does:** Uses Work-Finish algorithm for multi-instance resources

**Main function:**

```javascript
export function detectDeadlockMatrix(systemState)
```

**How it works (simplified code flow):**

```javascript
Step 1: Initialize
  work = [...available]         // Copy available resources
  finish = [false, false, ...]  // Nobody finished yet

Step 2: Find processes that can finish
  while (true) {
    found = false
    for each process i:
      if (!finish[i]) {
        if (canSatisfy(request[i], work)) {
          finish[i] = true
          work = addVectors(work, allocation[i])
          found = true
        }
      }
    if (!found) break  // No more can finish
  }

Step 3: Check results
  deadlocked_processes = []
  for i in range(n):
    if (!finish[i]):
      deadlocked_processes.push(i)

  return result
```

**Key helper functions:**

```javascript
function canSatisfy(need, work) {
  // Check if need[i] <= work[i] for all i
  return need.every((val, i) => val <= work[i]);
}

function addVectors(a, b) {
  // Add two vectors element-wise
  return a.map((val, i) => val + b[i]);
}
```

---

### 5. **utils/samples.js** - Data Loading & Persistence

**What it does:** Provides sample datasets and save/load functions

**Why it's useful:** You don't have to type data manually!

**Sample datasets included:**

```javascript
SAMPLES = {
  'Circular Deadlock (Single-Instance)': {...},
  'Two Process Deadlock (Single-Instance)': {...},
  'Safe State': {...},
  'Banker\'s Algorithm (Safe)': {...},
  'Multi-Instance Deadlock': {...},
  // ... and more!
}
```

**How samples work:**

```javascript
// Load a sample
const sample = SAMPLES['Circular Deadlock (Single-Instance)'];
setSystemState(sample);

// Export to JSON
const json = exportToJSON(systemState);

// Import from JSON
const state = importFromJSON(jsonString);

// Local storage persistence
saveStateToLocalStorage(systemState);
const saved = loadStateFromLocalStorage();
```

---

### 6. **algorithms/recovery.js** - Recovery Strategies

**What it does:** Suggests ways to fix deadlocks

**Main function:**

```javascript
export function generateRecoverySuggestions(systemState, deadlockedProcesses)
```

**Returns:**

```javascript
{
  termination: [
    {
      processes: [0, 1],
      cost: 2,
      explanation: "Terminate P0 and P1..."
    }
  ],
  preemption: [
    {
      resources: [{rid: 0, from: 1, to: 0}],
      explanation: "Preempt R0 from P1..."
    }
  ]
}
```

---

## 🎨 React Components Explained

### 1. **App.jsx** - Main Application

**Responsibilities:**
- Manages global state (systemState, detectionResult)
- Handles tab switching
- Coordinates between components

**Key state:**

```javascript
const [currentTab, setCurrentTab] = useState('input');
const [systemState, setSystemState] = useState(createEmptySystemState());
const [detectionResult, setDetectionResult] = useState(null);
```

**Main function:**

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
  
  // 4. Store results and switch to results tab
  setDetectionResult({ ...result, recovery, algorithm });
  setCurrentTab('results');
};
```

---

### 2. **InputTab.jsx** - Data Entry Interface

**Responsibilities:**
- Load sample datasets
- Create custom problems
- Edit allocation/request matrices
- Import/export JSON
- Save/load from localStorage

**Key features:**

```javascript
// Sample loading
const handleLoadSample = (sampleName) => {
  const sample = SAMPLES[sampleName];
  setSystemState(sample);
};

// Matrix editing
const updateAllocation = (pid, rid, value) => {
  // Update allocation matrix
  // Recalculate available resources
  // Maintain resource conservation
};

// Add/remove processes and resources
const addProcess = () => {
  // Append new process
  // Extend allocation/request matrices
};
```

---

### 3. **CreateProblemCard.jsx** - Custom Problem Creator

**Responsibilities:**
- Define number of processes/resources
- Set process and resource names
- Set resource instances
- Create initial system state

**How it works:**

```javascript
const handleCreate = () => {
  // Build processes array
  const processes = Array.from({length: numProcesses}, (_, i) => ({
    pid: i,
    name: processNames[i] || `P${i}`
  }));
  
  // Build resource_types array
  const resource_types = Array.from({length: numResources}, (_, j) => ({
    rid: j,
    name: resourceNames[j] || `R${j}`,
    instances: parseInt(instances[j]) || 0
  }));
  
  // Initialize zero matrices
  const allocation = Array(numProcesses).fill(null).map(() => 
    Array(numResources).fill(0)
  );
  const request = Array(numProcesses).fill(null).map(() => 
    Array(numResources).fill(0)
  );
  
  // Available = total instances (nothing allocated yet)
  const available = resource_types.map(r => r.instances);
  
  // Validate and set state
  validateSystemState(state);
  setSystemState(state);
};
```

---

### 4. **VisualizationTab.jsx** - D3.js Graph Visualization

**Responsibilities:**
- Render interactive graph with D3.js
- Show processes, resources, and dependencies
- Color-code deadlocked vs safe processes
- Animate edges for allocations and requests

**How it works:**

```javascript
useEffect(() => {
  // 1. Build nodes (processes + resources)
  const nodes = [
    ...systemState.processes.map(p => ({
      id: `P${p.pid}`,
      type: 'process',
      deadlocked: detectionResult.deadlocked_processes.includes(p.pid)
    })),
    ...systemState.resource_types.map(r => ({
      id: `R${r.rid}`,
      type: 'resource'
    }))
  ];
  
  // 2. Build edges (allocations + requests)
  const links = [
    ...getAllocationLinks(),  // Resource → Process (green solid)
    ...getRequestLinks()      // Process → Resource (yellow dashed)
  ];
  
  // 3. Create D3 force simulation
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width/2, height/2));
  
  // 4. Render with SVG
  const svg = d3.select(svgRef.current);
  svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', d => d.deadlocked ? 'deadlocked' : 'safe')
    .attr('r', 20);
    
  // 5. Add animations with GSAP
  gsap.from('.node', {scale: 0, duration: 0.5, stagger: 0.1});
}, [systemState, detectionResult]);
```

---

### 5. **ResultsTab.jsx** - Results Display

**Responsibilities:**
- Show deadlock status (yes/no)
- Display algorithm trace
- Show safe sequence (if exists)
- Present recovery strategies

**Layout:**

```javascript
return (
  <div className="results-tab">
    {/* Status Banner */}
    <div className={`status-banner ${deadlocked ? 'deadlock' : 'safe'}`}>
      {deadlocked ? '🚨 DEADLOCK DETECTED' : '✅ NO DEADLOCK'}
    </div>
    
    {/* Algorithm Trace */}
    <div className="trace-section">
      <h3>Detection Trace</h3>
      {detectionResult.trace.map(step => <p>{step}</p>)}
    </div>
    
    {/* Recovery Strategies */}
    {deadlocked && (
      <div className="recovery-section">
        <h3>Recovery Strategies</h3>
        {/* Termination options */}
        {/* Preemption options */}
      </div>
    )}
  </div>
);
```

---

## 🔧 Development Workflow

### Starting Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

### Making Changes

1. **Edit source files** in `src/`
2. **Save** - Vite hot-reloads automatically
3. **Check browser** - See changes instantly

### Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Testing the Application

### Manual Testing Checklist

**Input Tab:**
- [ ] Load each sample dataset
- [ ] Create custom problem
- [ ] Edit allocation matrix
- [ ] Edit request matrix
- [ ] Add/remove processes
- [ ] Add/remove resources
- [ ] Export to JSON
- [ ] Import from JSON
- [ ] Save to localStorage
- [ ] Load from localStorage

**Detection:**
- [ ] Analyze single-instance resources (WFG)
- [ ] Analyze multi-instance resources (Matrix)
- [ ] Verify correct algorithm is selected

**Visualization:**
- [ ] Graph renders correctly
- [ ] Deadlocked processes are red
- [ ] Safe processes are blue
- [ ] Resources are purple
- [ ] Edges show correctly
- [ ] Animations work smoothly

**Results:**
- [ ] Status banner shows correct result
- [ ] Trace explains algorithm steps
- [ ] Recovery strategies display
- [ ] Safe sequence shown (if no deadlock)

---

## 🎓 Key Concepts for Developers

### State Management

```javascript
// State flows down from App.jsx
App.jsx (owns systemState, detectionResult)
  ↓
InputTab.jsx (can modify systemState)
  ↓
CreateProblemCard.jsx (can create new systemState)

// Results flow back up via callbacks
CreateProblemCard → InputTab → App (via onCreated)
InputTab → App (via onAnalyze)
```

### Data Flow

```
User Action
  ↓
Update systemState
  ↓
Click "Analyze"
  ↓
Run algorithm (wfg.js or matrix.js)
  ↓
Generate recovery (recovery.js)
  ↓
Update detectionResult
  ↓
Switch to Results/Visualization tab
```

### Algorithm Selection Logic

```javascript
const allSingleInstance = systemState.resource_types.every(r => r.instances === 1);

if (allSingleInstance) {
  // Use WFG - faster, simpler
  result = detectDeadlockWFG(systemState);
} else {
  // Use Matrix - handles quantities
  result = detectDeadlockMatrix(systemState);
}
```

---

## 🐛 Common Issues & Solutions

### Issue: Vite dev server won't start

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Changes not reflecting in browser

**Solution:**
- Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- Clear browser cache
- Restart dev server

### Issue: D3.js graph not rendering

**Solution:**
- Check console for errors
- Ensure data is properly formatted
- Verify SVG ref is attached correctly
- Run analysis before viewing visualization tab

### Issue: Matrix validation error

**Solution:**
- Check resource conservation: `Available + Sum(Allocations) = Total`
- Ensure no negative values
- Verify matrix dimensions match process/resource counts

---

## 📚 Learning Resources

### React
- [Official React Docs](https://react.dev/)
- [React Hooks Guide](https://react.dev/reference/react)

### D3.js
- [Official D3.js Docs](https://d3js.org/)
- [Force Simulation](https://github.com/d3/d3-force)

### Vite
- [Vite Documentation](https://vitejs.dev/)

### Algorithms
- Operating Systems Concepts (Silberschatz)
- Banker's Algorithm (Dijkstra, 1965)

---

## 🚀 Next Steps

1. **Read the algorithms**: Understand `wfg.js` and `matrix.js`
2. **Explore components**: See how React components work together
3. **Try modifications**: Add new features or improve UI
4. **Run tests**: Use sample datasets to verify behavior

---

**Key Takeaway:** This is a React single-page application that runs entirely in the browser, using JavaScript algorithms to detect deadlocks and D3.js to visualize them! 🎯
