import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './pages/Loader/Loader';
import Onboarding from './pages/Onboarding/Onboarding';
import FullWebsite from './pages/FullWebsite';

import GlobalCursor from './components/common/GlobalCursor/GlobalCursor'; 
import SmoothScroll from './components/common/SmoothScroll';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fakeBootTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); 

    return () => clearTimeout(fakeBootTimer);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SmoothScroll>
      <Router>
        
        {/* THE FIX: Moved GlobalCursor inside the Router! */}
        {/* It is still outside of <Routes>, so it will render on every page perfectly. */}
        <GlobalCursor />

        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/experience" element={<FullWebsite />} />
        </Routes>
        
      </Router>
    </SmoothScroll>
  );
}

export default App;