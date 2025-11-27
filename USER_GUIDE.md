# 📖 User Guide - Deadlock Detective

## Welcome! 🎉

This guide will help you understand and use the Deadlock Detective tool to detect and analyze deadlocks in simulated operating system processes.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding Deadlocks](#understanding-deadlocks)
3. [Using the Input Tab](#using-the-input-tab)
4. [Understanding the Visualization](#understanding-the-visualization)
5. [Interpreting Results](#interpreting-results)
6. [Sample Scenarios](#sample-scenarios)
7. [Tips & Best Practices](#tips--best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### What is Deadlock Detective?

Deadlock Detective is a web application that helps you:
- **Detect deadlocks** in a simulated system of processes and resources
- **Visualize** the relationships between processes and resources
- **Understand** how detection algorithms work step-by-step
- **Learn** about recovery strategies when deadlock occurs

### Prerequisites

No special knowledge required! This tool is designed for beginners learning operating systems concepts.

---

## Understanding Deadlocks

### What is a Deadlock?

A **deadlock** occurs when processes are stuck waiting for each other in a circular pattern. No process can proceed because each is waiting for a resource held by another.

**Real-world analogy:**
Imagine four cars at a 4-way intersection, each waiting for the car on their right to move first. Nobody can move!

### Four Necessary Conditions for Deadlock

Deadlock can only occur if ALL four conditions are present:

1. **Mutual Exclusion** - Resources cannot be shared (only one process at a time)
2. **Hold and Wait** - Processes hold resources while waiting for more
3. **No Preemption** - Resources cannot be forcibly taken away
4. **Circular Wait** - Processes form a circular chain of waiting

### Example: Simple 3-Process Deadlock

```
Process P0: Has R0, Wants R1
Process P1: Has R1, Wants R2
Process P2: Has R2, Wants R0

P0 → P1 → P2 → P0  (Circular wait!)
```

This is a **deadlock**. No process can proceed.

---

## Using the Input Tab

### 1. Load a Sample Dataset

The easiest way to start is by loading a pre-configured sample:

- **Circular Deadlock** - Classic 3-process circular wait (deadlocked)
- **Safe State** - A safe system with no deadlock
- **Multi-Instance Deadlock** - Deadlock with resources having multiple instances
- **Partial Deadlock** - Some processes deadlocked, others safe
- **Complex Safe State** - 5-process safe scenario

**How to load:**
1. Click any sample button in the "Load Sample Dataset" section
2. The tables below will automatically fill with data
3. Click "Analyze for Deadlock" to see results

### 2. Edit Resource Types

The **Resource Types** table shows:
- **Resource** - Name (R0, R1, R2, etc.)
- **Total Instances** - How many instances of this resource exist
- **Available** - How many are currently free (calculated automatically)

**To edit:**
- Click on any "Total Instances" cell and type a new number
- Available instances update automatically

### 3. Edit Allocation Matrix

The **Allocation Matrix** shows how many resource instances each process currently holds.

**Example:**
```
       R0  R1  R2
P0  [  1   0   0 ]  <- P0 holds 1 instance of R0
P1  [  0   1   0 ]  <- P1 holds 1 instance of R1
P2  [  0   0   1 ]  <- P2 holds 1 instance of R2
```

**To edit:**
- Click on any cell and type a number
- The system automatically updates available resources

### 4. Edit Request Matrix

The **Request Matrix** shows how many **additional** resource instances each process is requesting.

**Example:**
```
       R0  R1  R2
P0  [  0   1   0 ]  <- P0 wants 1 more instance of R1
P1  [  0   0   1 ]  <- P1 wants 1 more instance of R2
P2  [  1   0   0 ]  <- P2 wants 1 more instance of R0
```

**To edit:**
- Click on any cell and type a number
- This represents what the process is waiting for

### 5. Choose an Algorithm

Two algorithms are available:

**Matrix-Based Detection (Recommended)**
- Works for resources with **multiple instances**
- More general and widely used
- Uses Work and Finish vectors

**Wait-For Graph (WFG)**
- Works for resources with **single instances only**
- Simpler but more limited
- Uses graph cycle detection

**When to use which:**
- If any resource has > 1 instance → Use Matrix-Based
- If all resources have exactly 1 instance → Either works (WFG is simpler)

### 6. Analyze for Deadlock

Once you've configured your system:
1. Click the **"🔍 Analyze for Deadlock"** button
2. The app will switch to the Results tab automatically
3. You can then view the Visualization tab too

---

## Understanding the Visualization

The **Visualization Tab** shows a graph of your system:

### Node Types

- **Blue Circles** = Safe processes (not deadlocked)
- **Red Circles** = Deadlocked processes
- **Purple Circles** = Resources

### Edge Types

- **Green Solid Arrow** = Allocation (Resource → Process)
  - Means: Process has been allocated that resource
- **Yellow Dashed Arrow** = Request (Process → Resource)
  - Means: Process is waiting for that resource

### Reading the Graph

**Example: Circular Deadlock**
```
P0 (Red) ← R0 (Purple) ← P2 (Red)
   ↓                        ↑
  R1 (Purple)            R2 (Purple)
   ↓                        ↑
P1 (Red) ← ← ← ← ← ← ← ← ← ← 
```

- P0 holds R0, wants R1
- P1 holds R1, wants R2
- P2 holds R2, wants R0
- **Circular dependency!** → Deadlock

---

## Interpreting Results

### Safe State ✅

When you see this:

```
✅ System is Safe
All processes can complete successfully. No deadlock detected.
```

**What it means:**
- All processes can eventually complete
- There exists a safe execution sequence
- No circular wait condition

**Example Safe Sequence:**
```
Safe execution sequence: P1 → P3 → P0 → P2
```

This means if we run processes in this order, all can complete.

### Deadlocked State 🚨

When you see this:

```
🚨 Deadlock Detected
The system is in a deadlocked state. See recovery strategies below.
```

**What it means:**
- Some (or all) processes are stuck
- They're waiting in a circular pattern
- System cannot proceed without intervention

**Deadlocked Processes:**
```
Deadlocked processes: P0, P1, P2
```

These processes are stuck and cannot continue.

### Detection Trace

The trace shows step-by-step how the algorithm detected the deadlock:

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

### Recovery Strategies

When deadlock is detected, the app suggests two types of recovery:

#### 1. Process Termination

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
- Kill one or more processes
- Their resources become available
- Other processes can continue

#### 2. Resource Preemption

**Example:**
```
🔄 Recovery Strategies: Resource Preemption

1. Preempt resources from P0: R0
   This releases 1 resource instance(s) back to the available pool.
   P0 would need to be rolled back and restarted later.
```

**What it means:**
- Take resources away from a process (without killing it)
- Process must be rolled back and restarted later
- Resources become available for others

---

## Sample Scenarios

### Scenario 1: Circular Deadlock

**Setup:**
- 3 processes, 3 resources (1 instance each)
- Each process holds one resource and wants another
- Forms a cycle: P0 → P1 → P2 → P0

**Expected Result:** Deadlock detected

**Learning Point:** This is the classic deadlock scenario demonstrating circular wait.

### Scenario 2: Safe State

**Setup:**
- 3 processes, 3 resources (multiple instances)
- Processes can complete in sequence

**Expected Result:** No deadlock

**Learning Point:** Shows that even with requests, a system can be safe if there's a valid execution order.

### Scenario 3: Multi-Instance Deadlock

**Setup:**
- 4 processes, 2 resources (multiple instances)
- Multiple processes competing for limited resources

**Expected Result:** Deadlock detected

**Learning Point:** Deadlock can occur even with multiple resource instances.

### Scenario 4: Partial Deadlock

**Setup:**
- 4 processes, 2 resources
- Some processes are deadlocked, others can complete

**Expected Result:** Partial deadlock (some processes deadlocked)

**Learning Point:** Not all processes need to be deadlocked for deadlock to exist.

---

## Tips & Best Practices

### 1. Start with Samples
- Always load a sample first to see how data should be formatted
- Modify samples rather than starting from scratch

### 2. Understand Your Data
- **Allocation** = What processes currently have
- **Request** = What processes are waiting for
- **Available** = What's currently free

### 3. Resource Conservation Rule
For each resource:
```
Total Instances = Available + Sum of All Allocations
```

If this doesn't hold, you'll get an error.

### 4. Choose the Right Algorithm
- **Multi-instance resources?** → Use Matrix-Based
- **All single-instance?** → Either works

### 5. Export and Save
- Use **"Export JSON"** to save your configuration
- Share with classmates or instructors
- Use **"Import JSON"** to load it back

### 6. Read the Trace
- Don't just look at the final result
- Read the step-by-step trace to understand *why*
- This helps you learn the algorithm

---

## Troubleshooting

### "Resource conservation violated"

**Problem:** Total resources don't match allocated + available

**Solution:**
- Check your allocation matrix
- Make sure total instances = available + all allocations
- Adjust either total instances or allocations

### "No cycles detected but system seems wrong"

**Problem:** Using WFG on multi-instance resources

**Solution:**
- Switch to Matrix-Based Detection
- WFG only works correctly for single-instance resources

### "Process cannot finish" but should be able to

**Problem:** Request > Available

**Solution:**
- Check your Request matrix
- A process requests more than what's available
- This is valid (it's waiting), but means it cannot finish yet

### Visualization not showing

**Problem:** Need to run detection first

**Solution:**
- Go to Input tab
- Click "Analyze for Deadlock"
- Then view Visualization tab

---

## Next Steps

1. **Try all samples** - See different deadlock scenarios
2. **Create your own** - Start with a sample and modify it
3. **Read the algorithm guide** - Understand the math behind it
4. **Experiment** - What happens if you change one allocation?

---

## Need More Help?

- Check **ALGORITHM_GUIDE.md** for technical details
- Check **DEVELOPER_GUIDE.md** if you want to modify the code
- Review operating systems textbooks for theory

---

**Happy Learning! 🎓**
