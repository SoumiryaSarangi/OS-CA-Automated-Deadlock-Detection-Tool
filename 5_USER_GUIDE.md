# 🚀 User Guide - How to Use the Application

## 🎯 Quick Start (3 Easy Steps)

### Step 1: Open the Application

```bash
npm run dev
```

✅ Open browser to **http://localhost:5173**

### Step 2: Load a Sample

Click any sample button like: **Circular Deadlock (Single-Instance)**

### Step 3: Run Detection

Click the **🔍 Analyze for Deadlock** button

**That's it!** You'll see if there's a deadlock! 🎉

---

## 📖 Complete User Guide

### 🖥️ Understanding the Interface

When you open the app in your browser, you see:

```
┌──────────────────────────────────────────────────┐
│  Header: Deadlock Detective    🌓/☀️ (Theme Toggle)  │
├──────────────────────────────────────────────────┤
│  💻 Input  │  📊 Visualization  │  ✅ Results    │
├──────────────────────────────────────────────────┤
│                                                  │
│         Main Content Area with Animations       │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Header Features:**
- **App Title** - "Deadlock Detective" with logo
- **🌓/☀️ Theme Toggle** - Switch between Dark and Light modes
- **Smooth animations** on page load

#### Tab 1: Input

- Where you enter or edit data
- Load sample datasets or create custom problems
- Edit allocation and request matrices
- Import/Export JSON files
- Save/Load from browser storage

#### Tab 2: Visualization

- D3.js interactive graph visualization
- **Red circles** = Deadlocked processes
- **Blue circles** = Safe processes
- **Purple circles** = Resources
- **Green solid arrows** = Allocations (resource → process)
- **Yellow dashed arrows** = Requests (process → resource)

#### Tab 3: Results

- Shows algorithm results
- **"DEADLOCK DETECTED"** or **"NO DEADLOCK"**
- Shows step-by-step execution trace
- Displays recovery strategies (if deadlock found)
- Shows safe execution sequence (if no deadlock)

---

## 📊 Input Tab - Detailed Guide

### Section 1: Header Actions

```
┌──────────────────────────────────────────────┐
│  📥 Import JSON  📤 Export JSON              │
│  💾 Save Locally  📂 Load Saved  🗑️ Clear    │
└──────────────────────────────────────────────┘
```

**📥 Import JSON:**
- Load a system configuration from a JSON file
- Useful for sharing scenarios or loading saved problems

**📤 Export JSON:**
- Save current configuration to a JSON file
- Download and keep for later use

**💾 Save Locally:**
- Quick-save to browser's localStorage
- Persists across page refreshes
- Only one save slot

**📂 Load Saved:**
- Restore previously saved configuration from localStorage

**🗑️ Clear Saved:**
- Delete saved configuration from localStorage

---

### Section 2: Create New Problem

```
Create New Problem
┌──────────────────────────────────────────┐
│  Number of Processes: [3]                │
│  Number of Resource Types: [3]           │
│                                          │
│  Process Names:                          │
│  P0 [Process 0]  P1 [Process 1]  ...     │
│                                          │
│  Resource Types:                         │
│  R0 [Resource 0] [1] instances           │
│  R1 [Resource 1] [1] instances           │
│  ...                                     │
│                                          │
│  [➕ Create Problem] [♻️ Reset Fields]   │
│  [➕ Add Process] [➕ Add Resource]       │
└──────────────────────────────────────────┘
```

**What it does:**
- Create a custom deadlock scenario from scratch
- Define your own process and resource names
- Set resource instances (how many copies exist)

**How to use:**
1. Set **number of processes** (e.g., 3)
2. Set **number of resource types** (e.g., 3)
3. Edit process names (default: P0, P1, P2...)
4. Edit resource names (default: R0, R1, R2...)
5. Set resource instances for each type
6. Click **➕ Create Problem**
7. Scroll down to edit Allocation and Request matrices

**Quick buttons:**
- **➕ Add Process** - Quickly add one more process
- **➕ Add Resource** - Quickly add one more resource type
- **♻️ Reset Fields** - Clear all inputs back to defaults

**Example:**
```
Processes: 3
Resources: 2

Process Names:
P0 = "Word Processor"
P1 = "Browser"
P2 = "File Manager"

