# 📖 User Guide - Deadlock Detective

## Complete Guide to Using the Deadlock Detection Tool

Welcome to Deadlock Detective! This guide will teach you everything you need to know to effectively use the tool and understand deadlock detection in operating systems.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Understanding Deadlocks](#understanding-deadlocks)
3. [Getting Started](#getting-started)
4. [Using the Input Tab](#using-the-input-tab)
5. [Understanding the Visualization](#understanding-the-visualization)
6. [Interpreting Results](#interpreting-results)
7. [Sample Scenarios Explained](#sample-scenarios-explained)
8. [Tips & Best Practices](#tips--best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is Deadlock Detective?

Deadlock Detective is a web-based tool that helps you:
- **Detect deadlocks** in simulated operating system processes
- **Visualize** process-resource relationships with interactive graphs
- **Understand** how detection algorithms work step-by-step
- **Learn** recovery strategies when deadlocks occur

### Who Should Use This Tool?

- 🎓 **Students** learning Operating Systems concepts
- 👨‍🏫 **Educators** teaching process synchronization
- 💻 **Developers** studying concurrent programming
- 📚 **Self-learners** interested in OS internals

---

## Understanding Deadlocks

### What is a Deadlock?

A **deadlock** occurs when processes are waiting for each other in a circular pattern, preventing any from continuing.

**Real-World Analogy:**

Imagine four cars at a 4-way intersection, each waiting for the car on their right to go first. Nobody can move — that's a deadlock!

### The Four Necessary Conditions

Deadlock can **only** occur if ALL four conditions exist simultaneously:

1. **Mutual Exclusion**  
   Resources cannot be shared (only one process can use at a time)
   
2. **Hold and Wait**  
   Processes hold resources while waiting for more
   
3. **No Preemption**  
   Resources cannot be forcibly taken away
   
4. **Circular Wait**  
   Processes form a circular chain of waiting

### Example: Simple 3-Process Deadlock

```
Process P0: Holds R0, Wants R1
Process P1: Holds R1, Wants R2
Process P2: Holds R2, Wants R0

Circular wait: P0 → P1 → P2 → P0

Result: DEADLOCK!
```

---

## Getting Started

### Launching the Application

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### First Look

You'll see three tabs:
- **Input** - Enter system data
- **Visualization** - View interactive graph
- **Results** - See detection results

Start on the **Input** tab.

---

## Using the Input Tab

### Overview

The Input tab has four main sections:
1. **Sample Datasets** - Pre-configured examples
2. **Resource Types Table** - Define resources
3. **Allocation Matrix** - Current resource holdings
4. **Request Matrix** - Pending resource requests

### Loading a Sample Dataset

**Quick Start:** Click any sample button to auto-populate data

**Available Samples:**
- **Circular Deadlock** - Classic deadlock with cycle
- **Safe State** - No deadlock, safe execution order
- **Multi-Instance Deadlock** - Deadlock with multiple instances
- **Partial Deadlock** - Mixed safe/deadlocked processes
- **Complex Safe State** - 5 processes, no deadlock

**After loading:** All tables fill automatically. Click "Analyze" to run detection.

### Resource Types Table

Defines the resources in your system.

| Column | Meaning | Example |
|--------|---------|---------|
| **Resource** | Resource name | R0, R1, R2 |
| **Total Instances** | How many copies exist | 3 |
| **Available** | Currently free | 1 |

**To Edit:**
- Click any "Total Instances" cell
- Type a new number
- Press Enter
- Available updates automatically

**Important:** Available is calculated as:
```
Available = Total - Sum(All Allocations)
```

### Allocation Matrix

Shows how many resource instances each process **currently holds**.

**Example:**
```
         R0  R1  R2
P0  [    1   0   0  ]  ← P0 holds 1 instance of R0
P1  [    0   1   0  ]  ← P1 holds 1 instance of R1
P2  [    0   0   1  ]  ← P2 holds 1 instance of R2
```

**To Edit:**
- Click any cell
- Type a number (0 or positive integer)
- Press Enter

**What it means:**
- `Allocation[i][j]` = How many instances of resource `j` process `i` has

### Request Matrix

Shows how many **additional** resource instances each process is requesting.

**Example:**
```
         R0  R1  R2
P0  [    0   1   0  ]  ← P0 wants 1 more R1
P1  [    0   0   1  ]  ← P1 wants 1 more R2
P2  [    1   0   0  ]  ← P2 wants 1 more R0
```

**To Edit:**
- Click any cell
- Type a number (0 or positive integer)
- Press Enter

**What it means:**
- `Request[i][j]` = How many additional instances of resource `j` process `i` wants

### Running Detection

1. **Load or enter data** in the matrices
2. **Click "🔍 Analyze for Deadlock"** button
3. Algorithm runs automatically
4. App switches to **Results** tab

The tool **automatically selects** the best algorithm:
- All resources have 1 instance → **WFG** (faster)
- Any resource has >1 instance → **Matrix** (more general)

### Importing and Exporting JSON

**Export:**
1. Click **"Export JSON"** button
2. File downloads (e.g., `system-state.json`)
3. Save for later or share with others

**Import:**
1. Click **"Import JSON"** button
2. Select a `.json` file
3. Data loads into tables

**Use Cases:**
- Save your work
- Share scenarios with classmates
- Test custom configurations

---

## Understanding the Visualization

The **Visualization** tab shows an interactive graph of your system state.

### Node Types

**Circles = Processes or Resources**

- 🔵 **Blue Circle** = Safe process (not deadlocked)
- 🔴 **Red Circle** = Deadlocked process
- 🟣 **Purple Circle** = Resource

### Edge Types

**Arrows = Allocations or Requests**

- **Green Solid Arrow** (→) = Allocation  
  *Meaning:* Resource has been allocated to process
  
- **Yellow Dashed Arrow** (⇢) = Request  
  *Meaning:* Process is requesting resource

### Reading the Graph

**Example: Circular Deadlock**

```
    R0 (Purple)
     ↓ (green)
   P0 (Red) ⇢⇢⇢ (yellow) R1 (Purple)
                            ↓ (green)
   R2 (Purple) ⇠⇠⇠ P1 (Red)
     ↓ (green)
   P2 (Red) ⇢⇢⇢⇢⇢⇢⇢⇢⇢⇢⇢⇢
```

**Interpretation:**
- P0 holds R0, wants R1
- P1 holds R1, wants R2
- P2 holds R2, wants R0
- **Circular wait detected!** → All three processes are red

### Interactive Features

- **Hover** over nodes to see labels
- **Pan** by dragging (if implemented)
- **Legend** shows color meanings
- **Animations** smoothly reveal graph

---

## Interpreting Results

The **Results** tab shows three sections:

### 1. Status Banner

Shows whether deadlock was detected.

**Safe State:**
```
✅ System is Safe
All processes can complete successfully. No deadlock detected.
```

**Deadlocked State:**
```
🚨 Deadlock Detected
The system is in a deadlocked state. See recovery strategies below.
```

### 2. Detection Trace

Shows step-by-step algorithm execution.

**Matrix-Based Example:**
```
=== Matrix-Based Deadlock Detection ===

System: 3 processes, 3 resource types

Initial State:
Available = [0, 0, 0]

Allocation Matrix:
  P0: [1, 0, 0]
  P1: [0, 1, 0]
  P2: [0, 0, 1]

Request Matrix:
  P0: [0, 1, 0]
  P1: [0, 0, 1]
  P2: [1, 0, 0]

--- Iteration 1 ---
Checking P0: Request[0] = [0, 1, 0], Work = [0, 0, 0]
  ✗ P0 cannot finish. Request[0] > Work

Checking P1: Request[1] = [0, 0, 1], Work = [0, 0, 0]
  ✗ P1 cannot finish. Request[1] > Work

Checking P2: Request[2] = [1, 0, 0], Work = [0, 0, 0]
  ✗ P2 cannot finish. Request[2] > Work

No more processes can finish.

--- Final Results ---
✗ System is DEADLOCKED.
Deadlocked processes: P0, P1, P2
```

**What to look for:**
- `✓` = Process can finish (Request ≤ Work)
- `✗` = Process is blocked
- Work vector updates when process finishes
- Deadlocked processes listed at end

**WFG Example:**
```
=== Wait-For Graph Deadlock Detection ===

Building wait-for graph...
Wait-for edges:
  P0 → P1 (waiting for R1)
  P1 → P2 (waiting for R2)
  P2 → P0 (waiting for R0)

Detecting cycles...
✗ Found 1 cycle(s). System is DEADLOCKED.

Cycle 1: P0 → P1 → P2 → P0
```

### 3. Recovery Strategies

Suggests ways to break the deadlock.

#### Process Termination

**Example:**
```
💡 Recovery Strategies: Process Termination

1. Terminate 1 process(es): P0
   Terminating P0 releases their allocated resources.
   After termination:
   Available = [1, 0, 0]
   P1 can now finish → releases [0, 1, 0]
   P2 can now finish → releases [0, 0, 1]
   System recovers!
```

**What it means:**
- Kill process P0
- Its resources (R0) become available
- Other processes can now continue

#### Resource Preemption

**Example:**
```
🔄 Recovery Strategies: Resource Preemption

1. Preempt resources from P0: R0
   This releases 1 resource instance(s) back to the available pool.
   P0 would need to be rolled back and restarted later.
```

**What it means:**
- Take R0 away from P0 (without killing it)
- P0 must be rolled back (lose progress)
- R0 becomes available for others
- P0 can be restarted later

---

## Sample Scenarios Explained

### 1. Circular Deadlock

**Setup:**
- 3 processes, 3 resources (1 instance each)
- Each holds one, wants another
- Forms cycle: P0 → P1 → P2 → P0

**Expected Result:** ✗ DEADLOCK

**Learning Point:**  
Classic circular wait — the most common deadlock pattern.

### 2. Safe State

**Setup:**
- 3 processes, 3 resources (multi-instance)
- Enough resources for processes to finish sequentially

**Expected Result:** ✓ SAFE

**Learning Point:**  
Shows safe execution sequence exists: P1 → P3 → P0 → P2

### 3. Multi-Instance Deadlock

**Setup:**
- 4 processes, 2 resources (multiple instances each)
- All processes blocked despite multiple instances

**Expected Result:** ✗ DEADLOCK

**Learning Point:**  
Deadlock can occur even with multiple resource instances.

### 4. Partial Deadlock

**Setup:**
- 4 processes, 2 resources
- Some processes safe, others deadlocked

**Expected Result:** ✗ PARTIAL DEADLOCK

**Learning Point:**  
Not all processes need to be deadlocked for system to be unsafe.

### 5. Complex Safe State

**Setup:**
- 5 processes, 4 resources (complex allocations)
- System appears complicated but is safe

**Expected Result:** ✓ SAFE

**Learning Point:**  
Safe sequence: P1 → P3 → P4 → P0 → P2

---

## Tips & Best Practices

### 1. Start with Samples

- Always load a sample first to see correct format
- Modify samples rather than starting from scratch
- Understand each sample before creating custom scenarios

### 2. Understand Your Data

**Remember:**
- **Allocation** = What processes currently **have**
- **Request** = What processes **want** (additional)
- **Available** = What's **free** right now

### 3. Resource Conservation Rule

For each resource j:
```
Total[j] = Available[j] + Σ Allocation[i][j]
```

If this doesn't hold, you'll get an error.

### 4. Choose the Right Algorithm

**When to use Matrix:**
- Any resource has multiple instances
- More general, works for all cases
- Slightly slower (O(n²×m))

**When to use WFG:**
- All resources have exactly 1 instance
- Simpler, faster (O(n²))
- Only correct for single-instance

**Note:** Tool auto-selects for you!

### 5. Read the Trace

- Don't just look at final result
- Read step-by-step trace
- Understand *why* deadlock was detected
- Helps learn the algorithm

### 6. Experiment!

**Try these experiments:**
- Change one allocation and re-run
- Increase a request and see effect
- Add more processes/resources
- Break a deadlock by freeing resources

---

## Troubleshooting

### Error: "Resource conservation violated"

**Problem:** Total resources don't match allocated + available

**Solution:**
```
Check: Available[j] + Σ Allocation[i][j] == Total[j]
```
- Verify allocation matrix values
- Adjust total instances or allocations

### Error: "Invalid request"

**Problem:** Request contains negative numbers or non-integers

**Solution:**
- All values must be ≥ 0
- Only whole numbers allowed
- Check for typos

### Visualization shows nothing

**Problem:** Haven't run detection yet

**Solution:**
- Go to Input tab
- Click "Analyze for Deadlock"
- Then view Visualization tab

### Results show wrong algorithm

**Problem:** Tool selected algorithm you didn't expect

**Solution:**
- Algorithm is auto-selected based on resource instances
- If any resource has >1 instance → Matrix
- If all have 1 instance → WFG
- This ensures correct results

### JSON import fails

**Problem:** File format incorrect

**Solution:**
- Check examples in `test-data/` folder
- Ensure all required fields present
- Validate JSON syntax (use jsonlint.com)

### Graph looks messy

**Problem:** Too many processes/resources

**Solution:**
- Visualization works best with ≤10 nodes
- Try zooming out in browser
- Or use smaller sample scenarios

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** | Navigate between input cells |
| **Enter** | Confirm cell edit |
| **Esc** | Cancel cell edit |
| **Ctrl+I** | Focus Import button |
| **Ctrl+E** | Focus Export button |

---

## Next Steps

Now that you understand the tool:

1. **Practice:** Try all sample datasets
2. **Experiment:** Create custom scenarios
3. **Learn:** Read algorithm traces carefully
4. **Study:** Review Operating Systems textbooks
5. **Share:** Export and share interesting scenarios

---

## Additional Resources

- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Technical implementation details
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview
- **Textbook:** *Operating System Concepts* by Silberschatz et al.

---

## Feedback

Found a bug? Have a suggestion? Open an issue on GitHub!

---

**Happy Learning! 🎓**
