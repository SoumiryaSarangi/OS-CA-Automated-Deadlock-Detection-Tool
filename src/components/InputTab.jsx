import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SAMPLES } from '../utils/samples';
import { exportToJSON, importFromJSON } from '../utils/samples';
import './InputTab.css';

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
        </div>
      </div>

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