Resources:
R0 = "Printer" (1 instance)
R1 = "Scanner" (1 instance)
```

---

### Section 3: Load Sample Dataset

Grid of pre-loaded sample buttons:

**Deadlock Scenarios:**
- **Circular Deadlock (Single-Instance)** - Classic 3-process cycle
- **Two Process Deadlock (Single-Instance)** - Simple deadlock
- **Chain Deadlock (Single-Instance)** - Linear wait chain
- **Database Lock Deadlock (Single-Instance)** - Transaction locks
- **Dining Philosophers** - Classic OS problem
- **Multi-Instance Deadlock** - With multiple resource copies
- **Partial Deadlock** - Some processes safe, others stuck

**Safe State Scenarios:**
- **Safe State** - Multi-instance, no deadlock
- **Simple Safe State** - Easy example
- **Single-Instance Safe** - One free resource
- **Sequential Safe** - Processes finish in order
- **No Requests (Trivial Safe)** - Nobody wants anything
- **Banker's Algorithm (Safe)** - Classic safe state
- **Complex Safe State** - 5 processes, safe sequence
- **Large System (Safe)** - 6 processes, 4 resource types

**How to use:**
- Click any button to auto-populate all tables
- Active sample shows with **✓ checkmark**
- Sample data loads into Allocation and Request tables below

**Tip:** Start with "Circular Deadlock" to see a clear example!

---

### Section 4: Detection Algorithm

```
┌──────────────────────────────────────────┐
│  Auto-Selected Algorithm:                │
│  🔵 Wait-For Graph (WFG)                 │
│     All resources are single-instance    │
│                                          │
│  OR                                      │
│                                          │
│  🟣 Matrix-Based Detection               │
│     System has multi-instance resources  │
│                                          │
│  ℹ️ The system automatically selects     │
│     the optimal algorithm based on       │
│     your resource configuration.         │
└──────────────────────────────────────────┘
```

**What it means:**
- The app **automatically** chooses the best algorithm
- Based on your resource instances

**Algorithm Selection:**
- **All resources have 1 instance each** → WFG algorithm
  - Example: R0=1, R1=1, R2=1
  - Faster, simpler
  - Detects cycles in wait-for graph
  
- **At least one resource has >1 instances** → Matrix algorithm
  - Example: R0=3, R1=2, R2=1
  - Handles quantities
  - Uses Work-Finish vectors

**You don't need to do anything!** The app decides for you.

---

### Section 5: Resource Types Table

```
┌──────────┬──────────────────┬───────────┐
│ Resource │ Total Instances  │ Available │
├──────────┼──────────────────┼───────────┤
│ R0       │ [3] ↑↓           │ 1         │
│ R1       │ [2] ↑↓           │ 0         │
│ R2       │ [4] ↑↓           │ 2         │
└──────────┴──────────────────┴───────────┘
```

**What each column means:**

**Resource:**
- Name of the resource type (R0, R1, R2, ...)
- Can be renamed in "Create New Problem"

**Total Instances:**
- How many copies of this resource exist
- **Editable** - click and type a number
- Use ↑↓ arrows to adjust

**Available:**
- How many are currently FREE (not allocated)
- **Auto-calculated**: Available = Total - Sum(Allocated)
- **Read-only** - updates automatically

**Example:**
```
Printer (R0):
Total: 3 printers exist
Currently allocated: 2 (P0 has 1, P1 has 1)
Available: 1 printer is free
```

**Tips:**
- If Available = 0 for all resources → Higher chance of deadlock
- Increase Total Instances to make more resources available

---

### Section 6: Allocation Matrix

```
Allocation Matrix
Resources currently held by each process

┌─────────┬────┬────┬────┐
│ Process │ R0 │ R1 │ R2 │
├─────────┼────┼────┼────┤
│ P0      │ [1]│ [0]│ [2]│
│ P1      │ [1]│ [1]│ [0]│
│ P2      │ [0]│ [1]│ [0]│
└─────────┴────┴────┴────┘
```

**What it means:**
- Shows what each process CURRENTLY HAS
- Each cell is **editable** - click and type

**Reading the matrix:**
```
Row P0: [1, 0, 2]
→ P0 currently holds:
  • 1 copy of R0
  • 0 copies of R1
  • 2 copies of R2
```

**How to edit:**
1. Click on any cell
2. Type a number (0 or positive)
3. Press Enter or click outside

**Auto-updates:**
- When you increase allocation → Available decreases
- When you decrease allocation → Available increases
- Maintains resource conservation: `Total = Available + Sum(Allocated)`

**Example scenario:**
```
Printer (R0) has 3 total instances

