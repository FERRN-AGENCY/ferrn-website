import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useRequireName = () => {
  const navigate = useNavigate();
  // Grab the name from the browser's permanent memory
  const storedName = localStorage.getItem('ferrn_user');

  useEffect(() => {
    // If there is no name saved, instantly kick them back to the start
    if (!storedName) {
      navigate('/');
    }
  }, [storedName, navigate]);

  // Return the name so the page can use it!
  return storedName;
};