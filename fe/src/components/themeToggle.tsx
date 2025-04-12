import { useState, useEffect } from 'react';
import DarkModeIcon from "../assets/icons/icons8-dark-mode-48.png";
import LightModeIcon from "../assets/icons/icons8-light-mode-78.png";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    return 'system'; // Default to system
  });

  const [systemPreference, setSystemPreference] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default if media query is not supported
  });

  const [useSystem, setUseSystem] = useState(() => localStorage.getItem('useSystem') === 'true' || localStorage.getItem('useSystem') === null);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('useSystem', useSystem);
    document.documentElement.setAttribute('data-theme', useSystem ? systemPreference : theme);
  }, [theme, useSystem, systemPreference]);

  useEffect(() => {
    const handleSystemChange = (event) => {
      setSystemPreference(event.matches ? 'dark' : 'light');
    };

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQueryList.addEventListener('change', handleSystemChange);
      return () => {
        mediaQueryList.removeEventListener('change', handleSystemChange);
      };
    }
  }, []);

  const handleToggleSystem = () => {
    setUseSystem(!useSystem);
    if (!useSystem) {
      setTheme('system'); // Update theme to system when enabling system toggle
    }
  };

  const handleSetCustomTheme = (newTheme) => {
    setUseSystem(false);
    setTheme(newTheme);
  };

  const getIcon = () => {
    if (useSystem) {
      return <img src={DarkModeIcon} width="32" />;
    } else if (theme === 'light') {
      return <img src={LightModeIcon} width="42" />;
    } else {
      return <img src={DarkModeIcon} width="32" />;
    }
  };

  const getLabel = () => {
    if (useSystem) {
      return `System (${systemPreference === 'dark' ? 'Dark' : 'Light'})`;
    } else if (theme === 'light') {
      return 'Light Mode';
    } else {
      return 'Dark Mode';
    }
  };

  const toggleSwitch = (
      <div className="userMenu relative w-12 h-6 rounded-full bg-gray-300 transition-all duration-300">
        <input
          type="checkbox"
          className="userMenu peer absolute top-0 left-0 w-full h-full appearance-none cursor-pointer rounded-full"
          checked={useSystem}
          onChange={handleToggleSystem}
          id="system-toggle"
        />
        <span
          className={`userMenu absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-0`}
        ></span>
      </div>
  );

  return (
    <>
      <div className="userMenu flex items-center gap-4">
        {getIcon()}
        <span className="userMenu">{getLabel()}</span>
      </div>
      { toggleSwitch }
      {!useSystem && (
        <div className="userMenu flex gap-2 ml-4">
          <button onClick={() => handleSetCustomTheme('light')} className={`userMenu cursor-pointer ${theme === 'light' ? 'text-purple-700' : 'hover:text-purple-700'}`}>
            <img className="userMenu" src={DarkModeIcon} width="32" />
          </button>
          <button onClick={() => handleSetCustomTheme('dark')} className={`userMenu cursor-pointer ${theme === 'dark' ? 'text-purple-700' : 'hover:text-purple-700'}`}>
            <img className="userMenu" src={LightModeIcon} width="42" />
          </button>
        </div>
      )}
      </>
  );
};

export default ThemeToggle;
