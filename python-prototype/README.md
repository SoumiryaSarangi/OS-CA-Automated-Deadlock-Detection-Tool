# 🔍 Deadlock Detective - Python Prototype (Desktop Application)

## 🏷️ Version Information
- **Type:** Desktop Application Prototype
- **Technology:** Python + PySide6 (Qt)
- **Status:** Legacy/Alternative Version
- **Purpose:** Educational reference and standalone desktop tool

---

## ⚠️ Important Note

**This is the original Python prototype** of the Deadlock Detective project. 

**👉 For the production web application, see the [main React version](../README.md) in the root directory.**

This Python version is maintained as:
- ✅ An alternative desktop application option
- ✅ A reference implementation for educational purposes
- ✅ A standalone tool that doesn't require a web browser

---

## 📖 What Is This?

This is a **desktop GUI application** built with Python and PySide6 that detects deadlocks in operating system processes. It was the initial prototype before the web-based React version was developed.

### Key Differences from React Version:

| Feature | Python Prototype | React Web App |
|---------|------------------|---------------|
| Platform | Desktop (Windows/Mac/Linux) | Web Browser |
| Installation | Requires Python + PySide6 | No installation (web-based) |
| Performance | Native desktop performance | Fast browser rendering |
| Portability | Requires local setup | Works anywhere with browser |
| UI Framework | PySide6 (Qt) | React + D3.js |
| Visualization | Static graph display | Interactive D3.js animations |

---

## ✨ Features

### 🔍 **Dual Detection Algorithms**
- **Wait-For Graph (WFG)** - For single-instance resources
- **Matrix Detection** - For multi-instance resources

### 📊 **Visual Graph Display**
- See processes and dependencies as a diagram
- Color-coded nodes (Red = Deadlock, Blue = Safe)
- Clear cycle highlighting

### 📝 **Step-by-Step Traces**
- Algorithm execution breakdown
- Educational explanations
- Complete calculation steps

### 🔧 **Recovery Strategies**
- Process termination suggestions
- Resource preemption options
- Multiple recovery paths

### 💾 **5 Sample Datasets**
- Pre-loaded example scenarios
- Both deadlock and safe states
- Editable for experimentation

### 🖥️ **Native Desktop Interface**
- No browser required
- Familiar desktop application feel
- Tables for data entry

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Install Dependencies

```bash
cd python-prototype
pip install -r requirements.txt
```

**Required packages:**
- `PySide6>=6.6.0` - Qt-based GUI framework
- `pytest>=7.4.0` - Testing framework (optional)
- `pytest-qt>=4.2.0` - Qt testing plugin (optional)

### Step 2: Run the Application

```bash
python app.py
```

### Step 3: Try It Out!

1. **Load a Sample**: Menu → Samples → "Single-Instance: Deadlock (Cycle)"
2. **Run Detection**: Click the "▶ Run Detection" button
3. **View Results**: See detection results and graph visualization
4. **Try Recovery**: Review suggested recovery strategies

---

## 📂 Project Structure

```
python-prototype/
│
├── 📄 Main Files
│   ├── app.py                  → Launch the application
│   ├── models.py               → Data structures (Process, Resource, State)
│   └── requirements.txt        → Python dependencies
│
├── 📁 detectors/              → Detection algorithms
│   ├── wfg.py                 → Wait-For Graph algorithm
│   └── matrix.py              → Matrix-based algorithm
│
├── 📁 io_utils/               → Data management
│   └── schema.py              → JSON I/O and sample datasets
│
├── 📁 strategies/             → Recovery solutions
│   └── recovery.py            → Generate recovery strategies
│
├── 📁 ui/                     → GUI components
│   ├── main_window.py         → Main application window
│   ├── input_tab.py           → Data entry interface
│   ├── graph_tab.py           → Graph visualization
│   └── results_tab.py         → Results display
│
├── 📁 tests/                  → Unit tests (33 tests)
│   ├── test_wfg.py            → Wait-For Graph tests
│   ├── test_matrix.py         → Matrix algorithm tests
│   ├── test_schema.py         → Data loading tests
│   └── test_edge_cases.py     → Edge case tests
│
└── 📁 Documentation/
    ├── 1_UNDERSTANDING_DEADLOCKS.md
    ├── 2_PROBLEM_STATEMENT.md
    ├── 3_DETECTION_ALGORITHMS.md
    ├── 4_PROJECT_GUIDE.md
    └── 5_USER_GUIDE.md
```

---

## 🧪 Testing

Run the comprehensive test suite (33 automated tests):

```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_wfg.py -v

# Run with coverage
python -m pytest tests/ --cov=detectors --cov=strategies
```

**Test Coverage:**
- ✅ Wait-For Graph detection (5 tests)
- ✅ Matrix detection (6 tests)
- ✅ Data schema validation (8 tests)
- ✅ Edge cases (14 tests)

**Status:** All 33 tests pass ✅

---

## 📚 Documentation

Comprehensive guides for learning:

1. **[1_UNDERSTANDING_DEADLOCKS.md](1_UNDERSTANDING_DEADLOCKS.md)** - Deadlock concepts explained simply
2. **[2_PROBLEM_STATEMENT.md](2_PROBLEM_STATEMENT.md)** - Project requirements breakdown
3. **[3_DETECTION_ALGORITHMS.md](3_DETECTION_ALGORITHMS.md)** - Algorithm mathematics
4. **[4_PROJECT_GUIDE.md](4_PROJECT_GUIDE.md)** - Code structure explained
5. **[5_USER_GUIDE.md](5_USER_GUIDE.md)** - Application usage guide

