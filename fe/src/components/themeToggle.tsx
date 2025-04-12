import { useState, useEffect } from 'react';
//import LightModeIcon from './LightModeIcon'; // Assuming you have these icon components
import DarkModeIcon from "../assets/icons/icons8-dark-mode-48.png";
//import SystemModeIcon from './SystemModeIcon';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    return 'system'; // Default to system
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    if (theme === 'light') {
      return <img src={DarkModeIcon} width="32" />;
    } else if (theme === 'dark') {
      return <img src={DarkModeIcon} width="32" />
    } else {
      return <img src={DarkModeIcon} width="32" />;
    }
  };

  const getLabel = () => {
    if (theme === 'light') {
      return 'Light Mode';
    } else if (theme === 'dark') {
      return 'Dark Mode';
    } else {
      return 'System';
    }
  };

  return (
    <li className="flex cursor-pointer gap-4 hover:text-purple-700" onClick={toggleTheme}>
      {getIcon()}
      <button>
        <span>{getLabel()}</span>
      </button>
    </li>
  );
};

export default ThemeToggle;
