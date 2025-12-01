import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ThemeSwitcher } from './ThemeSwitcher';
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

  const handleThemeChange = (theme) => {
    toggleTheme();
  };

  return (
    <header ref={headerRef} className="header">
      <div className="header-content">
        <div className="header-left">
          <img src="/logo_website.png" alt="Deadlock Detective Logo" className="logo-icon" />
          <div className="logo">
            <h1 className="logo-text">Deadlock Detective</h1>
            <p className="tagline">Automated Deadlock Detection & Analysis</p>
          </div>
        </div>
        <div className="header-right">
          <ThemeSwitcher 
            value={isDarkMode ? 'dark' : 'light'}
            onChange={handleThemeChange}
            defaultValue={isDarkMode ? 'dark' : 'light'}
          />
        </div>
      </div>
    </header>
  );
}
