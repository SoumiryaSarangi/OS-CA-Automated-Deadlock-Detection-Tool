import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { createEmptySystemState } from './types/models';
import { detectDeadlockWFG } from './algorithms/wfg';
import { detectDeadlockMatrix } from './algorithms/matrix';
import { generateRecoverySuggestions } from './algorithms/recovery';
import InputTab from './components/InputTab';
import VisualizationTab from './components/VisualizationTab';
import ResultsTab from './components/ResultsTab';
import Header from './components/Header';
import AnimatedCpu from './components/AnimatedCpu';
import AnimatedChartLine from './components/AnimatedChartLine';
import AnimatedCheckCheck from './components/AnimatedCheckCheck';
import './App.css';

// meowww

function App() {
  const [currentTab, setCurrentTab] = useState('input');
  const [systemState, setSystemState] = useState(createEmptySystemState());
  const [detectionResult, setDetectionResult] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [hoveredTab, setHoveredTab] = useState(null);
  
  const mainRef = useRef(null);

  useEffect(() => {
    // Apply theme to body
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  useEffect(() => {
    // Animate page load
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  useEffect(() => {
    // Animate tab transitions
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current.querySelector('.tab-content'),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [currentTab]);

  const handleAnalyze = () => {
    try {
      // Automatically select the appropriate algorithm based on resource instances
      const allSingleInstance = systemState.resource_types.every(r => r.instances === 1);
      const selectedAlgorithm = allSingleInstance ? 'wfg' : 'matrix';

      let result;
      if (selectedAlgorithm === 'wfg') {
        result = detectDeadlockWFG(systemState);
      } else {
        result = detectDeadlockMatrix(systemState);
      }

      const recovery = result.deadlocked
        ? generateRecoverySuggestions(systemState, result.deadlocked_processes)
        : null;

      setDetectionResult({
        ...result,
        recovery,
        algorithm: selectedAlgorithm,
      });

      setCurrentTab('results');
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div className="App">
      <Header isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${currentTab === 'input' ? 'active' : ''}`}
          onClick={() => handleTabChange('input')}
          onMouseEnter={() => setHoveredTab('input')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <AnimatedCpu width={24} height={24} strokeWidth={2} stroke={currentTab === 'input' ? 'var(--accent-primary)' : 'var(--text-secondary)'} isHovered={hoveredTab === 'input'} />
          Input
        </button>
        <button
          className={`nav-tab ${currentTab === 'visualization' ? 'active' : ''}`}
          onClick={() => handleTabChange('visualization')}
          disabled={!detectionResult}
          onMouseEnter={() => setHoveredTab('visualization')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <AnimatedChartLine width={24} height={24} strokeWidth={2} stroke={currentTab === 'visualization' ? 'var(--accent-primary)' : 'var(--text-secondary)'} isHovered={hoveredTab === 'visualization'} />
          Visualization
        </button>
        <button
          className={`nav-tab ${currentTab === 'results' ? 'active' : ''}`}
          onClick={() => handleTabChange('results')}
          disabled={!detectionResult}
          onMouseEnter={() => setHoveredTab('results')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <AnimatedCheckCheck width={24} height={24} strokeWidth={2} stroke={currentTab === 'results' ? 'var(--accent-primary)' : 'var(--text-secondary)'} isHovered={hoveredTab === 'results'} />
          Results
        </button>
      </nav>

      <main ref={mainRef} className="main-content">
        <div className="tab-content">
          {currentTab === 'input' && (
            <InputTab
              systemState={systemState}
              setSystemState={setSystemState}
              onAnalyze={handleAnalyze}
            />
          )}
          {currentTab === 'visualization' && detectionResult && (
            <VisualizationTab
              systemState={systemState}
              detectionResult={detectionResult}
            />
          )}
          {currentTab === 'results' && detectionResult && (
            <ResultsTab detectionResult={detectionResult} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