Allocation:
P0 has 1 printer
P1 has 1 printer
P2 has 0 printers

Sum = 1 + 1 + 0 = 2 allocated
Available = 3 - 2 = 1 printer free ✓
```

---

### Section 7: Request Matrix

```
Request Matrix
Additional resources requested by each process

┌─────────┬────┬────┬────┐
│ Process │ R0 │ R1 │ R2 │
├─────────┼────┼────┼────┤
│ P0      │ [0]│ [1]│ [0]│
│ P1      │ [0]│ [0]│ [1]│
│ P2      │ [1]│ [0]│ [0]│
└─────────┴────┴────┴────┘
```

**What it means:**
- Shows what each process WANTS (but doesn't have yet)
- These are ADDITIONAL resources needed

**Reading the matrix:**
```
Row P0: [0, 1, 0]
→ P0 wants:
  • 0 more of R0 (already has enough)
  • 1 more of R1 (needs one more)
  • 0 more of R2 (already has enough)
```

**Important:**
- Request = Additional needs, NOT total needs
- If a process wants nothing, set all to 0
- Can't request more than what exists!

**Deadlock Example:**
```
Allocation: P0=[1,0], P1=[0,1]
Request:    P0=[0,1], P1=[1,0]

P0 holds R0, wants R1 (held by P1)
P1 holds R1, wants R0 (held by P0)
→ Circular wait → DEADLOCK!
```

---

### Section 8: Analyze Button

```
┌──────────────────────────────────┐
│  🔍 Analyze for Deadlock         │
└──────────────────────────────────┘
```

**What it does:**
1. Validates all your data
2. Selects appropriate algorithm (WFG or Matrix)
3. Runs deadlock detection
4. Generates recovery strategies (if deadlock found)
5. Switches to **Results** tab automatically

**When to click:**
- After loading a sample
- After creating a custom problem
- After editing any matrices
- Anytime you want to check for deadlock

---

## 🌌 Theme Switcher - Personalize Your Experience

### Switching Themes

**Location:** Top-right corner of the header

**How to use:**
1. Look for the theme toggle button (pill-shaped)
2. Click the **Sun icon** (☀️) for Light mode
3. Click the **Moon icon** (🌓) for Dark mode
4. Watch the smooth transition animation!

**Features:**
- **Persistent** - Your choice is remembered
- **Smooth animations** - No jarring color changes
- **Animated indicator** - Slides between options
- **Backdrop blur** - Modern glass-morphism effect

**Theme Comparison:**

| Feature | Dark Mode 🌓 | Light Mode ☀️ |
|---------|------------|-------------|
| Background | Dark gray/black | White/light gray |
| Text | Light colors | Dark colors |
| Best for | Night use, reduced eye strain | Daytime, bright environments |
| Default | Yes | No |

**Tips:**
- Use **Dark mode** when working late at night
- Use **Light mode** in bright offices or daylight
- Theme affects all tabs and components

---

## 🎨 Animated Icons - Interactive Navigation

### Tab Icons

Each tab has a unique animated icon:

**💻 Input Tab (CPU Icon):**
- Animates when you hover over it
- Represents processing and data entry

**📊 Visualization Tab (Chart Icon):**
- Animates to show data visualization
- Becomes active after analysis

**✅ Results Tab (Check Icon):**
- Animates when results are ready
- Indicates completion status

**Hover Effects:**
- Icons pulse or animate on mouse hover
- Active tab has highlighted icon
- Disabled tabs are grayed out

---

## 📊 Visualization Tab - Detailed Guide

### Understanding the Graph

```
┌────────────────────────────────────┐
│                                    │
│       ⚪ P0 ────────→ 🟣 R1        │
│        ↑              ↓            │
│        │              │            │
│       🟣 R0 ←──────── ⚪ P1        │
│                                    │
└────────────────────────────────────┘
```

**Node Types:**

**🔵 Blue Circles = Safe Processes**
- Can finish successfully
- Not involved in deadlock
- Will eventually complete

**🔴 Red Circles = Deadlocked Processes**
- Stuck in circular wait
- Cannot proceed
- Part of deadlock cycle

**🟣 Purple Circles = Resources**
- Resource types (R0, R1, R2, ...)
- Static (don't change color)

**Edge Types:**

**Green Solid Arrow (→) = Allocation**
- Direction: Resource → Process
- Meaning: "This process currently holds this resource"
- Example: R0 → P1 means "P1 has R0"

**Yellow Dashed Arrow (⇢) = Request**
- Direction: Process → Resource
- Meaning: "This process wants this resource"
- Example: P0 ⇢ R1 means "P0 wants R1"

### Reading Deadlock Patterns

**Circular Wait (Deadlock):**
```
P0 has R0, wants R1
P1 has R1, wants R2
P2 has R2, wants R0

