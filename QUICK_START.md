# 🚀 Quick Start Guide - Deadlock Detective React

## Get Up and Running in 5 Minutes

This guide will help you set up and run the Deadlock Detective React application quickly.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

- A **modern web browser** (Chrome, Firefox, Edge, or Safari)

---

## Installation Steps

### 1. Navigate to the Project Directory

Open a terminal/command prompt and navigate to the project folder:

```bash
cd "c:\Users\ss\OneDrive\Desktop\OS project\deadlock-detective-react"
```

### 2. Install Dependencies

Install all required packages:

```bash
npm install
```

This will install:
- React 18
- TypeScript 5
- Vite
- GSAP (animation library)
- D3.js (visualization library)
- And other dependencies

**Expected time:** 30-60 seconds

### 3. Start the Development Server

Run the application in development mode:

```bash
npm run dev
```

You should see output similar to:

```
  VITE v7.2.4  ready in 481 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Open in Browser

Open your web browser and navigate to:

```
http://localhost:5173
```

🎉 **You're ready to use Deadlock Detective!**

---

## First Steps - Try It Out!

### Quick Tutorial (2 minutes)

1. **Load a Sample**
   - Click "Circular Deadlock" button
   - Tables will fill with data automatically

2. **Analyze**
   - Click the blue "🔍 Analyze for Deadlock" button
   - You'll see results immediately

3. **View Visualization**
   - Click the "Visualization" tab
   - See the interactive graph

4. **Check Results**
   - Click the "Results" tab
   - Read the detection trace
   - See recovery strategies

---

## Project Scripts

### Development

```bash
npm run dev        # Start development server (with hot reload)
```

### Production Build

```bash
npm run build      # Build optimized production version
npm run preview    # Preview the production build locally
```

### Linting

```bash
npm run lint       # Check code for errors
```

---

## Project Structure

```
deadlock-detective-react/
│
├── src/                    # Source code
│   ├── algorithms/         # Detection algorithms
│   ├── components/         # React UI components
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
│
├── public/                # Static assets
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
│
└── Documentation/
    ├── README.md          # Main documentation
    ├── USER_GUIDE.md      # Comprehensive user guide
    └── DEVELOPER_GUIDE.md # Technical documentation
```

---

## Common Issues & Solutions

### Port Already in Use

**Problem:** Port 5173 is already being used by another application

**Solution:**
```bash
# Kill the process using port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use a different port
npm run dev -- --port 3000
```

### Module Not Found Errors

**Problem:** Cannot find module '@gsap/react' or similar

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check tsconfig.json is present
# Try rebuilding
npm run build
```

---

## What's Included

### Features Available Out of the Box

✅ **5 Sample Datasets**
- Circular Deadlock
- Safe State
- Multi-Instance Deadlock
- Partial Deadlock
- Complex Safe State

✅ **2 Detection Algorithms**
- Matrix-Based (Banker's Algorithm)
- Wait-For Graph (Cycle Detection)

✅ **Interactive Visualization**
- D3.js powered graphs
- GSAP smooth animations
- Color-coded nodes and edges

✅ **Recovery Strategies**
- Process termination suggestions
- Resource preemption suggestions
- Detailed explanations

✅ **Data Management**
- Import/Export JSON
- Editable tables
- Real-time validation

---

## Next Steps

### Learn More

1. **Read the User Guide** - `USER_GUIDE.md`
   - Understand deadlocks
   - Learn how to use each feature
   - See detailed examples

2. **Read the Developer Guide** - `DEVELOPER_GUIDE.md`
   - Understand the codebase
   - Learn algorithm details
   - Contribute to the project

3. **Try All Samples**
   - Load each sample dataset
   - Compare different scenarios
   - Understand when deadlock occurs

### Customize

1. **Modify Sample Data**
   - Load a sample
   - Edit allocation/request matrices
   - See how results change

2. **Create Your Own Scenarios**
   - Start from a sample
   - Adjust numbers
   - Test your understanding

3. **Export and Share**
   - Export your configuration as JSON
   - Share with classmates
   - Compare results

---

## Getting Help

### Documentation

- **README.md** - Overview and features
- **USER_GUIDE.md** - Detailed usage instructions
- **DEVELOPER_GUIDE.md** - Technical details

### Troubleshooting

If you encounter issues:

1. Check the console for error messages (F12 in browser)
2. Verify all dependencies are installed (`npm install`)
3. Check Node.js version (`node --version` should be 18+)
4. Try clearing the browser cache
5. Restart the development server

---

## System Requirements

### Minimum Requirements

- **OS:** Windows 10/11, macOS 10.15+, or Linux
- **RAM:** 4 GB
- **Disk Space:** 500 MB for project + dependencies
- **Node.js:** Version 18.0 or higher
- **Browser:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

### Recommended Requirements

- **RAM:** 8 GB or more
- **Node.js:** Version 20.0 or higher
- **Browser:** Latest version of Chrome or Firefox

---

## Performance Tips

### For Smooth Experience

1. **Close Unnecessary Browser Tabs**
   - Frees up memory for animations

2. **Use Latest Browser Version**
   - Better performance and compatibility

3. **Run on Development Server**
   - Don't use production build for development

4. **Limit System Complexity**
   - Keep processes and resources < 10 for best visualization

---

## Keyboard Shortcuts

While using the application:

- **F12** - Open browser developer console (for debugging)
- **Ctrl+R** / **Cmd+R** - Refresh page
- **Ctrl+Shift+C** / **Cmd+Shift+C** - Inspect element

---

## What You Can Do

### Educational Use

✅ Learn deadlock detection algorithms  
✅ Visualize process and resource relationships  
✅ Understand recovery strategies  
✅ Practice with pre-made scenarios  
✅ Create custom test cases

### Academic Use

✅ Complete OS assignments  
✅ Prepare for exams  
✅ Demonstrate concepts in presentations  
✅ Research deadlock patterns  
✅ Compare algorithm efficiency

---

## License & Credits

**License:** MIT License

**Built With:**
- React + TypeScript
- Vite
- D3.js
- GSAP
- CSS3

**Based On:**
- Standard OS textbook algorithms
- Banker's Algorithm (Dijkstra, 1965)
- Wait-For Graph approach

---

## Support

For questions, issues, or contributions:

- Read the documentation files
- Check the troubleshooting section
- Review the code comments
- Experiment with the tool

---

**Happy Learning! 🎓**

**Start Exploring:** Load a sample → Click Analyze → See the magic happen! ✨
