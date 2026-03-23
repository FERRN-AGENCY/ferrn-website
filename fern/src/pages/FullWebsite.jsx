import MainExperience from './MainExperience/MainExperience';
import AboutUs from './MainExperience/components/AboutUs/AboutUs';
import OurClients from './MainExperience/components/OurClients/OurClients';
import Navbar from './MainExperience/components/Navbar/Navbar'; 

import WorkTransitionWrapper from './MainExperience/components/WorkTransitionWrapper'; 
import ProcessGrid from './MainExperience/components/ProcessGrid/ProcessGrid';
import Testimonials from './MainExperience/components/Testimonials/Testimonials';

import ChatSystem from './MainExperience/components/ChatSystem/ChatSystem';
import Footer from './MainExperience/components/Footer/Footer';

import styles from './FullWebsite.module.css';

const FullWebsite = () => {
  return (
    <div className={styles.scrollContainer}>
      
      {/* 1. Hero Section */}
      <MainExperience />

      {/* 2. About Us */}
      <div style={{ marginBottom: "clamp(50px, 5vh, 90px)" }}>
        <AboutUs />
      </div>

      {/* 3. Our Clients */}
      <div style={{ marginBottom: "clamp(40px, 5vh, 70px)" }}>
        <OurClients />
      </div>

      {/* 4. The Cinematic Scroll (Services -> Case Studies) */}
      <WorkTransitionWrapper />

      {/* 5. Process Grid */}
      <div style={{ marginBottom: "clamp(100px, 5vh, 150px)" }}>
        <ProcessGrid />
      </div>

      {/* 6. Client Testimonials */}
      <div style={{ marginBottom: "clamp(50px, 5vh, 100px)" }}>
        <Testimonials />
      </div>

      {/* 7. The Chat System */}
      <div style={{ marginBottom: "50px 5vh 100px" }}>
        <ChatSystem />
      </div>

      {/* 8. The Footer */}
      <Footer />

      {/* Floating Navbar */}
      <Navbar />

    </div>
  );
};

export default FullWebsite;