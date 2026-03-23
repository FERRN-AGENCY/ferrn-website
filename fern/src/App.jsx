import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './pages/Loader/Loader';
import Onboarding from './pages/Onboarding/Onboarding';
import FullWebsite from './pages/FullWebsite'; 

// 1. Import the SmoothScroll component 
// (Make sure this path matches exactly where you saved the file!)
import SmoothScroll from './components/common/SmoothScroll';

function App() {
  // 1. The state that controls whether the Loader is showing
  const [isLoading, setIsLoading] = useState(true);

  // 2. The booting logic (Shows the loader for 2.5 seconds, then hides it)
  useEffect(() => {
    const fakeBootTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Adjust this number to make your loader play longer or shorter

    return () => clearTimeout(fakeBootTimer);
  }, []);

  // 3. If the app is still "loading", ONLY show the Loader component
  if (isLoading) {
    return <Loader />;
  }

  // 4. Once loading is done, show the actual website wrapped in SmoothScroll
  return (
    <SmoothScroll>
      <Router>
        <Routes>
          {/* Sends the user to the name input page first */}
          <Route path="/" element={<Onboarding />} />
          
          {/* Sends the user to our new Master File with all the stacked sections */}
          <Route path="/experience" element={<FullWebsite />} />
        </Routes>
      </Router>
    </SmoothScroll>
  );
}

export default App;