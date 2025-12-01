import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ExportButton from './ExportButton';
import './ResultsTab.css';

export default function ResultsTab({ systemState, detectionResult }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.card, .status-banner');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const { deadlocked, trace, recovery, algorithm } = detectionResult;

  return (
    <div ref={containerRef} className="results-tab">
      <div className={`status-banner ${deadlocked ? 'deadlock' : 'safe'}`}>
        <div className="status-icon">
          {deadlocked ? '🚨' : '✅'}
        </div>
        <div className="status-content">
          <h2 className="status-title">
            {deadlocked ? 'Deadlock Detected' : 'System is Safe'}
          </h2>
          <p className="status-description">
            {deadlocked
              ? 'The system is in a deadlocked state. See recovery strategies below.'
              : 'All processes can complete successfully. No deadlock detected.'}
          </p>
          <div className="status-meta">
            Algorithm used: <strong>{algorithm === 'wfg' ? 'Wait-For Graph' : 'Matrix-Based Detection'}</strong>
          </div>
        </div>
        <div className="status-actions">
          <ExportButton 
            systemState={systemState}
            detectionResult={detectionResult}
          />
        </div>
      </div>

      <div className="section card">
        <h3>Detection Trace</h3>
        <div className="trace-container">
          {trace.map((line, idx) => (
            <div key={idx} className="trace-line">
              {line}
            </div>
          ))}
        </div>
      </div>

      {deadlocked && recovery && (
        <>
          <div className="section card">
            <h3>💡 Recovery Strategies: Process Termination</h3>
            {recovery.termination.length > 0 ? (
              <div className="strategies">
                {recovery.termination.map((strategy, idx) => (
                  <div key={idx} className="strategy-item">
                    <div className="strategy-header">
                      <span className="strategy-number">{idx + 1}</span>
                      <strong>{strategy.description}</strong>
                    </div>
                    <div className="strategy-explanation">
                      {strategy.explanation.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-strategies">No termination strategies available.</p>
            )}
          </div>

          <div className="section card">
            <h3>🔄 Recovery Strategies: Resource Preemption</h3>
            {recovery.preemption.length > 0 ? (
              <div className="strategies">
                {recovery.preemption.map((strategy, idx) => (
                  <div key={idx} className="strategy-item">
                    <div className="strategy-header">
                      <span className="strategy-number">{idx + 1}</span>
                      <strong>{strategy.description}</strong>
                    </div>
                    <div className="strategy-explanation">
                      {strategy.explanation.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-strategies">No preemption strategies available.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
