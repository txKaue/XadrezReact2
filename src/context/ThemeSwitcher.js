import React from 'react';
import { useTheme } from './ThemeContext';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Alternar Tema ({theme === 'default' ? 'highContrast' : 'Padrão'})
    </button>
  );
};

export default ThemeSwitcher;
