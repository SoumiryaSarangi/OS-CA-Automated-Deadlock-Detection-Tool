# 🔍 Deadlock Detective - Python Desktop Prototype (Legacy Version)

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/downloads/)
[![PySide6](https://img.shields.io/badge/GUI-PySide6-green.svg)](https://doc.qt.io/qtforpython/)
[![Tests](https://img.shields.io/badge/tests-33%20passing-brightgreen.svg)](#testing)
[![License](https://img.shields.io/badge/license-Educational-orange.svg)](#license)

---

## ⚠️ Important Notice

**This is the original Python desktop prototype** of the Deadlock Detective project.

### 👉 Looking for the main project?

**The production web application is now built with React** and can be found in the root directory of this repository. 

- **Main Project (React)**: [See root README.md](../README.md)
- **Live Web App**: Interactive, browser-based, no installation required
- **This Version**: Legacy desktop application for reference and offline use

---

## 📖 About This Version

This Python prototype is the **original desktop implementation** built with Python and PySide6 (Qt). It was developed as the initial version before the project evolved into a modern React web application.

### Why This Version Exists:

✅ **Legacy Reference** - Original implementation for educational purposes  
✅ **Desktop Alternative** - Standalone desktop application option  
✅ **Offline Use** - No internet or web browser required  
✅ **Python Learning** - Study Python GUI development with Qt  
✅ **Historical Archive** - Shows project evolution  

### Version Status:

- **Status**: ✅ Fully functional and tested
- **Maintenance**: Stable, no active development
- **Use Case**: Alternative desktop option, educational reference
- **Main Development**: See React web version in root directory

---

## 🔄 Python Prototype vs React Web App

| Feature | Python Desktop (This) | React Web (Main) |
|---------|----------------------|------------------|
| **Platform** | Desktop (Win/Mac/Linux) | Any Web Browser |
| **Installation** | Python + PySide6 required | No installation needed |
| **Interface** | Native Qt desktop UI | Modern web interface |
| **Visualization** | Static graph display | Interactive D3.js animations |
| **Performance** | Native desktop speed | Fast browser rendering |
| **Accessibility** | Local machine only | Accessible anywhere online |
| **Updates** | Stable legacy version | Active development |
| **Best For** | Offline work, desktop preference | Modern UI, easy sharing |

---

## ✨ Features

### 🔍 Core Detection Algorithms
- **Wait-For Graph (WFG)** - Cycle detection for single-instance resources
- **Matrix-Based Detection** - Work-finish algorithm for multi-instance resources
- Automatic algorithm selection based on resource configuration

### 📊 Visual Graph Display
- Process dependency visualization
- Color-coded nodes:
  - 🔴 Red = Deadlocked processes
  - 🔵 Blue = Safe processes
  - 🟣 Purple = Resources
- Clear cycle highlighting

### 📝 Educational Step-by-Step Traces
- Complete algorithm execution breakdown
- Shows all intermediate calculations
- Detailed explanations for learning
- Work vector updates (Matrix algorithm)
- Cycle detection process (WFG algorithm)

### 🔧 Recovery Strategy Generation
- **Process Termination**: Which processes to kill
- **Resource Preemption**: Which resources to reclaim
- Multiple ranked recovery options
- Explanations for each strategy

### 💾 Sample Datasets (5 Built-in Scenarios)
1. **Single-Instance: Deadlock (Cycle)** - Classic circular wait
2. **Single-Instance: No Deadlock** - Safe state example
3. **Multi-Instance: Deadlock** - Multiple resource instances with deadlock
4. **Multi-Instance: No Deadlock** - Safe execution sequence
5. **Empty Template** - Blank scenario for custom testing

### 🖥️ Desktop GUI Features
- Native desktop application feel
- Editable allocation and request matrices
- JSON import/export for scenario sharing
- Three-tab interface (Input, Visualization, Results)
- Menu system with samples and file operations

---

## 🚀 Quick Start

### Prerequisites

- **Python**: 3.8 or higher ([Download Python](https://www.python.org/downloads/))
- **pip**: Python package manager (included with Python)
- **Operating System**: Windows 7+, macOS 10.12+, or Linux (Ubuntu 18.04+)

### Installation

#### Step 1: Navigate to this directory

```bash
cd python-prototype-legacy
```

#### Step 2: Install dependencies

```bash
pip install -r requirements.txt
```

**Required packages:**
- `PySide6>=6.6.0` - Qt6 GUI framework
- `pytest>=7.4.0` - Testing framework (optional)
- `pytest-qt>=4.2.0` - Qt testing utilities (optional)

#### Step 3: Run the application

```bash
python app.py
```

Or use the provided batch file (Windows):

```bash
run.bat
```

### First-Time Usage

1. **Load a Sample Dataset**
   - Click: `Samples` menu → `Single-Instance: Deadlock (Cycle)`
   
2. **Run Detection**
   - Click the `▶ Run Detection` button
   
3. **View Results**
   - Results tab shows: Deadlock status, trace, strategies
   
4. **Explore Visualization**
   - Visualization tab displays: Process-resource graph
   
5. **Try Other Samples**
   - Experiment with different scenarios from the Samples menu

---

## 📂 Project Structure

```
python-prototype-legacy/
│
├── 📄 Main Application Files
│   ├── app.py                    → 🚀 Launch point (run this!)
│   ├── models.py                 → 📊 Data structures (Process, Resource, SystemState)
│   ├── requirements.txt          → 📦 Python dependencies
│   ├── run.bat                   → ⚡ Windows quick-start batch file
│   ├── setup.bat                 → 🛠️ Windows setup script
│   ├── example_deadlock.json     → 📝 Example scenario file
│   └── validate_samples.py       → ✅ Sample validation script
│
├── 📁 detectors/                 → Detection Algorithms
│   ├── __init__.py
│   ├── wfg.py                    → Wait-For Graph algorithm
│   └── matrix.py                 → Matrix-based detection
│
├── 📁 io_utils/                  → Data Management
│   ├── __init__.py
│   └── schema.py                 → JSON I/O, sample datasets
│
├── 📁 strategies/                → Recovery Solutions
│   ├── __init__.py
│   └── recovery.py               → Strategy generation
│
├── 📁 ui/                        → GUI Components
│   ├── __init__.py
│   ├── main_window.py            → Main application window
│   ├── input_tab.py              → Data entry interface
│   ├── graph_tab.py              → Graph visualization
│   └── results_tab.py            → Results and strategies display
│
├── 📁 tests/                     → Unit Tests (33 tests)
│   ├── __init__.py
│   ├── test_wfg.py               → Wait-For Graph tests
│   ├── test_matrix.py            → Matrix algorithm tests
│   ├── test_schema.py            → Data loading tests
│   └── test_edge_cases.py        → Edge case coverage
│
└── 📁 docs/                      → Documentation
    ├── 1_UNDERSTANDING_DEADLOCKS.md       → Deadlock concepts
    ├── 2_PROBLEM_STATEMENT.md             → Project requirements
    ├── 3_DETECTION_ALGORITHMS.md          → Algorithm mathematics
    ├── 4_PROJECT_GUIDE.md                 → Code architecture
    ├── 5_USER_GUIDE.md                    → Usage instructions
    ├── INSTALL.md                         → Installation guide
    ├── TEST_REPORT.md                     → Testing documentation
    ├── INTEGRATION_GUIDE.md               → Integration notes
    ├── COMPLETE_CHECKLIST.md              → Feature checklist
    └── QUICK_REFERENCE.md                 → Quick reference guide
```

---

## 🧪 Testing

This prototype includes **33 comprehensive automated tests** with 100% pass rate.

### Run All Tests

```bash
python -m pytest tests/ -v
```

### Run Specific Test Suite

```bash
# Wait-For Graph algorithm tests
python -m pytest tests/test_wfg.py -v

# Matrix algorithm tests
python -m pytest tests/test_matrix.py -v

# Schema validation tests
python -m pytest tests/test_schema.py -v

# Edge case tests
python -m pytest tests/test_edge_cases.py -v
```

### Run with Coverage

```bash
python -m pytest tests/ --cov=detectors --cov=strategies --cov-report=html
```

### Test Coverage Breakdown

- ✅ **Wait-For Graph Detection** - 5 tests (cycle detection, edge cases)
- ✅ **Matrix-Based Detection** - 6 tests (work-finish algorithm)
- ✅ **Schema Validation** - 8 tests (JSON I/O, samples)
- ✅ **Edge Cases** - 14 tests (empty systems, invalid data, boundary conditions)

**Status**: All 33 tests passing ✅

---

## 📚 Comprehensive Documentation

This prototype includes **10 detailed documentation files** for learning:

### Getting Started
1. **[5_USER_GUIDE.md](docs/5_USER_GUIDE.md)** - Complete usage guide with screenshots
2. **[INSTALL.md](docs/INSTALL.md)** - Detailed installation instructions
3. **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick command reference

### Understanding Deadlocks
4. **[1_UNDERSTANDING_DEADLOCKS.md](docs/1_UNDERSTANDING_DEADLOCKS.md)** - Deadlock concepts explained
5. **[2_PROBLEM_STATEMENT.md](docs/2_PROBLEM_STATEMENT.md)** - Project requirements breakdown

### Technical Details
6. **[3_DETECTION_ALGORITHMS.md](docs/3_DETECTION_ALGORITHMS.md)** - Algorithm mathematics with examples
7. **[4_PROJECT_GUIDE.md](docs/4_PROJECT_GUIDE.md)** - Code architecture and design
8. **[TEST_REPORT.md](docs/TEST_REPORT.md)** - Testing methodology and results

### Advanced Topics
9. **[INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md)** - Integration with other systems
10. **[COMPLETE_CHECKLIST.md](docs/COMPLETE_CHECKLIST.md)** - Feature implementation status

---

## 🎯 Usage Examples

### Example 1: Classic Circular Deadlock

**Scenario Setup:**
```
Processes: P0, P1, P2
Resources: R0, R1, R2 (each has 1 instance)

Allocation (who has what):
P0 → R0
P1 → R1
P2 → R2

Requests (who wants what):
P0 wants R1 (held by P1)
P1 wants R2 (held by P2)
P2 wants R0 (held by P0)
```

**Detection Result:**
```
Algorithm: Wait-For Graph (single-instance resources)
Status: DEADLOCK DETECTED ⚠️

Cycle Found: P0 → P1 → P2 → P0
Deadlocked Processes: {P0, P1, P2}

Recovery Strategies:
1. Terminate P0 → Breaks cycle at P0 → P1
2. Terminate P1 → Breaks cycle at P1 → P2
3. Terminate P2 → Breaks cycle at P2 → P0
```

### Example 2: Safe State (No Deadlock)

**Scenario Setup:**
```
Processes: P0, P1, P2
Resources: R0, R1 (instances: [3, 3])

Available: [1, 1]

Allocation:
P0 has [1, 0]
P1 has [0, 1]
P2 has [1, 1]

Requests:
P0 wants [0, 1]
P1 wants [1, 0]
P2 wants [0, 0]
```

**Detection Result:**
```
Algorithm: Matrix-Based (multi-instance resources)
Status: SAFE STATE ✅

Safe Sequence: P2 → P0 → P1

Explanation:
Step 1: P2 can finish (needs [0,0], available [1,1])
        → Release [1,1], available becomes [2,2]
Step 2: P0 can finish (needs [0,1], available [2,2])
        → Release [1,0], available becomes [3,2]
Step 3: P1 can finish (needs [1,0], available [3,2])
        → All processes can complete!
```

---

## 🖥️ System Requirements

### Minimum Requirements
- **OS**: Windows 7, macOS 10.12, or Ubuntu 18.04
- **Python**: 3.8+
- **RAM**: 512 MB available
- **Storage**: 100 MB free space
- **Display**: 1024×768 resolution

### Recommended Requirements
- **OS**: Windows 10/11, macOS 11+, or Ubuntu 20.04+
- **Python**: 3.10+
- **RAM**: 2 GB available
- **Storage**: 500 MB free space
- **Display**: 1920×1080 resolution

### Platform-Specific Notes

#### Windows
- Works on Windows 7, 8, 10, 11
- Visual C++ Redistributable may be required
- Use `run.bat` for quick startup

#### macOS
- Requires macOS 10.12 (Sierra) or later
- May need Xcode Command Line Tools
- Install via: `xcode-select --install`

#### Linux
- Tested on Ubuntu, Debian, Fedora
- May require Qt dependencies:
  ```bash
  sudo apt-get install libxcb-xinerama0 libxcb-icccm4 libxcb-image0
  ```

---

## 💡 When to Use This Version

### ✅ Use Python Prototype If:
- You need **offline access** (no internet required)
- You prefer **native desktop applications**
- You're in an **educational lab** environment
- You want to **learn Python GUI development**
- You need **local data privacy** (no cloud/web)
- You're studying **Qt/PySide6 framework**

### 🌐 Use React Web Version If:
- You want **zero installation**
- You need **cross-platform accessibility** (any device)
- You prefer **modern web interfaces**
- You want **interactive D3.js visualizations**
- You need **easy sharing** (send URL)
- You want the **latest features** (active development)

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Application Won't Start

**Error:** `No module named 'PySide6'`

**Solution:**
```bash
# Install PySide6
pip install PySide6

# Or reinstall all dependencies
pip install -r requirements.txt
```

#### 2. Python Version Too Old

**Error:** `SyntaxError` or version-related errors

**Solution:**
```bash
# Check Python version
python --version

# Should be 3.8 or higher
# If not, download latest Python from python.org
```

#### 3. Qt Platform Plugin Error

**Error:** `qt.qpa.plugin: Could not find the Qt platform plugin`

**Windows Solution:**
```bash
# Install Visual C++ Redistributable
# Download from Microsoft website
```

**Linux Solution:**
```bash
# Install Qt dependencies
sudo apt-get update
sudo apt-get install libxcb-xinerama0 libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-render-util0
```

**macOS Solution:**
```bash
# Install/update Xcode Command Line Tools
xcode-select --install
```

#### 4. Tests Fail to Run

**Error:** `No module named 'pytest'`

**Solution:**
```bash
# Install test dependencies
pip install pytest pytest-qt

# Run tests again
python -m pytest tests/ -v
```

#### 5. Import Errors When Running

**Error:** `ModuleNotFoundError: No module named 'detectors'`

**Solution:**
```bash
# Ensure you're in the python-prototype-legacy directory
cd python-prototype-legacy

# Verify directory structure
ls -la

# Run from this directory
python app.py
```

---

## 🛠️ Development

### Setting Up Development Environment

```bash
# 1. Clone the repository
git clone https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool.git

# 2. Navigate to Python prototype
cd OS-CA-Automated-Deadlock-Detection-Tool/python-prototype-legacy

# 3. Create virtual environment (recommended)
python -m venv venv

# 4. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 5. Install dependencies
pip install -r requirements.txt

# 6. Run application
python app.py

# 7. Run tests (ensure everything works)
python -m pytest tests/ -v
```

### Code Structure Overview

#### Core Components

1. **Models (`models.py`)**
   - `Process`: Represents a system process
   - `ResourceType`: Represents a resource type
   - `SystemState`: Complete system state container

2. **Detectors (`detectors/`)**
   - `wfg.py`: Wait-For Graph cycle detection
   - `matrix.py`: Matrix-based work-finish algorithm

3. **Strategies (`strategies/`)**
   - `recovery.py`: Recovery strategy generation

4. **UI (`ui/`)**
   - `main_window.py`: Main Qt window
   - `input_tab.py`: Data entry interface
   - `graph_tab.py`: Visualization display
   - `results_tab.py`: Results presentation

5. **I/O (`io_utils/`)**
   - `schema.py`: JSON serialization, sample datasets

### Contributing to Python Prototype

While main development focuses on the React version, contributions to the Python prototype are welcome:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/python-proto-enhancement`
3. **Make changes** in `python-prototype-legacy/` directory only
4. **Run tests**: `python -m pytest tests/ -v` (must pass)
5. **Commit**: `git commit -m "Python prototype: Description"`
6. **Push**: `git push origin feature/python-proto-enhancement`
7. **Create Pull Request** with clear description

#### Contribution Guidelines
- Changes should only affect `python-prototype-legacy/` directory
- All 33 tests must pass
- Add tests for new features
- Update documentation if needed
- Follow existing code style
- Do not modify React app files

---

## 📊 Technical Specifications

### Algorithms Implemented

#### 1. Wait-For Graph (WFG) Algorithm
- **Time Complexity**: O(n²) where n = number of processes
- **Space Complexity**: O(n²) for adjacency matrix
- **Best For**: Single-instance resources
- **Method**: Depth-First Search (DFS) cycle detection

#### 2. Matrix-Based Detection Algorithm
- **Time Complexity**: O(n² × m) where n = processes, m = resource types
- **Space Complexity**: O(n × m) for matrices
- **Best For**: Multi-instance resources
- **Method**: Work-Finish algorithm (variant of Banker's)

### Data Structures
- **Graph Representation**: Adjacency matrix for WFG
- **Matrix Representation**: 2D arrays for allocation/request
- **Process State**: Enum (RUNNING, SAFE, DEADLOCKED)

### File Formats
- **Input/Output**: JSON
- **Schema Version**: 1.0
- **Compatibility**: Cross-compatible with React version

---

## 🎓 Learning Resources

### For Students
- ✅ Complete working implementation of deadlock detection
- ✅ Visual demonstration of algorithm execution
- ✅ Practice with real scenarios
- ✅ Understand OS resource management
- ✅ Learn Python GUI development

### For Educators
- ✅ Teaching tool for operating systems courses
- ✅ Demonstration of cycle detection algorithms
- ✅ Safe experimentation environment
- ✅ Customizable test scenarios
- ✅ Step-by-step execution traces

### Recommended Learning Path

**For Beginners:**
1. Read [1_UNDERSTANDING_DEADLOCKS.md](docs/1_UNDERSTANDING_DEADLOCKS.md)
2. Try the application with samples
3. Read [5_USER_GUIDE.md](docs/5_USER_GUIDE.md)
4. Experiment with custom scenarios
5. Read [3_DETECTION_ALGORITHMS.md](docs/3_DETECTION_ALGORITHMS.md)

**For Developers:**
1. Read [4_PROJECT_GUIDE.md](docs/4_PROJECT_GUIDE.md)
2. Explore the codebase
3. Run and study the tests
4. Modify and extend features
5. Read [INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md)

---

## 🔗 Related Resources

### Main Project
- **React Web Application**: [Root README.md](../README.md)
- **Live Demo**: Check main project for deployment URL
- **GitHub Repository**: [SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool](https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool)

### Documentation
- All documentation files are shared between versions
- Algorithm explanations apply to both implementations
- JSON format is cross-compatible

### External References
- [Operating System Concepts (Silberschatz, Galvin, Gagne)](https://www.os-book.com/)
- [PySide6 Documentation](https://doc.qt.io/qtforpython/)
- [Python unittest Documentation](https://docs.python.org/3/library/unittest.html)

---

## 📝 Version History

### Version 1.0 (Initial Release)
- ✅ Wait-For Graph algorithm implementation
- ✅ Matrix-based detection algorithm
- ✅ PySide6 GUI with 3-tab interface
- ✅ 5 sample datasets

### Version 1.1 (Testing & Documentation)
- ✅ Comprehensive test suite (33 tests)
- ✅ Detailed documentation (10 guides)
- ✅ Recovery strategy generation
- ✅ JSON import/export

### Version 1.2 (Polish & Refinement)
- ✅ Enhanced UI/UX
- ✅ Edge case handling
- ✅ Validation scripts
- ✅ Batch file helpers

### Version 2.0 (React Migration - Main Project)
- 🌐 React web application created (root directory)
- 🎨 Modern web interface with D3.js
- 🚀 Active development shifted to web version
- 📦 Python version moved to `python-prototype-legacy/`

**Current Status:** Python version is stable and fully functional as legacy reference

---

## 🤝 Contributing

### Areas for Contribution
- 🐛 Bug fixes and issue resolution
- 📝 Documentation improvements
- ✨ UI/UX enhancements
- 🧪 Additional test cases
- 🌍 Internationalization (i18n)

### How to Contribute
1. Check [GitHub Issues](https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool/issues)
2. Fork the repository
3. Create a feature branch
4. Make your changes (Python prototype only)
5. Ensure tests pass
6. Submit a pull request

---

## 📜 License

This project is developed for **educational purposes** as part of an Operating Systems course.

- **Institution**: Lovely Professional University
- **Course**: CSE 316 - Operating Systems
- **Type**: Academic Project (Task-2)

Free to use for educational and learning purposes.

---

## 📞 Support & Contact

### Get Help
- **Issues**: [GitHub Issues](https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool/issues)
- **Documentation**: See `docs/` folder
- **Main Project**: Check root README.md

### Team
- **Soumirya Sarangi** - Team Lead & Algorithm Implementation
- **Arkja** - UI/UX Development & Documentation  
- **Karthiksai Kumaraguru** - Visualization & Testing

### Institution
- **University**: Lovely Professional University
- **School**: Computer Science and Engineering
- **Course**: CSE 316 - Operating Systems
- **Term**: 25261

---

## 🎉 Summary

The **Python Desktop Prototype** is a **fully-functional legacy version** of the Deadlock Detective project, offering:

✅ **Complete deadlock detection implementation**  
✅ **Native desktop application experience**  
✅ **Offline operation capability**  
✅ **Comprehensive testing (33 tests)**  
✅ **Extensive documentation (10 guides)**  
✅ **Educational value for OS learning**  

### Quick Decision Guide

| Need | Use This Version | Use React Version |
|------|------------------|-------------------|
| Offline work | ✅ Yes | ❌ No |
| Web browser access | ❌ No | ✅ Yes |
| Desktop app | ✅ Yes | ❌ No |
| Latest features | ❌ No | ✅ Yes |
| Learning Python/Qt | ✅ Yes | ❌ No |
| Modern UI | ❌ No | ✅ Yes |

### Next Steps

1. **Try the Python prototype**: Run `python app.py`
2. **Explore the main project**: Check `../README.md`
3. **Read the docs**: Start with user guide
4. **Experiment**: Try custom scenarios
5. **Learn**: Study the algorithms and code

---

**Made with ❤️ for Operating Systems Education**

**For the latest features and modern interface, check out the [React Web Application](../README.md)!**

**Happy Deadlock Detecting! 🔍**
