import React from 'react';
import { useTheme } from '../../hooks/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={toggleDarkMode} 
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <FontAwesomeIcon 
        icon={darkMode ? faSun : faMoon} 
        className={darkMode ? "sun-icon" : "moon-icon"} 
      />
    </button>
  );
};

export default ThemeToggle;