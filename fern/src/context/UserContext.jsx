import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  
  // Default to dark mode based on your screenshots, but allow toggling
  const [theme, setTheme] = useState('dark');

  // Listen for theme changes and update the CSS data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <UserContext.Provider value={{ userName, setUserName, theme, toggleTheme }}>
      {children}
    </UserContext.Provider>
  );
};