Graph:
P0 → R1 → P1 → R2 → P2 → R0 → P0
↑_________________________________|
         (Full circle!)
```

**Safe State (No Deadlock):**
```
P0 wants nothing
P1 wants R0 (P0 can release it)
P2 wants R1 (available)

Graph:
P0 (no outgoing edges - can finish!)
P1 → R0 (can get it after P0 finishes)
P2 → R1 (can get it now)
```

### Interactive Features

- **Drag nodes** to rearrange
- **Zoom** with mouse wheel
- **Pan** by dragging background
- **Hover** over nodes to see details
- **Animations** show state transitions

---

## 📋 Results Tab - Detailed Guide

### Section 1: Status Banner

**No Deadlock:**
```
┌──────────────────────────────────────┐
│  ✅ NO DEADLOCK                      │
│  System is in a safe state           │
└──────────────────────────────────────┘
```

**Deadlock Detected:**
```
┌──────────────────────────────────────┐
│  🚨 DEADLOCK DETECTED                │
│  Processes {P0, P1, P2} are deadlocked│
└──────────────────────────────────────┘
```

---

### Section 2: Algorithm Information

```
Algorithm Used: Matrix-Based Detection
Execution Time: 2.5 ms
Complexity: O(n² × m)
```

Shows which algorithm was used and performance metrics.

---

### Section 3: Detection Trace

**For WFG Algorithm:**
```
Detection Trace:
1. Building wait-for graph...
2. P0 wants R1, held by P1 → P0 waits for P1
3. P1 wants R2, held by P2 → P1 waits for P2
4. P2 wants R0, held by P0 → P2 waits for P0
5. Starting cycle detection from P0
6. Visiting P0 → P1 → P2 → P0 (cycle!)
7. DEADLOCK DETECTED
8. Cycle found: P0 → P1 → P2 → P0
```

**For Matrix Algorithm:**
```
Detection Trace:
1. Initializing: Work = [0, 0, 0], Finish = [F, F, F]
2. Iteration 1:
   - Checking P0: Request [1,1,0] > Work [0,0,0] ✗
   - Checking P1: Request [0,1,1] > Work [0,0,0] ✗
   - Checking P2: Request [1,0,1] > Work [0,0,0] ✗
3. No process can proceed
4. DEADLOCK DETECTED
5. Deadlocked processes: {P0, P1, P2}
```

**Educational value:**
- Shows step-by-step algorithm execution
- Helps understand how detection works
- Great for learning operating systems concepts

---

### Section 4: Safe Sequence (If No Deadlock)

```
Safe Sequence Found:
P0 → P2 → P1

Explanation:
1. P0 can finish (needs nothing)
2. P0 releases [1, 0, 1]
3. P2 can finish (enough resources now)
4. P2 releases [0, 1, 1]
5. P1 can finish (enough resources now)
6. All processes complete successfully!
```

Shows the order in which processes can safely complete.

---

### Section 5: Deadlock Cycles (If Deadlock Found)

```
Cycles Detected:
Cycle 1: P0 → P1 → P2 → P0
  • P0 waits for P1 (needs R1)
  • P1 waits for P2 (needs R2)
  • P2 waits for P0 (needs R0)
```

Shows all circular wait conditions found.

---

### Section 6: Recovery Strategies

**Strategy 1: Process Termination**
```
Option 1: Terminate {P0}
  • Cost: Kill 1 process
  • Effect: P1 can get R0, P2 can get R1
  • Pros: Breaks cycle immediately
  • Cons: P0 loses all progress

Option 2: Terminate {P1, P2}
  • Cost: Kill 2 processes
  • Effect: P0 can complete
  • Pros: P0 doesn't lose work
  • Cons: More processes affected
```

**Strategy 2: Resource Preemption**
```
Option 1: Preempt R1 from P1, give to P0
  • P0 completes and releases R0 and R1
  • P1 can then get R1 back and continue
  • Rollback P1 to safe state
  
Option 2: Preempt R0 from P0, give to P2
  • P2 completes and releases R0 and R2
  • P0 can then get R0 back and continue
