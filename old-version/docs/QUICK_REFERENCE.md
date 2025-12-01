# 🚀 Quick Reference: Adding Python Prototype to GitHub

## 📋 TL;DR - Copy & Paste Commands

### 1️⃣ Clone Your Repository
```powershell
cd "C:\Users\karth\OneDrive\Desktop"
git clone https://github.com/SoumiryaSarangi/OS-CA-Automated-Deadlock-Detection-Tool.git
cd OS-CA-Automated-Deadlock-Detection-Tool
```

### 2️⃣ Create Folder Structure
```powershell
mkdir python-prototype
mkdir python-prototype\detectors
mkdir python-prototype\io_utils
mkdir python-prototype\strategies
mkdir python-prototype\ui
mkdir python-prototype\tests
mkdir python-prototype\docs
```

### 3️⃣ Copy All Files
```powershell
$source = "C:\Users\karth\OneDrive\Desktop\OS Project\trial-os-ca-termpaper"
$dest = ".\python-prototype"

# Main files
Copy-Item "$source\app.py" "$dest\"
Copy-Item "$source\models.py" "$dest\"
Copy-Item "$source\requirements.txt" "$dest\"
Copy-Item "$source\example_deadlock.json" "$dest\"
Copy-Item "$source\__init__.py" "$dest\"

# Folders
Copy-Item "$source\detectors\*" "$dest\detectors\" -Recurse
Copy-Item "$source\io_utils\*" "$dest\io_utils\" -Recurse
Copy-Item "$source\strategies\*" "$dest\strategies\" -Recurse
Copy-Item "$source\ui\*" "$dest\ui\" -Recurse
Copy-Item "$source\tests\*" "$dest\tests\" -Recurse

# Documentation
Copy-Item "$source\1_UNDERSTANDING_DEADLOCKS.md" "$dest\docs\"
Copy-Item "$source\2_PROBLEM_STATEMENT.md" "$dest\docs\"
Copy-Item "$source\3_DETECTION_ALGORITHMS.md" "$dest\docs\"
Copy-Item "$source\4_PROJECT_GUIDE.md" "$dest\docs\"
Copy-Item "$source\5_USER_GUIDE.md" "$dest\docs\"
Copy-Item "$source\INSTALL.md" "$dest\docs\"
Copy-Item "$source\TEST_REPORT.md" "$dest\docs\"
```

### 4️⃣ Add Python README
```powershell
Copy-Item "$source\PYTHON_PROTOTYPE_README.md" "$dest\README.md"
```

### 5️⃣ Create .gitignore for Python
```powershell
cd python-prototype
@"
__pycache__/
*.py[cod]
venv/
.pytest_cache/
.DS_Store
!example_deadlock.json
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
cd ..
```

### 6️⃣ Update Main README
Add this section to your main `README.md` (after "Project Status"):

```markdown
---

## 🐍 Python Desktop Prototype

**Alternative desktop implementation available!**

**📁 Location:** [`python-prototype/`](./python-prototype/)

### Quick Start (Python):
```bash
cd python-prototype
pip install -r requirements.txt
python app.py
```

**[Full Python Documentation →](./python-prototype/README.md)**

**Note:** For the best experience, use the React web application. The Python version is maintained as an offline desktop alternative.

---
```

### 7️⃣ Commit & Push
```powershell
git add python-prototype/
git add README.md
git commit -m "Add Python desktop prototype as alternative implementation"
git push origin main
```

## ✅ Done!

Your repository now has both versions:
- 🌐 React Web App (main)
- 🖥️ Python Desktop Prototype (alternative)

---

## 📝 What Got Added:

```
OS-CA-Automated-Deadlock-Detection-Tool/
├── python-prototype/          ← NEW
│   ├── README.md              ← NEW (Python-specific)
│   ├── .gitignore             ← NEW (Python-specific)
│   ├── app.py                 ← COPIED
│   ├── models.py              ← COPIED
│   ├── requirements.txt       ← COPIED
│   ├── detectors/             ← COPIED
│   ├── io_utils/              ← COPIED
│   ├── strategies/            ← COPIED
│   ├── ui/                    ← COPIED
│   ├── tests/                 ← COPIED
│   └── docs/                  ← COPIED (renamed folder)
└── README.md                  ← UPDATED (added Python section)
```

Everything else remains **UNCHANGED** ✅

---

## 🧪 Test It Works:

### React App:
```powershell
npm run dev
```

### Python App:
```powershell
cd python-prototype
python app.py
```

Both should work independently!

---

## 📞 Troubleshooting:

**Problem:** Git says files already tracked  
**Solution:** Run `git rm --cached -r python-prototype/` then re-add

**Problem:** Can't push to GitHub  
**Solution:** Make sure you have push permissions: `git remote -v`

**Problem:** React app broken  
**Solution:** The Python files are isolated. Run `npm install` again

---

**That's it! Your Python prototype is now part of your GitHub repo!** 🎉
