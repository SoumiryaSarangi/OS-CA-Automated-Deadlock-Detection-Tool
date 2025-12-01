import { useState } from 'react';
import { generatePDFReport } from '../utils/reportGenerator';
import './ExportButton.css';

export default function ExportButton({ systemState, detectionResult }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    // Validate data before exporting
    if (!systemState || !detectionResult) {
      alert('Cannot export: No analysis data available. Please run an analysis first.');
      return;
    }

    setIsExporting(true);

    try {
      const data = {
        systemState,
        detectionResult
      };

      // Try to capture visualization element if available
      const vizElement = document.querySelector('.visualization-container svg');
      if (vizElement) {
        data.visualizationElement = vizElement;
      }
      
      await generatePDFReport(data);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className="export-button"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <span className="spinner"></span>
          Generating PDF...
        </>
      ) : (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 12L3 7L4.4 5.6L7 8.2V0H9V8.2L11.6 5.6L13 7L8 12Z"
              fill="currentColor"
            />
            <path
              d="M14 14H2V9H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V9H14V14Z"
              fill="currentColor"
            />
          </svg>
          Export PDF Report
        </>
      )}
    </button>
  );
}