---

## 💻 System Requirements

### Minimum Requirements:
- **OS:** Windows 7+, macOS 10.12+, or Linux (Ubuntu 18.04+)
- **Python:** 3.8 or higher
- **RAM:** 512 MB
- **Display:** 1024x768 resolution

### Recommended:
- **Python:** 3.10+
- **RAM:** 2 GB
- **Display:** 1920x1080 resolution

---

## 🎯 Use Cases

### When to Use the Python Prototype:

✅ **Offline Use** - No internet connection required  
✅ **Desktop Preference** - Prefer native desktop applications  
✅ **Educational Labs** - Easy to install on lab computers  
✅ **Local Data** - Keep all data on local machine  
✅ **Learning Python/Qt** - Study Python GUI development  

### When to Use the React Web Version:

✅ **No Installation** - Just open a browser  
✅ **Cross-Platform** - Works on any device with a browser  
✅ **Better Visualization** - Interactive D3.js animations  
✅ **Easy Sharing** - Share via URL  
✅ **Modern UI** - Contemporary web interface  

---

## 🔧 Troubleshooting

### Application Won't Start

```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Module Import Errors

```bash
# Ensure you're in the python-prototype directory
cd python-prototype

# Install missing packages
pip install PySide6
```

### Qt Platform Plugin Error

```bash
# Windows: Install Visual C++ Redistributable
# Linux: Install Qt dependencies
sudo apt-get install libxcb-xinerama0

# macOS: Update Xcode command line tools
xcode-select --install
```

### Tests Fail

```bash
# Install test dependencies
pip install pytest pytest-qt

# Run tests with verbose output
python -m pytest tests/ -v -s
```

---

## 🚀 Development

### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool.git
cd OS-CA-Automated-Deadlock-Detection-Tool/python-prototype

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run application
python app.py
```

### Making Changes

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/python-prototype-enhancement`
3. **Make your changes** in the `python-prototype/` directory
4. **Run tests**: `python -m pytest tests/ -v`
5. **Commit**: `git commit -m "Python prototype: Add feature"`
6. **Push**: `git push origin feature/python-prototype-enhancement`
7. **Create Pull Request**

---

## 📊 Example Usage

### Input System State:

```
Processes: P0, P1, P2
Resources: R0, R1, R2 (each with 1 instance)

Allocation:
P0 holds R0
P1 holds R1
P2 holds R2

Requests:
P0 wants R1
P1 wants R2
P2 wants R0
```

### Detection Result:

```
Algorithm: Wait-For Graph (single-instance resources)
Result: DEADLOCK DETECTED

Cycle Found: P0 → P1 → P2 → P0
Deadlocked Processes: {P0, P1, P2}

Recovery Strategies:
1. Terminate P0 (breaks cycle at P0 → P1)
2. Terminate P1 (breaks cycle at P1 → P2)
3. Terminate P2 (breaks cycle at P2 → P0)
```

---

## 🎓 Learning Resources

### For Beginners:
- Start with [5_USER_GUIDE.md](5_USER_GUIDE.md) to learn how to use the app
- Read [1_UNDERSTANDING_DEADLOCKS.md](1_UNDERSTANDING_DEADLOCKS.md) for deadlock concepts
- Try the sample datasets to see different scenarios

### For Developers:
- Read [4_PROJECT_GUIDE.md](4_PROJECT_GUIDE.md) for code architecture
- Study [3_DETECTION_ALGORITHMS.md](3_DETECTION_ALGORITHMS.md) for algorithm details
- Explore the test files for implementation examples

---

## 🔗 Related Projects

- **Main Web Application**: [../README.md](../README.md) - React-based web version
- **Algorithm Documentation**: Shared with main project
- **Test Data**: Compatible JSON format with web version

---

## 📝 Version History

- **v1.0** - Initial Python prototype with PySide6
- **v1.1** - Added comprehensive testing suite
- **v1.2** - Enhanced documentation and user guides
- **v2.0** - React web version created (main project)

---

## ❓ FAQ

**Q: Should I use this or the React version?**  
A: Use the React web version for most cases. Use this if you need offline access or prefer desktop applications.

**Q: Can I convert my Python data to the React version?**  
A: Yes! Both use compatible JSON format. Export from Python, import to React.

**Q: Is this version still maintained?**  
A: It's stable and fully functional, but active development focuses on the React version.

**Q: Can I contribute to the Python version?**  
A: Yes! Bug fixes and improvements are welcome via pull requests.

---

## 💡 Credits

This Python prototype was developed as the initial implementation of the Deadlock Detective project before transitioning to the web-based React version.

**Contributors:**
- Algorithm implementation
- PySide6 GUI development
- Testing framework
- Documentation

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool/issues)
- **Main Project**: See root README.md
- **Documentation**: See docs/ folder

---

## 🎉 Summary

The Python prototype offers a **fully-functional desktop alternative** to the web application. It's perfect for:

✅ Offline environments  
✅ Desktop application preference  
✅ Educational labs and workshops  
✅ Learning Python GUI development  
✅ Local data privacy requirements  

**For the latest features and best experience, check out the [React web version](../README.md)!**

---

**Made with ❤️ for Operating Systems Education**

**Happy Deadlock Detecting! 🔍**
