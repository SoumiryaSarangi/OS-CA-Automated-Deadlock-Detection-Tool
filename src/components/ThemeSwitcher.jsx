import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const themes = [
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
];

export const ThemeSwitcher = ({ value, onChange, defaultValue = 'dark' }) => {
  const [theme, setTheme] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });
  const [mounted, setMounted] = useState(false);

  const handleThemeClick = useCallback(
    (themeKey) => {
      setTheme(themeKey);
    },
    [setTheme]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      style={{
        position: 'relative',
        isolation: 'isolate',
        display: 'flex',
        height: '2.5rem',
        borderRadius: '9999px',
        background: 'var(--bg-card)',
        padding: '0.25rem',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
      }}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;
        return (
          <button
            aria-label={label}
            style={{
              position: 'relative',
              height: '2rem',
              width: '2rem',
              borderRadius: '9999px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            key={key}
            onClick={() => handleThemeClick(key)}
            type="button"
          >
            {isActive && (
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '0',
                  borderRadius: '9999px',
                  background: 'var(--accent-primary)',
                  boxShadow: '0 2px 4px rgba(98, 163, 136, 0.4)',
                }}
                layoutId="activeTheme"
                transition={{ type: 'spring', duration: 0.5, stiffness: 300, damping: 30 }}
              />
            )}
            <Icon
              style={{
                position: 'relative',
                zIndex: 10,
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                transition: 'color 0.3s ease',
              }}
              size={18}
            />
          </button>
        );
      })}
    </div>
  );
};