```

**How to choose:**
- **Minimum cost?** → Terminate fewest processes
- **Preserve important work?** → Preempt instead of terminate
- **Fastest recovery?** → Terminate processes
- **Least disruption?** → Preempt resources

---

## 🎮 Example Walkthrough

### Example 1: Detecting a Simple Deadlock

**Step 1: Load Sample**
- Click **"Two Process Deadlock (Single-Instance)"**

**You'll see:**
```
Processes: 2 (Process A, Process B)
Resources: 2 (File1, File2)

Allocation:
Process A: [1, 0] (has File1)
Process B: [0, 1] (has File2)

Request:
Process A: [0, 1] (wants File2)
Process B: [1, 0] (wants File1)
```

**Step 2: Analyze**
- Click **🔍 Analyze for Deadlock**

**Results:**
```
🚨 DEADLOCK DETECTED

Cycle: Process A → Process B → Process A

Recovery:
- Kill Process A OR Process B
- OR Preempt File1 or File2
```

**Step 3: View Graph**
- Switch to **Visualization** tab
- See red circles showing deadlocked processes
- See circular arrows forming a loop

---

### Example 2: Verifying a Safe State

**Step 1: Load Sample**
- Click **"Simple Safe State"**

**You'll see:**
```
Processes: 3
Resources: 2 (R0 has 5, R1 has 3)

Available: [2, 1]

Allocation & Request:
P0: Has [2,0], Wants [1,2]
P1: Has [1,1], Wants [1,1]
P2: Has [0,1], Wants [2,1]
```

**Step 2: Analyze**
- Click **🔍 Analyze for Deadlock**

**Results:**
```
✅ NO DEADLOCK

Safe Sequence: P1 → P0 → P2

