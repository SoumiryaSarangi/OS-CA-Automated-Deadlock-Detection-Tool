/**
 * LaTeX Export Module
 * Generates LaTeX-formatted reports for academic and technical documentation
 * Includes proper mathematical notation for matrices and algorithms
 */

/**
 * Generate a complete LaTeX document
 * @param {Object} data - Report data
 * @param {Object} data.systemState - System state with processes, resources, matrices
 * @param {Object} data.detectionResult - Detection result with deadlock status, trace, recovery
 * @returns {void} Downloads the generated .tex file
 */
export function generateLatexReport(data) {
  const { systemState, detectionResult } = data;
  
  const latexContent = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{graphicx}
\\usepackage{listings}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage{booktabs}
\\usepackage{array}
\\usepackage{multicol}

% Custom colors
\\definecolor{accentcolor}{RGB}{16,185,129}
\\definecolor{codebackground}{RGB}{245,245,245}
\\definecolor{commentcolor}{RGB}{100,100,100}

% Code listing style
\\lstset{
  backgroundcolor=\\color{codebackground},
  basicstyle=\\ttfamily\\small,
  breaklines=true,
  commentstyle=\\color{commentcolor},
  frame=single,
  numbers=left,
  numberstyle=\\tiny\\color{commentcolor},
  keywordstyle=\\color{accentcolor}\\bfseries,
  stringstyle=\\color{blue}
}

% Title formatting
\\title{\\textbf{\\Huge Deadlock Detection Analysis Report}}
\\author{\\Large Deadlock Detective System}
\\date{\\large ${new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}}

\\begin{document}

\\maketitle

\\begin{abstract}
This report presents a comprehensive analysis of a multi-process resource allocation system for potential deadlock conditions. The analysis was conducted using ${detectionResult.algorithm === 'wfg' ? 'the Wait-For Graph algorithm' : 'matrix-based detection algorithms'} on a system with ${systemState.processes.length} processes and ${systemState.resources.length} resource types. \\textbf{Result: ${detectionResult.deadlocked ? 'DEADLOCK DETECTED' : 'SYSTEM SAFE'}}.
\\end{abstract}

\\tableofcontents
\\newpage

\\section{Executive Summary}

\\subsection{System Status}
${detectionResult.deadlocked ? 
  '\\textcolor{red}{\\textbf{DEADLOCK DETECTED}} - The system is in a deadlocked state requiring immediate intervention.' :
  '\\textcolor{accentcolor}{\\textbf{SYSTEM SAFE}} - All processes can complete successfully without deadlock.'}

\\subsection{Analysis Parameters}
\\begin{itemize}
  \\item \\textbf{Detection Algorithm:} ${detectionResult.algorithm === 'wfg' ? 'Wait-For Graph (WFG)' : 'Matrix-Based Detection'}
  \\item \\textbf{Number of Processes:} ${systemState.processes.length}
  \\item \\textbf{Number of Resource Types:} ${systemState.resources.length}
  \\item \\textbf{Analysis Timestamp:} ${new Date().toLocaleString()}
\\end{itemize}

\\section{System Configuration}

\\subsection{Resource Specification}

The system manages ${systemState.resources.length} distinct resource type${systemState.resources.length !== 1 ? 's' : ''}:

\\begin{table}[h]
\\centering
\\begin{tabular}{|l|l|c|c|}
\\hline
\\textbf{ID} & \\textbf{Name} & \\textbf{Total} & \\textbf{Available} \\\\
\\hline
${systemState.resources.map((res, idx) => 
  `$R_{${idx}}$ & ${escapeLaTeX(res.name || `Resource ${idx}`)} & ${res.totalInstances} & ${res.availableInstances} \\\\`
).join('\n')}
\\hline
\\end{tabular}
\\caption{Resource allocation table}
\\end{table}

Let $\\mathbf{E} = (E_0, E_1, \\ldots, E_{${systemState.resources.length - 1}})$ denote the total instances vector, where:
\\[ \\mathbf{E} = (${systemState.resources.map(r => r.totalInstances).join(', ')}) \\]

\\subsection{Process Specification}

The system contains ${systemState.processes.length} active process${systemState.processes.length !== 1 ? 'es' : ''}:

\\begin{itemize}
${systemState.processes.map((proc, idx) => 
  `  \\item $P_{${idx}}$: ${escapeLaTeX(proc.name || `Process ${idx}`)}`
).join('\n')}
\\end{itemize}

\\subsection{Allocation Matrix}

The \\textbf{Allocation Matrix} $\\mathbf{A}$ represents currently allocated resources, where $A_{ij}$ denotes the number of instances of resource $R_j$ allocated to process $P_i$:

\\[ \\mathbf{A} = ${generateLatexMatrix(systemState.allocationMatrix)} \\]

\\subsection{Request Matrix}

The \\textbf{Request Matrix} $\\mathbf{R}$ represents pending resource requests, where $R_{ij}$ denotes the number of instances of resource $R_j$ requested by process $P_i$:

\\[ \\mathbf{R} = ${generateLatexMatrix(systemState.requestMatrix)} \\]

\\subsection{Available Resources}

The \\textbf{Available Vector} $\\mathbf{V}$ represents currently available resource instances:

\\[ \\mathbf{V} = (${systemState.resources.map(r => r.availableInstances).join(', ')}) \\]

\\section{Detection Algorithm}

\\subsection{Algorithm Description}

${detectionResult.algorithm === 'wfg' ? generateWFGDescription() : generateMatrixDescription()}

\\subsection{Execution Trace}

The following trace details the step-by-step execution of the detection algorithm:

\\begin{lstlisting}[language={}]
${detectionResult.trace.join('\n')}
\\end{lstlisting}

${detectionResult.deadlocked ? generateDeadlockSection(detectionResult) : generateSafeSection()}

\\section{Mathematical Analysis}

\\subsection{Resource Conservation}

The system must satisfy the resource conservation principle:
\\[ \\sum_{i=0}^{${systemState.processes.length - 1}} A_{ij} + V_j = E_j \\quad \\forall j \\in \\{0, 1, \\ldots, ${systemState.resources.length - 1}\\} \\]

\\subsection{Deadlock Conditions}

A deadlock exists if and only if all four Coffman conditions are satisfied simultaneously:

\\begin{enumerate}
  \\item \\textbf{Mutual Exclusion:} Resources cannot be shared and must be held exclusively
  \\item \\textbf{Hold and Wait:} Processes hold allocated resources while waiting for additional resources
  \\item \\textbf{No Preemption:} Resources cannot be forcibly removed from processes
  \\item \\textbf{Circular Wait:} A circular chain of processes exists where each process waits for a resource held by the next process in the chain
\\end{enumerate}

${detectionResult.deadlocked ? 
  'In this system, all four conditions are satisfied, resulting in a deadlock state.' :
  'In this system, at least one condition is violated, preventing deadlock formation.'}

\\section{Recommendations}

\\subsection{Immediate Actions}

${generateLatexRecommendations(detectionResult, systemState)}

\\subsection{Long-term Strategies}

\\begin{itemize}
  \\item Implement the Banker's Algorithm for deadlock avoidance
  \\item Establish resource ordering protocols to prevent circular wait
  \\item Deploy continuous monitoring systems for early detection
  \\item Develop comprehensive testing procedures for resource allocation policies
  \\item Maintain detailed logs of resource allocation patterns for trend analysis
\\end{itemize}

\\section{Conclusion}

This analysis has ${detectionResult.deadlocked ? 'identified a deadlock condition' : 'confirmed the absence of deadlock'} in the examined system. ${detectionResult.deadlocked ? 'Immediate corrective action is required using one of the recovery strategies outlined in Section 5.' : 'The current resource allocation state is safe, and all processes can complete their execution successfully.'} Continued monitoring and adherence to deadlock prevention best practices are essential for maintaining system reliability.

\\appendix

\\section{Notation Reference}

\\begin{itemize}
  \\item $P_i$ - Process $i$ in the system
  \\item $R_j$ - Resource type $j$
  \\item $\\mathbf{A}$ - Allocation matrix
  \\item $\\mathbf{R}$ - Request matrix
  \\item $\\mathbf{E}$ - Total resource instances vector
  \\item $\\mathbf{V}$ - Available resource instances vector
  \\item $A_{ij}$ - Instances of $R_j$ allocated to $P_i$
  \\item $R_{ij}$ - Instances of $R_j$ requested by $P_i$
  \\item $E_j$ - Total instances of resource type $R_j$
  \\item $V_j$ - Available instances of resource type $R_j$
\\end{itemize}

\\section{References}

\\begin{enumerate}
  \\item Coffman, E. G., Elphick, M., \\& Shoshani, A. (1971). System deadlocks. \\textit{ACM Computing Surveys}, 3(2), 67-78.
  \\item Dijkstra, E. W. (1965). Solution of a problem in concurrent programming control. \\textit{Communications of the ACM}, 8(9), 569.
  \\item Silberschatz, A., Galvin, P. B., \\& Gagne, G. (2018). \\textit{Operating System Concepts} (10th ed.). Wiley.
  \\item Tanenbaum, A. S., \\& Bos, H. (2014). \\textit{Modern Operating Systems} (4th ed.). Pearson.
\\end{enumerate}

\\end{document}`;

  // Download the LaTeX file
  const blob = new Blob([latexContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `deadlock-report-${Date.now()}.tex`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate LaTeX matrix notation
 * @param {Array<Array<number>>} matrix - Matrix to format
 * @returns {string} LaTeX matrix string
 */
function generateLatexMatrix(matrix) {
  const rows = matrix.map(row => row.join(' & ')).join(' \\\\\n');
  return `\\begin{pmatrix}\n${rows}\n\\end{pmatrix}`;
}

/**
 * Escape special LaTeX characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeLaTeX(text) {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Generate Wait-For Graph algorithm description
 * @returns {string} LaTeX description
 */
function generateWFGDescription() {
  return `The \\textbf{Wait-For Graph (WFG)} algorithm constructs a directed graph where:
\\begin{itemize}
  \\item Each node represents a process $P_i$
  \\item A directed edge $P_i \\rightarrow P_j$ exists if process $P_i$ is waiting for a resource currently held by process $P_j$
  \\item A deadlock exists if and only if the graph contains a cycle
\\end{itemize}

The algorithm performs a depth-first search (DFS) to detect cycles in the wait-for graph. Time complexity is $O(n^2)$ where $n$ is the number of processes.`;
}

/**
 * Generate Matrix-Based algorithm description
 * @returns {string} LaTeX description
 */
function generateMatrixDescription() {
  return `The \\textbf{Matrix-Based Detection} algorithm uses the Allocation and Request matrices to determine if the system can satisfy all pending requests:

\\begin{enumerate}
  \\item Initialize a work vector $\\mathbf{W} = \\mathbf{V}$ (available resources)
  \\item Mark all processes as unfinished
  \\item Find an unfinished process $P_i$ such that $R_{ij} \\leq W_j$ for all $j$
  \\item If found, mark $P_i$ as finished and update $\\mathbf{W} = \\mathbf{W} + \\mathbf{A}_i$
  \\item Repeat steps 3-4 until no such process exists
  \\item If all processes are finished, the system is safe; otherwise, deadlock exists
\\end{enumerate}

Time complexity is $O(n \\times m)$ where $n$ is the number of processes and $m$ is the number of resource types.`;
}

/**
 * Generate deadlock-specific section
 * @param {Object} detectionResult - Detection result
 * @returns {string} LaTeX content
 */
function generateDeadlockSection(detectionResult) {
  let content = `\\section{Deadlock Analysis}

\\subsection{Deadlocked Processes}

The following processes are involved in the deadlock:

\\begin{itemize}
${extractDeadlockedProcesses(detectionResult.trace).map(p => `  \\item \\textbf{${p}}`).join('\n')}
\\end{itemize}

`;

  if (detectionResult.recovery) {
    content += `\\section{Recovery Strategies}

\\subsection{Process Termination}

${detectionResult.recovery.termination && detectionResult.recovery.termination.length > 0 ?
  detectionResult.recovery.termination.map((strategy, idx) => 
    `\\subsubsection{Strategy ${idx + 1}: ${escapeLaTeX(strategy.description)}}

${strategy.explanation.split('\n').map(line => line.trim()).filter(l => l).map(line => escapeLaTeX(line)).join('\n\n')}`
  ).join('\n\n') :
  'No termination strategies available.'}

\\subsection{Resource Preemption}

${detectionResult.recovery.preemption && detectionResult.recovery.preemption.length > 0 ?
  detectionResult.recovery.preemption.map((strategy, idx) => 
    `\\subsubsection{Strategy ${idx + 1}: ${escapeLaTeX(strategy.description)}}

${strategy.explanation.split('\n').map(line => line.trim()).filter(l => l).map(line => escapeLaTeX(line)).join('\n\n')}`
  ).join('\n\n') :
  'No preemption strategies available.'}
`;
  }

  return content;
}

/**
 * Generate safe system section
 * @returns {string} LaTeX content
 */
function generateSafeSection() {
  return `\\section{Safety Analysis}

The system has been determined to be in a \\textbf{safe state}. This means:

\\begin{itemize}
  \\item All processes can complete their execution with the available resources
  \\item No circular wait condition exists
  \\item The system can grant all pending resource requests in some order
  \\item Deadlock is guaranteed not to occur in the current state
\\end{itemize}

\\subsection{Safe Sequence}

A safe sequence of process execution exists, ensuring that each process can acquire its needed resources and complete. The detection trace in Section 4.2 shows the order in which processes can be satisfied.`;
}

/**
 * Generate LaTeX recommendations
 * @param {Object} detectionResult - Detection result
 * @param {Object} systemState - System state
 * @returns {string} LaTeX content
 */
function generateLatexRecommendations(detectionResult, systemState) {
  if (detectionResult.deadlocked) {
    return `\\begin{enumerate}
  \\item \\textbf{Critical:} Implement one of the recovery strategies outlined in Section 5 immediately
  \\item Review and revise resource allocation policies to prevent recurrence
  \\item Establish resource request timeouts to detect deadlock conditions earlier
  \\item Consider implementing the Banker's Algorithm for future deadlock avoidance
  \\item Deploy continuous monitoring systems for resource contention patterns
\\end{enumerate}`;
  } else {
    return `\\begin{enumerate}
  \\item Continue monitoring resource utilization patterns
  \\item Maintain current safe allocation practices
  \\item Consider proactive deadlock avoidance strategies for enhanced reliability
  \\item Document current resource allocation policies for future reference
  \\item Conduct periodic system audits to ensure continued safe operation
\\end{enumerate}`;
  }
}

/**
 * Extract deadlocked processes from trace
 * @param {Array<string>} trace - Detection trace
 * @returns {Array<string>} Process names
 */
function extractDeadlockedProcesses(trace) {
  const processes = new Set();
  const deadlockPattern = /P\d+/g;
  
  trace.forEach(line => {
    if (line.toLowerCase().includes('deadlock') || line.toLowerCase().includes('cycle')) {
      const matches = line.match(deadlockPattern);
      if (matches) {
        matches.forEach(p => processes.add(p));
      }
    }
  });
  
  return Array.from(processes).sort();
}
