# 🔍 Deadlock Detective - React Edition

> **Automated Deadlock Detection & Analysis Tool for Operating Systems**

A modern, interactive web application for detecting and analyzing deadlocks in simulated operating system processes. Built with React, TypeScript, D3.js, and GSAP for smooth, beautiful animations.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

### 🔍 **Dual Detection Algorithms**
- **Matrix-Based Detection** - For multi-instance resources (Banker's Algorithm variant)
- **Wait-For Graph (WFG)** - For single-instance resources with cycle detection

### 📊 **Interactive Visualization**
- Beautiful D3.js-powered graph visualization
- Color-coded nodes (Safe/Deadlocked processes, Resources)
- Animated edges showing allocation and request relationships
- Real-time updates with GSAP animations

### 📝 **Intuitive Data Entry**
- Editable tables for processes, resources, allocation, and request matrices
- Real-time validation and error checking
- JSON import/export for saving and sharing configurations

### 💾 **Pre-loaded Sample Datasets**
- **Circular Deadlock** - Classic 3-process circular wait
- **Safe State** - Multi-instance safe system
- **Multi-Instance Deadlock** - Complex multi-resource deadlock
- **Partial Deadlock** - Some processes deadlocked, others safe
- **Complex Safe State** - 5-process safe scenario

### 🔧 **Smart Recovery Strategies**
- **Process Termination** - Minimal set of processes to terminate
- **Resource Preemption** - Suggest which resources to preempt
- Step-by-step explanations for each strategy

### 🎨 **Beautiful, Minimal UI**
- Clean, dark-themed interface
- Smooth GSAP animations and transitions
- Fully responsive design (desktop, tablet, mobile)
- Accessible and user-friendly

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- A modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Navigate to the project directory:**

   ```bash
   cd deadlock-detective-react
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

---

## 📖 How to Use

### 1. **Input Tab - Configure Your System**

- **Load a Sample:** Click any sample button to load a pre-configured scenario
- **Edit Resources:** Modify total instances for each resource type
- **Edit Allocation Matrix:** Set how many resource instances each process currently holds
- **Edit Request Matrix:** Set how many additional resource instances each process needs
- **Choose Algorithm:** Select Matrix-Based (recommended) or Wait-For Graph
- **Click "Analyze for Deadlock"** to run detection

### 2. **Visualization Tab - See the Graph**

- View an interactive graph of your system
- **Blue circles** = Safe processes
- **Red circles** = Deadlocked processes
- **Purple circles** = Resources
- **Green solid arrows** = Allocation (Resource → Process)
- **Yellow dashed arrows** = Request (Process → Resource)

### 3. **Results Tab - Review Analysis**

- See if the system is **Safe** ✅ or **Deadlocked** 🚨
- Read the step-by-step detection trace
- Review recovery strategies if deadlock detected
- Understand which processes to terminate or which resources to preempt

---

## 🏗️ Project Structure

```
deadlock-detective-react/
│
├── src/
│   ├── algorithms/          # Detection & recovery algorithms
│   │   ├── wfg.ts           # Wait-For Graph detection
│   │   ├── matrix.ts        # Matrix-based detection
│   │   └── recovery.ts      # Recovery strategies
│   │
│   ├── components/          # React components
│   │   ├── Header.tsx       # App header
│   │   ├── InputTab.tsx     # Data entry interface
│   │   ├── VisualizationTab.tsx  # D3.js graph visualization
│   │   └── ResultsTab.tsx   # Detection results display
│   │
│   ├── types/              # TypeScript type definitions
│   │   └── models.ts       # Core data models
│   │
│   ├── utils/              # Utilities
│   │   └── samples.ts      # Sample datasets & JSON I/O
│   │
│   ├── App.tsx             # Main application component
│   ├── App.css             # App-level styles
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
│
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

---

## 🧠 Understanding the Algorithms

### Matrix-Based Detection (Banker's Algorithm)

**Best for:** Multi-instance resources

**How it works:**
1. Initialize `Work = Available` and `Finish[i] = False` for all processes
2. Find a process Pi where `Finish[i] == False` AND `Request[i] <= Work`
3. If found: Set `Finish[i] = True` and `Work = Work + Allocation[i]`
4. Repeat until no more processes can finish
5. Any process with `Finish[i] == False` is deadlocked

### Wait-For Graph (WFG) Detection

**Best for:** Single-instance resources

**How it works:**
1. Build a wait-for graph where each node is a process
2. Add edge `Pi → Pj` if Pi is waiting for a resource held by Pj
3. Use DFS to detect cycles in the graph
4. Any process in a cycle is deadlocked

---

## 🎯 Problem Statement

**Original Problem:**

> "Develop a tool that automatically detects potential deadlocks in system processes. The tool should analyze process dependencies and resource allocation to identify circular wait conditions and suggest resolution strategies."

**Our Solution:**

✅ Automated deadlock detection using two proven algorithms  
✅ Visual representation of process and resource relationships  
✅ Step-by-step algorithm execution traces  
✅ Intelligent recovery strategy suggestions  
✅ Interactive, user-friendly web interface  
✅ Sample datasets for learning and testing

---

## 🛠️ Technology Stack

- **React 18** - Modern UI library
- **TypeScript 5** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **D3.js** - Data-driven graph visualization
- **GSAP** - Professional-grade animation library
- **CSS3** - Custom styling with CSS variables

---

## 📚 Additional Documentation

- **USER_GUIDE.md** - Comprehensive user guide with examples
- **DEVELOPER_GUIDE.md** - Technical documentation for developers
- **ALGORITHM_GUIDE.md** - Deep dive into detection algorithms

---

## 🎓 Educational Value

This tool helps students understand:

- **Deadlock Conditions** - Mutual exclusion, hold and wait, no preemption, circular wait
- **Detection Algorithms** - Matrix-based vs graph-based approaches
- **Recovery Strategies** - Process termination vs resource preemption
- **System States** - Safe vs unsafe states

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

**Deadlock Detective Team**
- React/TypeScript web version (2024)
- Based on the original Python/PySide6 desktop application

---

## 🙏 Acknowledgments

- Based on standard OS textbook algorithms
- Inspired by operating systems courses worldwide
- Built for educational purposes

---

**Made with ❤️ for Operating Systems students and enthusiasts**