Explanation:
1. P1 can finish (needs [1,1], available [2,1])
2. P1 releases [1,1] → available becomes [3,2]
3. P0 can finish (needs [1,2], available [3,2])
4. P0 releases [2,0] → available becomes [5,2]
5. P2 can finish (needs [2,1], available [5,2])
```

---

### Example 3: Creating Your Own Problem

**Step 1: Create Problem**
- Set **Processes: 2**
- Set **Resources: 2**
- Name them:
  - P0 = "Browser"
  - P1 = "Editor"
  - R0 = "RAM" (4 instances)
  - R1 = "CPU" (2 instances)
- Click **➕ Create Problem**

**Step 2: Set Allocation**
```
Browser: [2, 1] (has 2 RAM, 1 CPU)
Editor:  [1, 0] (has 1 RAM, 0 CPU)
```

**Step 3: Set Requests**
```
Browser: [0, 1] (wants 1 more CPU)
Editor:  [2, 1] (wants 2 RAM, 1 CPU)
```

**Step 4: Analyze**
- Click **🔍 Analyze for Deadlock**
- See if they're deadlocked!

**Current Available:**
```
RAM: 4 - (2+1) = 1 free
CPU: 2 - (1+0) = 1 free
Available: [1, 1]
```

**Can Editor proceed?**
```
Editor wants [2, 1]
Available: [1, 1]
2 > 1 for RAM → NO! ✗
```

**Can Browser proceed?**
```
Browser wants [0, 1]
Available: [1, 1]
0 ≤ 1 and 1 ≤ 1 → YES! ✓
```

**Result:** NO DEADLOCK (Browser can finish first)

---

## 💾 Saving and Loading Scenarios

### Export to JSON

**Steps:**
1. Configure your problem
2. Click **📤 Export JSON**
3. File downloads as `system-state.json`
4. Save to your computer

**Use cases:**
- Share with classmates
- Submit homework
- Create test cases
- Document findings

---

### Import from JSON

**Steps:**
1. Click **📥 Import JSON**
2. Select your JSON file
3. Data loads automatically

**JSON Format:**
```json
{
  "schema_version": "1.0",
  "processes": [
    {"pid": 0, "name": "P0"},
    {"pid": 1, "name": "P1"}
  ],
  "resource_types": [
    {"rid": 0, "name": "R0", "instances": 3},
    {"rid": 1, "name": "R1", "instances": 2}
  ],
  "available": [1, 0],
  "allocation": [[1, 1], [1, 1]],
  "request": [[0, 1], [1, 0]]
}
```

---

### Save to Browser Storage

**Quick Save (localStorage):**
1. Configure your problem
2. Click **💾 Save Locally**
3. Saved automatically

**Load Later:**
1. Click **📂 Load Saved**
2. Your last configuration restores

**Notes:**
- Only stores ONE configuration
- Persists across page refreshes
- Specific to your browser
- Not synced across devices

**Clear Storage:**
- Click **🗑️ Clear Saved** to delete

---

## 🎓 Tips for Students

### Understanding Deadlocks

1. **Start with simple examples:**
   - Load "Two Process Deadlock"
   - See the circular wait clearly

2. **Compare safe vs unsafe:**
   - Load "Simple Safe State"
   - Then load "Circular Deadlock"
   - Notice the difference

3. **Follow the trace:**
   - Read step-by-step explanations
   - Understand how algorithms work

### For Homework/Exams

1. **Create test scenarios:**
   - Use "Create New Problem"
   - Try different configurations
   - Verify with the tool

2. **Export your work:**
   - Save as JSON
   - Include in submissions
   - Document your findings

3. **Understand recovery:**
   - Read suggested strategies
   - Think about trade-offs
   - Explain why they work

---

## 🐛 Troubleshooting

### Issue: Can't edit matrices

**Solution:**
- Make sure you've loaded a sample or created a problem first
- Check that you're in the Input tab

### Issue: Analyze button does nothing

**Solution:**
- Check browser console for errors (F12)
- Verify all values are valid numbers
- Ensure resource conservation holds

### Issue: Visualization not showing

**Solution:**
- Run analysis first (Input tab → Analyze)
- Then switch to Visualization tab
- Refresh if graph doesn't appear

### Issue: Save/Load not working

**Solution:**
- Check that localStorage is enabled in browser
- Try incognito mode to test
- Clear browser cache if needed

---

## 🎯 Keyboard Shortcuts

| Key Combination | Action |
|----------------|--------|
| `Tab` | Move to next input field |
| `Shift + Tab` | Move to previous input field |
| `Enter` | Confirm input edit |
| `Escape` | Cancel input edit |
| `F12` | Open browser console (for debugging) |

---

## 📚 Learning Exercises

### Exercise 1: Create a Deadlock
Try to create the smallest possible deadlock (fewest processes/resources).

**Hint:** You need at least 2 processes and 2 resources.

### Exercise 2: Break a Deadlock
1. Load "Circular Deadlock"
2. Modify the Request matrix to make it safe
3. Verify with analysis

### Exercise 3: Resource Sufficiency
Starting with "Multi-Instance Deadlock":
1. How many instances of R0 would make it safe?
2. Test different values
3. Find the minimum

---

## 🚀 Advanced Features

### Creating Complex Scenarios

**Large Systems:**
- Add up to 20 processes
- Add up to 20 resource types
- Test scalability

**Mixed Instance Types:**
- Some resources single-instance
- Others multi-instance
- See which algorithm is selected

### Custom Visualizations

**After analysis:**
- Visualization tab updates automatically
- Drag nodes to rearrange
- Take screenshots for reports

---

## 📞 Getting Help

### If You're Stuck

1. **Read the trace** - Step-by-step explanations
2. **Try simpler examples** - Start with 2 processes
3. **Check sample datasets** - Learn from examples
4. **Export and share** - Send JSON to instructor

### Common Questions

**Q: Why does my safe state show as deadlock?**
**A:** Check that Available + Sum(Allocations) = Total Instances

**Q: Can I have 0 resources available?**
**A:** Yes! But increases deadlock likelihood

**Q: What if all processes want nothing?**
**A:** Always safe - they can all finish immediately

---

## 🎉 Summary

**Key Steps:**
1. **Choose your theme** (🌓 Dark or ☀️ Light)
2. **Load or Create** a problem
3. **Edit** allocation and request matrices
4. **Analyze** for deadlock
5. **View** results and visualization
6. **Understand** recovery strategies

**Remember:**
- Single-instance → WFG algorithm (cycles)
- Multi-instance → Matrix algorithm (Work-Finish)
- Red nodes = Deadlocked
- Blue nodes = Safe
- Green arrows = Allocation
- Yellow arrows = Request
- Animated icons show tab status
- Theme switcher for comfortable viewing

**Happy Deadlock Detecting! 🔍**

---

**Need more help?** Check the other documentation files:
- `1_UNDERSTANDING_DEADLOCKS.md` - Basics
- `2_PROBLEM_STATEMENT.md` - What we're solving
- `3_DETECTION_ALGORITHMS.md` - Math & algorithms
- `4_PROJECT_GUIDE.md` - Code structure
