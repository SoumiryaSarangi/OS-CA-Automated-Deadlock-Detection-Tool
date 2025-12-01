/**
 * Report Generator Module
 * Generates professional PDF reports for deadlock detection analysis
 * Includes graphs, traces, and recovery recommendations
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

/**
 * Generate a comprehensive PDF report
 * @param {Object} data - Report data
 * @param {Object} data.systemState - System state with processes, resources, matrices
 * @param {Object} data.detectionResult - Detection result with deadlock status, trace, recovery
 * @param {HTMLElement} data.visualizationElement - Optional visualization element to capture
 * @returns {Promise<void>} Downloads the generated PDF
 */
export async function generatePDFReport(data) {
  const { systemState, detectionResult, visualizationElement } = data;
  
  // Validate input data
  if (!systemState || !detectionResult) {
    throw new Error('Missing required data: systemState and detectionResult are required');
  }
  
  if (!systemState.processes || !systemState.resource_types) {
    throw new Error('Invalid systemState: processes and resource_types arrays are required');
  }
  
  if (!systemState.allocation || !systemState.request || !systemState.available) {
    throw new Error('Invalid systemState: allocation, request, and available arrays are required');
  }
  
  if (!detectionResult.trace || !Array.isArray(detectionResult.trace)) {
    throw new Error('Invalid detectionResult: trace array is required');
  }
  
  const doc = new jsPDF();
  
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Teal accent
  doc.text('Deadlock Detection Report', margin, yPosition);
  yPosition += 10;

  // Subtitle with timestamp
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  doc.text(`Generated: ${timestamp}`, margin, yPosition);
  yPosition += 15;

  // Executive Summary
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Executive Summary', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const status = detectionResult.deadlocked ? 'DEADLOCK DETECTED' : 'SYSTEM SAFE';
  const statusColor = detectionResult.deadlocked ? [220, 38, 38] : [16, 185, 129];
  doc.setTextColor(...statusColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`Status: ${status}`, margin, yPosition);
  yPosition += 7;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(`Algorithm: ${detectionResult.algorithm === 'wfg' ? 'Wait-For Graph' : 'Matrix-Based Detection'}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Processes: ${systemState.processes.length}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Resource Types: ${systemState.resource_types.length}`, margin, yPosition);
  yPosition += 15;

  // System Configuration
  checkPageBreak(60);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('System Configuration', margin, yPosition);
  yPosition += 10;

  // Resources Table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Resources', margin, yPosition);
  yPosition += 5;

  const resourcesData = systemState.resource_types.map((res, idx) => [
    `R${idx}`,
    res.name || `Resource ${idx}`,
    res.instances,
    systemState.available[idx]
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['ID', 'Name', 'Total Instances', 'Available']],
    body: resourcesData,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Allocation Matrix
  checkPageBreak(60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Allocation Matrix', margin, yPosition);
  yPosition += 5;

  const allocationHeaders = ['Process', ...systemState.resource_types.map((_, idx) => `R${idx}`)];
  const allocationData = systemState.processes.map((proc, pIdx) => [
    proc.name || `P${pIdx}`,
    ...systemState.allocation[pIdx]
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [allocationHeaders],
    body: allocationData,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
    margin: { left: margin, right: margin },
    styles: { fontSize: 9 }
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Request Matrix
  checkPageBreak(60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Request Matrix', margin, yPosition);
  yPosition += 5;

  const requestHeaders = ['Process', ...systemState.resource_types.map((_, idx) => `R${idx}`)];
  const requestData = systemState.processes.map((proc, pIdx) => [
    proc.name || `P${pIdx}`,
    ...systemState.request[pIdx]
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [requestHeaders],
    body: requestData,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
    margin: { left: margin, right: margin },
    styles: { fontSize: 9 }
  });

  yPosition = doc.lastAutoTable.finalY + 15;

  // Detection Trace
  checkPageBreak(40);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Detection Trace', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setFont('courier', 'normal');
  doc.setTextColor(60, 60, 60);
  
  detectionResult.trace.forEach((line) => {
    checkPageBreak(6);
    const wrappedLines = doc.splitTextToSize(line, contentWidth);
    wrappedLines.forEach((wrappedLine) => {
      doc.text(wrappedLine, margin, yPosition);
      yPosition += 5;
    });
  });

  yPosition += 10;

  // Add visualization if provided
  if (visualizationElement) {
    try {
      checkPageBreak(120);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('System Visualization', margin, yPosition);
      yPosition += 10;

      const canvas = await html2canvas(visualizationElement, {
        backgroundColor: '#ffffff',
        scale: 2
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (yPosition + imgHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;
    } catch (error) {
      console.error('Error capturing visualization:', error);
    }
  }

  // Recovery Strategies (if deadlock detected)
  if (detectionResult.deadlocked && detectionResult.recovery) {
    // Process Termination Strategies
    if (detectionResult.recovery.termination && detectionResult.recovery.termination.length > 0) {
      checkPageBreak(40);
      doc.addPage();
      yPosition = 20;
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Recovery Strategies: Process Termination', margin, yPosition);
      yPosition += 10;

      detectionResult.recovery.termination.forEach((strategy, idx) => {
        checkPageBreak(30);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text(`${idx + 1}. ${strategy.description}`, margin, yPosition);
        yPosition += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const explanationLines = strategy.explanation.split('\n');
        explanationLines.forEach((line) => {
          if (line.trim()) {
            checkPageBreak(6);
            const wrappedLines = doc.splitTextToSize(line, contentWidth);
            wrappedLines.forEach((wrappedLine) => {
              doc.text(wrappedLine, margin + 5, yPosition);
              yPosition += 5;
            });
          }
        });
        yPosition += 5;
      });
    }

    // Resource Preemption Strategies
    if (detectionResult.recovery.preemption && detectionResult.recovery.preemption.length > 0) {
      checkPageBreak(40);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Recovery Strategies: Resource Preemption', margin, yPosition);
      yPosition += 10;

      detectionResult.recovery.preemption.forEach((strategy, idx) => {
        checkPageBreak(30);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text(`${idx + 1}. ${strategy.description}`, margin, yPosition);
        yPosition += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const explanationLines = strategy.explanation.split('\n');
        explanationLines.forEach((line) => {
          if (line.trim()) {
            checkPageBreak(6);
            const wrappedLines = doc.splitTextToSize(line, contentWidth);
            wrappedLines.forEach((wrappedLine) => {
              doc.text(wrappedLine, margin + 5, yPosition);
              yPosition += 5;
            });
          }
        });
        yPosition += 5;
      });
    }
  }

  // Recommendations Section
  doc.addPage();
  yPosition = 20;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Recommendations', margin, yPosition);
  yPosition += 10;

  const recommendations = generateRecommendations(detectionResult, systemState);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  recommendations.forEach((rec, idx) => {
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`${idx + 1}. ${rec.title}`, margin, yPosition);
    yPosition += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    const wrappedLines = doc.splitTextToSize(rec.description, contentWidth);
    wrappedLines.forEach((line) => {
      checkPageBreak(5);
      doc.text(line, margin + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  });

  // Footer on last page
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Deadlock Detective - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const filename = `deadlock-report-${Date.now()}.pdf`;
  doc.save(filename);
}

/**
 * Generate intelligent recommendations based on analysis
 * @param {Object} detectionResult - Detection result
 * @param {Object} systemState - System state
 * @returns {Array} Array of recommendation objects
 */
function generateRecommendations(detectionResult, systemState) {
  const recommendations = [];

  if (detectionResult.deadlocked) {
    recommendations.push({
      title: 'Immediate Action Required',
      description: 'A deadlock has been detected in your system. Immediate intervention is required to restore system operation. Review the recovery strategies section for specific actions.'
    });

    recommendations.push({
      title: 'Implement Deadlock Prevention',
      description: 'Consider implementing the Banker\'s Algorithm or resource ordering to prevent future deadlocks. Ensure processes request resources in a predetermined order to avoid circular wait conditions.'
    });

    recommendations.push({
      title: 'Resource Allocation Policy',
      description: 'Review your resource allocation policy. Consider implementing timeouts for resource requests and establishing priority-based allocation schemes to minimize deadlock risks.'
    });

    recommendations.push({
      title: 'System Monitoring',
      description: 'Implement continuous monitoring to detect potential deadlock conditions early. Set up alerts for high resource contention and unusual wait times.'
    });
  } else {
    recommendations.push({
      title: 'System Status: Healthy',
      description: 'No deadlock detected. The system is operating normally with all processes able to complete their execution.'
    });

    recommendations.push({
      title: 'Preventive Measures',
      description: 'Continue monitoring resource utilization patterns. Maintain current resource allocation policies and consider implementing proactive deadlock avoidance strategies.'
    });

    recommendations.push({
      title: 'Capacity Planning',
      description: 'Review resource capacity periodically. Ensure sufficient resources are available to handle peak load conditions without creating contention scenarios.'
    });
  }

  // General recommendations
  recommendations.push({
    title: 'Documentation',
    description: 'Maintain detailed documentation of resource allocation policies, process priorities, and recovery procedures. This report should be archived for future reference and audit purposes.'
  });

  recommendations.push({
    title: 'Performance Optimization',
    description: 'Analyze resource utilization patterns to identify optimization opportunities. Consider resource pooling, load balancing, and process scheduling improvements.'
  });

  return recommendations;
}

/**
 * Export system data as JSON
 * @param {Object} data - Complete system and analysis data
 * @returns {void} Downloads JSON file
 */
export function exportJSON(data) {
  const jsonData = {
    timestamp: new Date().toISOString(),
    systemState: data.systemState,
    detectionResult: data.detectionResult,
    metadata: {
      version: '1.0',
      generator: 'Deadlock Detective',
      exportType: 'JSON'
    }
  };

  const dataStr = JSON.stringify(jsonData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `deadlock-data-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
