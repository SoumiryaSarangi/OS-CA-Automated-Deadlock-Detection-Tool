import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Header.css';

export default function Header({ isDarkMode, toggleTheme }) {
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <header ref={headerRef} className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🔍</span>
            <h1 className="logo-text">Deadlock Detective</h1>
          </div>
          <p className="tagline">Automated Deadlock Detection & Analysis</p>
        </div>
        <div className="header-right">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            <span className="theme-icon">{isDarkMode ? '☀️' : '🌙'}</span>
            <span className="theme-text">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
