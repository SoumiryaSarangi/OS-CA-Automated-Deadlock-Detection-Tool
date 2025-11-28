import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { validateSystemState } from '../types/models';

export default function CreateProblemCard({ setSystemState, onCreated }) {
  const [numProcesses, setNumProcesses] = useState(3);
  const [numResources, setNumResources] = useState(3);
  const [processNames, setProcessNames] = useState(['P0', 'P1', 'P2']);
  const [resourceNames, setResourceNames] = useState(['R0', 'R1', 'R2']);
  const [instances, setInstances] = useState([1, 1, 1]);
  const [error, setError] = useState('');

  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  // Ensure arrays match counts
  useEffect(() => {
    setProcessNames((prev) =>
      Array.from({ length: numProcesses }, (_, i) => prev[i] ?? `P${i}`)
    );
  }, [numProcesses]);

  useEffect(() => {
    setResourceNames((prev) =>
      Array.from({ length: numResources }, (_, i) => prev[i] ?? `R${i}`)
    );
    setInstances((prev) =>
      Array.from({ length: numResources }, (_, i) =>
        Number.isFinite(prev[i]) ? prev[i] : 1
      )
    );
  }, [numResources]);

  const handleCreate = () => {
    try {
      setError('');

      // Build processes and resource types
      const processes = Array.from({ length: numProcesses }, (_, i) => ({
        pid: i,
        name: (processNames[i] ?? `P${i}`).trim() || `P${i}`,
      }));

      const resource_types = Array.from({ length: numResources }, (_, j) => ({
        rid: j,
        name: (resourceNames[j] ?? `R${j}`).trim() || `R${j}`,
        instances: Math.max(0, parseInt(instances[j]) || 0),
      }));

      // Zero matrices; available equals total instances (since nothing allocated)
      const allocation = Array.from({ length: numProcesses }, () =>
        Array(numResources).fill(0)
      );
      const request = Array.from({ length: numProcesses }, () =>
        Array(numResources).fill(0)
      );
      const available = resource_types.map((r) => r.instances);

      const state = { processes, resource_types, allocation, request, available };

      validateSystemState(state);
      setSystemState(state);
      if (onCreated) onCreated();

      if (cardRef.current) {
        gsap.from(cardRef.current, { scale: 0.98, duration: 0.25, ease: 'power2.out' });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid configuration');
    }
  };

  return (
    <div ref={cardRef} className="section card">
      <h3>Create New Problem</h3>
      <p className="table-description">
        Define processes and resources from scratch.
        <br />
        Tip: After creating, use the Allocation and Request tables below to configure holdings and needs.
      </p>

      <div className="create-grid">
        <div className="grid-row">
          <div className="grid-col">
            <label>Number of Processes</label>
            <input
              type="number"
              min="1"
              value={numProcesses}
              onChange={(e) => setNumProcesses(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div className="grid-col">
            <label>Number of Resource Types</label>
            <input
              type="number"
              min="1"
              value={numResources}
              onChange={(e) => setNumResources(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>

        <div className="grid-section">
          <h4>Process Names</h4>
          <div className="list-grid">
            {Array.from({ length: numProcesses }, (_, i) => (
              <div key={i} className="list-item">
                <span className="badge">P{i}</span>
                <input
                  type="text"
                  value={processNames[i] ?? ''}
                  onChange={(e) =>
                    setProcessNames((prev) => {
                      const next = [...prev];
                      next[i] = e.target.value;
                      return next;
                    })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid-section">
          <h4>Resource Types</h4>
          <div className="list-grid">
            {Array.from({ length: numResources }, (_, j) => (
              <div key={j} className="list-item">
                <span className="badge">R{j}</span>
                <input
                  type="text"
                  placeholder={`Name for R${j}`}
                  value={resourceNames[j] ?? ''}
                  onChange={(e) =>
                    setResourceNames((prev) => {
                      const next = [...prev];
                      next[j] = e.target.value;
                      return next;
                    })
                  }
                />
                <input
                  type="number"
                  min="0"
                  className="instances-input"
                  value={instances[j] ?? 0}
                  onChange={(e) =>
                    setInstances((prev) => {
                      const next = [...prev];
                      next[j] = Math.max(0, parseInt(e.target.value) || 0);
                      return next;
                    })
                  }
                />
                <span className="muted">instances</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && <p style={{ color: 'var(--accent-danger)', marginTop: '0.5rem' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={handleCreate}>➕ Create Problem</button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            // Reset to default values
            setNumProcesses(3);
            setNumResources(3);
            setProcessNames(['P0', 'P1', 'P2']);
            setResourceNames(['R0', 'R1', 'R2']);
            setInstances([1, 1, 1]);
            setError('');
          }}
        >
          ♻️ Reset Fields
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setNumProcesses((n) => n + 1);
          }}
        >
          ➕ Add Process
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setNumResources((r) => r + 1);
          }}
        >
          ➕ Add Resource
        </button>
      </div>
    </div>
  );
}
