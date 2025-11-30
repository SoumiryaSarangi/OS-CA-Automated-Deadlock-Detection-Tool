import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SAMPLES } from '../utils/samples';
import { exportToJSON, importFromJSON, saveStateToLocalStorage, loadStateFromLocalStorage, clearStateFromLocalStorage } from '../utils/samples';
import { createEmptySystemState } from '../types/models';
import './InputTab.css';
import CreateProblemCard from './CreateProblemCard';
import AnimatedFolders from './AnimatedFolders';
import AnimatedCloudDownload from './AnimatedCloudDownload';
import AnimatedDelete from './AnimatedDelete';

export default function InputTab({
  systemState,
  setSystemState,
  onAnalyze,
}) {
  const containerRef = useRef(null);
  const [currentSample, setCurrentSample] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.card, .section');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const handleLoadSample = (sampleName) => {
    // If clicking the same sample, deselect it and reset to default state
    if (currentSample === sampleName) {
      setCurrentSample(null);
      setSystemState(createEmptySystemState());
      return;
    }
    
    const sample = SAMPLES[sampleName];
    if (sample) {
      setSystemState(sample);
      setCurrentSample(sampleName);
      gsap.from(containerRef.current, {
        scale: 0.98,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleExportJSON = () => {
    const json = exportToJSON(systemState);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-state.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const json = event.target?.result;
            const state = importFromJSON(json);
            setSystemState(state);
          } catch (error) {
            alert(`Error importing JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleSaveLocal = () => {
    const ok = saveStateToLocalStorage(systemState);
    if (ok) {
      gsap.from(containerRef.current, { opacity: 0.6, duration: 0.2 });
    }
  };

  const handleLoadLocal = () => {
    try {
      const state = loadStateFromLocalStorage();
      if (state) {
        setSystemState(state);
        setCurrentSample(null);
      } else {
        alert('No saved configuration found');
      }
    } catch (e) {
      alert('Failed to load saved configuration');
    }
  };

  const handleClearLocal = () => {
    clearStateFromLocalStorage();
  };

  const updateAllocation = (pid, rid, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;

    const newAllocation = systemState.allocation.map((row, i) =>
      i === pid ? row.map((val, j) => (j === rid ? numValue : val)) : row
    );

    // Update available resources
    const newAvailable = [...systemState.available];
    const oldValue = systemState.allocation[pid][rid];
    const diff = oldValue - numValue;
    newAvailable[rid] += diff;

    setSystemState({
      ...systemState,
      allocation: newAllocation,
      available: newAvailable,
    });
  };

  const updateRequest = (pid, rid, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;

    const newRequest = systemState.request.map((row, i) =>
      i === pid ? row.map((val, j) => (j === rid ? numValue : val)) : row
    );

    setSystemState({
      ...systemState,
      request: newRequest,
    });
  };

  const updateResourceInstances = (rid, value) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return;

    const newResourceTypes = systemState.resource_types.map((r, i) =>
      i === rid ? { ...r, instances: numValue } : r
    );

    // Recalculate available
    const allocated = systemState.allocation.reduce(
      (sum, row) => sum + row[rid],
      0
    );
    const newAvailable = [...systemState.available];
    newAvailable[rid] = numValue - allocated;

    setSystemState({
      ...systemState,
      resource_types: newResourceTypes,
      available: newAvailable,
    });
  };

  // Quick structure editing
  const addProcess = () => {
    const n = systemState.processes.length;
    const m = systemState.resource_types.length;

    const newProcesses = [...systemState.processes, { pid: n, name: `P${n}` }];
    const newAllocation = [...systemState.allocation, Array(m).fill(0)];
    const newRequest = [...systemState.request, Array(m).fill(0)];

    setSystemState({
      ...systemState,
      processes: newProcesses,
      allocation: newAllocation,
      request: newRequest,
    });
  };

  const removeLastProcess = () => {
    const n = systemState.processes.length;
    if (n <= 1) return;
    setSystemState({
      ...systemState,
      processes: systemState.processes.slice(0, -1),
      allocation: systemState.allocation.slice(0, -1),
      request: systemState.request.slice(0, -1),
    });
  };

  const addResource = () => {
    const m = systemState.resource_types.length;
    const newResource = { rid: m, name: `R${m}`, instances: 1 };
    const newResourceTypes = [...systemState.resource_types, newResource];
    const newAvailable = [...systemState.available, 1];
    const newAllocation = systemState.allocation.map((row) => [...row, 0]);
    const newRequest = systemState.request.map((row) => [...row, 0]);

    setSystemState({
      ...systemState,
      resource_types: newResourceTypes,
      available: newAvailable,
      allocation: newAllocation,
      request: newRequest,
    });
  };

  const removeLastResource = () => {
    const m = systemState.resource_types.length;
    if (m <= 1) return;
    setSystemState({
      ...systemState,
      resource_types: systemState.resource_types.slice(0, -1),
      available: systemState.available.slice(0, -1),
      allocation: systemState.allocation.map((row) => row.slice(0, -1)),
      request: systemState.request.map((row) => row.slice(0, -1)),
    });
  };

  return (
    <div ref={containerRef} className="input-tab">
      <div className="input-header">
        <div>
          <h2>System Configuration</h2>
          <p className="subtitle">Configure processes, resources, and their allocations</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleImportJSON}>
            📥 Import JSON
          </button>
          <button className="btn btn-secondary" onClick={handleExportJSON}>
            📤 Export JSON
          </button>
          <button className="btn btn-secondary" onClick={handleSaveLocal}>
            <AnimatedCloudDownload width={20} height={20} strokeWidth={2} stroke="currentColor" />
            Save Locally
          </button>
          <button className="btn btn-secondary" onClick={handleLoadLocal}>
            <AnimatedFolders width={20} height={20} strokeWidth={2} stroke="currentColor" />
            Load Saved
          </button>
          <button className="btn btn-secondary" onClick={handleClearLocal}>
            <AnimatedDelete width={20} height={20} strokeWidth={2} stroke="currentColor" />
            Clear Saved
          </button>
        </div>
      </div>

      {/* New: Create Problem from Scratch */}
      <CreateProblemCard
        setSystemState={setSystemState}
        onCreated={() => setCurrentSample(null)}
      />

      <div className="section card">
        <h3>Load Sample Dataset</h3>
        <div className="sample-buttons">
          {Object.keys(SAMPLES).map((name) => (
            <button
              key={name}
              className={`btn btn-secondary sample-btn ${currentSample === name ? 'active' : ''}`}
              onClick={() => handleLoadSample(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="section card">
        <h3>Detection Algorithm</h3>
        <div className="algorithm-info">
          <p className="info-text">
            <strong>Auto-Selected Algorithm:</strong>
            {' '}
            {systemState.resource_types.every(r => r.instances === 1) ? (
              <span className="algorithm-badge wfg">
                Wait-For Graph (WFG)
                <small> - All resources are single-instance</small>
              </span>
            ) : (
              <span className="algorithm-badge matrix">
                Matrix-Based Detection
                <small> - System has multi-instance resources</small>
              </span>
            )}
          </p>
          <p className="info-note">
            ℹ️ The system automatically selects the optimal algorithm based on your resource configuration.
          </p>
        </div>
      </div>

      <div className="section card">
        <h3>Resource Types</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Total Instances</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {systemState.resource_types.map((resource, i) => (
                <tr key={i}>
                  <td><strong>{resource.name}</strong></td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={resource.instances}
                      onChange={(e) => updateResourceInstances(i, e.target.value)}
                      className="table-input"
                    />
                  </td>
                  <td>{systemState.available[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section card">
        <h3>Allocation Matrix</h3>
        <p className="table-description">Resources currently held by each process</p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Process</th>
                {systemState.resource_types.map((r) => (
                  <th key={r.rid}>{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {systemState.processes.map((process) => (
                <tr key={process.pid}>
                  <td><strong>{process.name}</strong></td>
                  {systemState.resource_types.map((resource) => (
                    <td key={resource.rid}>
                      <input
                        type="number"
                        min="0"
                        value={systemState.allocation[process.pid][resource.rid]}
                        onChange={(e) =>
                          updateAllocation(process.pid, resource.rid, e.target.value)
                        }
                        className="table-input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section card">
        <h3>Request Matrix</h3>
        <p className="table-description">Additional resources requested by each process</p>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Process</th>
                {systemState.resource_types.map((r) => (
                  <th key={r.rid}>{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {systemState.processes.map((process) => (
                <tr key={process.pid}>
                  <td><strong>{process.name}</strong></td>
                  {systemState.resource_types.map((resource) => (
                    <td key={resource.rid}>
                      <input
                        type="number"
                        min="0"
                        value={systemState.request[process.pid][resource.rid]}
                        onChange={(e) =>
                          updateRequest(process.pid, resource.rid, e.target.value)
                        }
                        className="table-input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="analyze-section">
        <button className="btn btn-primary analyze-btn" onClick={onAnalyze}>
          🔍 Analyze for Deadlock
        </button>
      </div>
    </div>
  );
}
