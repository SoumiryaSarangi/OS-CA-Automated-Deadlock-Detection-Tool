# 🚀 Quick Start Guide - Deadlock Detective

Get up and running with Deadlock Detective in under 5 minutes!

---

## ⚡ Super Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool.git

# 2. Navigate to directory
cd OS-CA-Automated-Deadlock-Detection-Tool

# 3. Install dependencies
npm install

# 4. Start the app
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Done! 🎉

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** 18 or higher ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ Modern web browser (Chrome, Firefox, Edge, or Safari)
- ✅ Internet connection (for initial setup)

### Check Your Installation

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version
```

---

## 🎮 Your First Deadlock Detection

### Step 1: Load a Sample

1. Open the app in your browser
2. **Choose your theme** - Click the 🌓/☀️ toggle in top-right (Dark or Light mode)
3. You'll see the **Input Tab** by default with animated CPU icon
4. Click the **"Circular Deadlock"** button under "Load Sample Dataset"
5. Tables will auto-populate with data

### Step 2: Analyze

1. Click the big **"🔍 Analyze for Deadlock"** button
2. The app automatically:
   - Selects the right algorithm
   - Runs detection
   - Switches to Results tab

### Step 3: View Results

You'll see:
- 🚨 **Status Banner**: "Deadlock Detected"
- 📊 **Detection Trace**: Step-by-step analysis
- 💡 **Recovery Strategies**: How to fix it

### Step 4: Visualize

1. Click the **"Visualization"** tab (animated chart icon)
2. Watch the smooth page transition animation
3. See the interactive graph:
   - **Red circles** = Deadlocked processes
   - **Blue circles** = Safe processes
   - **Purple circles** = Resources
   - **Yellow dashed arrows** = Requests
   - **Green solid arrows** = Allocations
4. Drag nodes to rearrange the graph

---

## 📊 Understanding the Sample Datasets

### 1. Circular Deadlock (Classic) 🔴

**What it is:** 3 processes in a circular wait pattern

```
P0 → P1 → P2 → P0 (cycle!)
```

**Result:** DEADLOCK detected  
**Learn:** Classic deadlock scenario

### 2. Safe State 🟢

**What it is:** System with enough resources for all processes

**Result:** NO DEADLOCK  
**Learn:** What a safe execution sequence looks like

### 3. Multi-Instance Deadlock 🔴

**What it is:** Deadlock with resources having multiple instances

**Result:** DEADLOCK detected  
**Learn:** Matrix algorithm in action

### 4. Partial Deadlock 🟡

**What it is:** Some processes deadlocked, others safe

**Result:** PARTIAL DEADLOCK  
**Learn:** Not all processes must be deadlocked

### 5. Complex Safe State 🟢

**What it is:** 5 processes, complex but safe

**Result:** NO DEADLOCK  
**Learn:** Safe sequence with multiple processes

---

## 🎯 Try These Next

### Experiment 1: Break the Deadlock

1. Load "Circular Deadlock"
2. In **Allocation Matrix**, change P0's R0 from 1 to 0
3. Click "Analyze for Deadlock"
4. **Result**: No more deadlock!

### Experiment 2: Create a Deadlock

1. Load "Safe State"
2. In **Request Matrix**, increase some requests
3. Click "Analyze for Deadlock"
4. See if you created a deadlock!

### Experiment 3: Export & Import

1. Load any sample
2. Click **"Export JSON"** button
3. Modify the downloaded file
4. Click **"Import JSON"** to load it back

---

## 🛠️ Common Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🐛 Quick Troubleshooting

### Problem: `npm install` hangs

**Solution:**
```bash
npm cache clean --force
npm install
```

### Problem: Port 5173 is already in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.js
```

### Problem: Nothing shows in Visualization tab

**Solution:**
- You must run "Analyze for Deadlock" first!
- Detection must complete before visualization works

### Problem: JSON import fails

**Solution:**
- Check JSON format matches examples in `test-data/` folder
- Ensure all required fields are present
- Validate JSON syntax online

---

## 📱 Browser Compatibility

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |

---

## 🎓 Next Steps

Now that you're set up:

1. **Read the User Guide**: See [USER_GUIDE.md](USER_GUIDE.md) for detailed usage
2. **Try All Samples**: Understand different deadlock scenarios
3. **Read Algorithm Docs**: Learn how detection works
4. **Experiment**: Create your own scenarios

---

## 💡 Pro Tips

- 🌓 **Theme Toggle**: Switch between Dark/Light mode for eye comfort
- 🔥 **Hot Reload**: Changes to code auto-refresh browser
- 🎨 **DevTools**: Press F12 to see console logs
- 💾 **Save Often**: Export JSON or use browser storage
- 💭 **Hover Effects**: Watch animated icons on tab hover
- 💾 **Local Storage**: Click "Save Locally" for quick saves
- 📖 **Read Traces**: Understanding traces helps you learn algorithms

---

## 📞 Need Help?

- **Full User Guide**: [USER_GUIDE.md](USER_GUIDE.md)
- **Technical Docs**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- **GitHub Issues**: [Report a bug](https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool/issues)

---

## 🎉 You're Ready!

You now have a working Deadlock Detective installation. Start exploring and learning about deadlock detection!

**Happy Learning! 🔍**
