# 🔍 Deadlock Detective - React Web Application

## Automated Deadlock Detection Tool for Operating Systems

A modern, interactive web application for detecting and visualizing deadlocks in operating system processes using industry-standard algorithms.

[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF)](https://vitejs.dev/)
[![D3.js](https://img.shields.io/badge/D3.js-7.9-F9A03C)](https://d3js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Overview

**Deadlock Detective** is a web-based educational tool that helps students and developers understand **deadlock detection** in operating systems. It implements two industry-standard algorithms and provides interactive visualizations to make learning intuitive and engaging.

**Perfect for:**
- 🎓 Students learning Operating Systems
- 👨‍🏫 Educators teaching concurrency and synchronization
- 💻 Developers studying resource management
- 📚 Anyone interested in how computers handle process deadlocks

---

## 🎯 Problem Statement

> **"Develop a tool that automatically detects potential deadlocks in system processes. The tool should analyze process dependencies and resource allocation to identify circular wait conditions and suggest resolution strategies."**

### Solution Implemented

This web application:

1. ✅ **Analyzes** process dependencies and resource allocations
2. ✅ **Detects** deadlocks using two proven algorithms
3. ✅ **Visualizes** system state with interactive graphs
4. ✅ **Explains** detection process step-by-step
5. ✅ **Suggests** multiple recovery strategies

---

## ✨ Key Features

### 🔍 **Dual Detection Algorithms**

- **Matrix-Based Detection** - Uses Work/Finish vectors for multi-instance resources (O(n²×m))
- **Wait-For Graph (WFG)** - Uses cycle detection for single-instance resources (O(n²))
- Automatic algorithm selection based on system configuration

### 📊 **Interactive D3.js Visualization**

- Real-time graph rendering with smooth GSAP animations
- Color-coded nodes:
  - 🔵 **Blue** = Safe processes
  - 🔴 **Red** = Deadlocked processes
  - 🟣 **Purple** = Resources
- Animated edges:
  - **Green solid** → Allocations
  - **Yellow dashed** → Requests

### 📝 **Educational Traces**

- Complete step-by-step algorithm execution
- Shows Work vector updates (Matrix algorithm)
- Displays cycle detection process (WFG algorithm)
- Detailed explanations for learning

### 🔧 **Smart Recovery Strategies**

- **Process Termination**: Minimal sets to break deadlock
- **Resource Preemption**: Suggests which resources to reclaim
- **What-If Simulation**: Shows system state after recovery
- Multiple ranked options

### 💾 **5 Pre-loaded Sample Datasets**

1. **Circular Deadlock** - Classic 3-process circular wait
2. **Safe State** - Multi-instance resources, no deadlock
3. **Multi-Instance Deadlock** - Deadlock with multiple resource instances
4. **Partial Deadlock** - Some processes safe, others deadlocked
5. **Complex Safe State** - 5 processes with safe execution sequence

### 🎨 **Modern Web Interface**

- ✅ No installation required - runs in any modern browser
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Dark theme with clean, minimal aesthetics
- ✅ Editable allocation and request matrices
- ✅ JSON import/export for sharing scenarios
- ✅ GSAP-powered smooth animations (60fps)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool.git
cd OS-CA-Automated-Deadlock-Detection-Tool

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### First Usage

1. **Load a Sample**: Click "Circular Deadlock" button
2. **Analyze**: Click "🔍 Analyze for Deadlock"
3. **View Results**: See detection results and traces
4. **Explore Visualization**: Switch to "Visualization" tab
5. **Try Recovery**: Review suggested recovery strategies

---

## 📂 Project Structure

```
OS-CA-Automated-Deadlock-Detection-Tool/
├── src/
│   ├── algorithms/          # Core detection algorithms
│   │   ├── matrix.js        # Matrix-based detection (multi-instance)
│   │   ├── wfg.js          # Wait-For Graph detection (single-instance)
│   │   └── recovery.js      # Recovery strategy generation
│   │
│   ├── components/          # React UI components
│   │   ├── Header.jsx       # Application header
│   │   ├── InputTab.jsx     # Data entry interface
│   │   ├── VisualizationTab.jsx  # D3.js graph visualization
│   │   └── ResultsTab.jsx   # Results and traces display
│   │
│   ├── types/              # Data models
│   │   └── models.js        # SystemState, Process, Resource types
│   │
│   ├── utils/              # Utilities
│   │   └── samples.js       # Sample datasets & JSON I/O
│   │
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Entry point
│
├── test-data/              # Sample JSON files
│   ├── circular-deadlock.json
│   ├── safe-state-multi.json
│   └── ...
│
├── public/                 # Static assets
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README.md              # This file
```

---

## 🎓 Algorithms Explained

### Matrix-Based Detection Algorithm

**Best for:** Resources with **multiple instances** (e.g., 3 printers, 5 memory blocks)

**How it works:**
1. Initialize `Work = Available` and `Finish[i] = false` for all processes
2. Find a process `i` where `Finish[i] == false` and `Request[i] ≤ Work`
3. Mark `Finish[i] = true` and update `Work = Work + Allocation[i]`
4. Repeat until no more processes can finish
5. Any `Finish[i] == false` → Process `i` is deadlocked

**Time Complexity:** O(n² × m) where n = processes, m = resource types

### Wait-For Graph (WFG) Algorithm

**Best for:** Resources with **single instances** (e.g., 1 printer, 1 scanner)

**How it works:**
1. Build directed graph: `Pi → Pj` if Pi waits for a resource held by Pj
2. Detect cycles using Depth-First Search (DFS)
3. Any cycle found → Deadlock exists
4. Processes in cycles are deadlocked

**Time Complexity:** O(n²) where n = processes

---

## 🎮 Usage Guide

### Input Tab

**Load Sample Dataset:**
- Click any sample button to auto-populate data
- Perfect for learning and experimentation

**Edit System State:**
- **Resource Types Table**: Edit total instances per resource
- **Allocation Matrix**: Current resource holdings (who has what)
- **Request Matrix**: Resource requests (who wants what)

**Run Detection:**
- Click "🔍 Analyze for Deadlock" button
- Algorithm runs automatically
- Results appear in Results tab

**Import/Export:**
- Export current state as JSON
- Import saved scenarios
- Share configurations with others

### Visualization Tab

**Graph Elements:**
- **Circles** = Processes (P0, P1, ...) or Resources (R0, R1, ...)
- **Colors**:
  - Blue = Safe process
  - Red = Deadlocked process
  - Purple = Resource
- **Edges**:
  - Green solid arrow = Allocation (resource → process)
  - Yellow dashed arrow = Request (process → resource)

**Reading the Graph:**
- Follow arrows to see dependencies
- Circular patterns indicate deadlock
- Red nodes show deadlocked processes

### Results Tab

**Status Banner:**
- ✅ Green = System is safe
- 🚨 Red = Deadlock detected

**Detection Trace:**
- Step-by-step algorithm execution
- Shows all calculations and decisions
- Educational for understanding algorithms

**Recovery Strategies:**
- **Process Termination**: Which processes to kill
- **Resource Preemption**: Which resources to reclaim
- **Explanations**: Why each strategy works

---

## 📊 Example Scenarios

### Scenario 1: Circular Deadlock

```
P0: Has R0, Wants R1
P1: Has R1, Wants R2
P2: Has R2, Wants R0

Result: DEADLOCK (circular wait: P0 → P1 → P2 → P0)
```

### Scenario 2: Safe State

```
P0: Has [1,0], Wants [0,1], Can finish!
P1: Has [0,1], Wants [1,0], Waits...
P2: Has [0,0], Wants [0,0], Can finish!

Result: SAFE (execution order: P0 → P2 → P1)
```

---

## 🧪 Testing

### Manual Testing

```bash
# Start dev server
npm run dev

# Test each sample dataset
# Test matrix editing
# Test JSON import/export
# Test visualization rendering
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel deploy
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy to GitHub Pages

```bash
npm run build
# Push dist/ folder to gh-pages branch
```

---

## 💻 Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI framework | 19.2.0 |
| **Vite** | Build tool & dev server | 7.2.4 |
| **D3.js** | Graph visualization | 7.9.0 |
| **GSAP** | Animations | 3.13.0 |
| **JavaScript (ES6+)** | Programming language | Latest |
| **CSS3** | Styling | Latest |

---

## 📚 Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)** - Complete user manual with examples
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Technical documentation for developers
- **[QUICK_START.md](QUICK_START.md)** - Fast setup guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Project overview and achievements
- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Original project plan

---

## 🎯 Learning Outcomes

By using this tool, you will learn:

### Operating Systems Concepts
- ✅ Process and resource management
- ✅ Deadlock detection algorithms
- ✅ Safe vs. unsafe states
- ✅ Circular wait conditions
- ✅ Recovery strategies

### Algorithm Analysis
- ✅ Matrix-based detection (Banker's variant)
- ✅ Graph cycle detection (DFS)
- ✅ Time complexity analysis
- ✅ Algorithm selection criteria

### Software Development
- ✅ React component architecture
- ✅ State management patterns
- ✅ D3.js data visualization
- ✅ Modern JavaScript (ES6+)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

### Development Guidelines

- Use ES6+ JavaScript features
- Follow React best practices
- Add comments for complex logic
- Test thoroughly before committing
- Update documentation if needed

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** `npm install` fails
**Solution:** Ensure Node.js 18+ is installed. Try `npm cache clean --force`

**Issue:** Port 5173 already in use
**Solution:** Kill process on port or change in `vite.config.js`

**Issue:** Visualization not showing
**Solution:** Run analysis first on Input tab before viewing Visualization

**Issue:** JSON import fails
**Solution:** Ensure JSON follows correct schema (see `test-data/` examples)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Operating Systems Concepts** by Silberschatz, Galvin, and Gagne
- **Dijkstra's Banker's Algorithm** (1965)
- **React Documentation** - [https://react.dev/](https://react.dev/)
- **D3.js Documentation** - [https://d3js.org/](https://d3js.org/)

---

## 📞 Contact

- **Repository**: [https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool](https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool)
- **Issues**: [GitHub Issues](https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool/issues)

---

## 🎉 Project Status

✅ **Version 2.0** - Complete React web application  
✅ All algorithms implemented and tested  
✅ Interactive visualization with D3.js  
✅ Comprehensive documentation  
✅ Ready for educational use  

---

**Made with ❤️ for Operating Systems Education**

**Happy Deadlock Detecting! 🔍**
