# Export & Reporting Features

## Overview

The Deadlock Detective now includes comprehensive export and reporting capabilities, allowing you to generate professional documentation of your deadlock analysis in multiple formats.

## Available Export Formats

### 📄 PDF Report (Professional)

**Best for:** Sharing with stakeholders, documentation, archival

**Features:**
- Executive summary with system status and metadata
- Detailed system configuration (resources, processes, matrices)
- Complete detection trace with step-by-step algorithm execution
- Visual representation of the system (if available)
- Recovery strategies with detailed explanations (for deadlocked systems)
- Intelligent recommendations based on analysis results
- Professional formatting with color-coded sections
- Multi-page support with automatic page breaks
- Footer with page numbers and branding

**Generated Content:**
1. Title page with timestamp
2. Executive Summary
3. System Configuration (Resources, Allocation Matrix, Request Matrix)
4. Detection Trace
5. System Visualization (if available)
6. Recovery Strategies (Process Termination & Resource Preemption)
7. Recommendations Section

### 📐 LaTeX Document (Academic)

**Best for:** Academic papers, technical documentation, research reports

**Features:**
- Complete LaTeX document ready for compilation
- Proper mathematical notation for matrices and algorithms
- Structured sections with table of contents
- Professional academic formatting
- Algorithm descriptions with complexity analysis
- Mathematical equations for resource conservation
- Coffman conditions explanation
- Bibliography with standard references
- Appendix with notation reference

**Generated Content:**
1. Abstract
2. Table of Contents
3. Executive Summary
4. System Configuration with LaTeX matrices
5. Process and Resource Specifications
6. Detection Algorithm Description
7. Mathematical Analysis (Resource Conservation, Deadlock Conditions)
8. Recovery Strategies (if applicable)
9. Recommendations
10. Appendices (Notation Reference, References)

**LaTeX Packages Used:**
- `amsmath`, `amssymb` - Mathematical notation
- `listings` - Code formatting
- `booktabs` - Professional tables
- `hyperref` - Hyperlinks
- `graphicx` - Graphics support

### 💾 JSON Data Export

**Best for:** Programmatic access, data analysis, system integration

**Features:**
- Complete system state in structured JSON format
- Detection results with full trace
- Metadata including timestamp and version
- Easy to parse and integrate with other tools
- No data loss - complete raw data

**Structure:**
```json
{
  "timestamp": "ISO-8601 datetime",
  "systemState": {
    "processes": [...],
    "resources": [...],
    "allocationMatrix": [...],
    "requestMatrix": [...]
  },
  "detectionResult": {
    "deadlocked": boolean,
    "algorithm": "string",
    "trace": [...],
    "recovery": {...}
  },
  "metadata": {
    "version": "1.0",
    "generator": "Deadlock Detective",
    "exportType": "JSON"
  }
}
```

## How to Use

1. **Run Analysis**: Complete a deadlock detection analysis first
2. **Navigate to Results**: Go to the Results tab
3. **Click Export**: Click the "Export Report" button in the status banner
4. **Select Format**: Choose your desired format from the dropdown:
   - PDF Report - Professional report with graphs
   - LaTeX Document - Academic format
   - JSON Data - Raw structured data
5. **Download**: The file will automatically download to your browser's default download location

## Export Button Location

The Export button is prominently displayed in the **Results Tab** within the status banner, making it easily accessible after any analysis.

## File Naming Convention

Generated files use timestamps to prevent overwrites:

- PDF: `deadlock-report-{timestamp}.pdf`
- LaTeX: `deadlock-report-{timestamp}.tex`
- JSON: `deadlock-data-{timestamp}.json`

## Compilation Instructions (LaTeX)

To compile the generated LaTeX document:

```bash
# Using pdflatex
pdflatex deadlock-report-{timestamp}.tex

# Using xelatex (for better Unicode support)
xelatex deadlock-report-{timestamp}.tex

# Using latexmk (automatic compilation)
latexmk -pdf deadlock-report-{timestamp}.tex
```

For best results, run the compilation twice to ensure proper cross-references and table of contents.

## Technical Details

### PDF Generation
- Library: **jsPDF** with **jsPDF-autoTable** plugin
- Visualization Capture: **html2canvas**
- Color Scheme: Matches application theme (teal accents)
- Page Size: A4
- Font: Helvetica (standard), Courier (code/trace)

### LaTeX Generation
- Document Class: `article` (12pt, A4)
- Math Support: Full AMS math packages
- Customizable colors and formatting
- Academic citation style

### JSON Export
- Format: Pretty-printed (2-space indentation)
- Character Encoding: UTF-8
- MIME Type: `application/json`

## Use Cases

### Professional Reporting
- Share analysis results with management
- Document system behavior for audits
- Create executive summaries for stakeholders

### Academic Research
- Include in research papers and theses
- Demonstrate deadlock detection algorithms
- Provide reproducible results

### System Integration
- Feed data into monitoring dashboards
- Automate report generation pipelines
- Archive historical analysis data

### Education
- Teaching materials for operating systems courses
- Student lab reports and assignments
- Visual aids for classroom presentations

## Recommendations Section

All reports include intelligent recommendations based on:
- Current system status (safe vs. deadlocked)
- System configuration and resource utilization
- Best practices for deadlock prevention and recovery
- Long-term strategies for system reliability

## Limitations

- PDF visualization capture requires the visualization to be rendered in the browser
- LaTeX documents require a LaTeX compiler to generate final PDFs
- Large traces may increase file size significantly
- Browser popup blockers may interfere with automatic downloads

## Future Enhancements

Potential improvements for future versions:
- Custom report templates
- Scheduled automatic exports
- Email delivery integration
- Cloud storage integration
- Comparative analysis reports (multiple runs)
- Custom branding and logos
- Multiple language support

## Troubleshooting

### Export Button Not Visible
- Ensure you've completed an analysis
- Navigate to the Results tab
- Check that detectionResult is not null

### PDF Download Fails
- Check browser popup blocker settings
- Ensure sufficient browser storage
- Try clearing browser cache

### LaTeX Compilation Errors
- Install required LaTeX packages
- Use UTF-8 encoding
- Check for special characters in process/resource names

### JSON File Cannot Be Parsed
- Verify file encoding is UTF-8
- Check for browser download corruption
- Re-export the data

## Support

For issues or feature requests related to the export functionality, please refer to the project repository or contact the development team.

---

**Version:** 1.0  
**Last Updated:** December 2025  
**Module Location:** `src/utils/reportGenerator.js`, `src/utils/latexExporter.js`, `src/components/ExportButton.jsx`
