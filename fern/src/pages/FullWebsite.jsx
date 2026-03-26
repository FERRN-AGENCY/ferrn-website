import MainExperience from './MainExperience/MainExperience';
import AboutUs from './MainExperience/components/AboutUs/AboutUs';
import OurClients from './MainExperience/components/OurClients/OurClients';
import Navbar from './MainExperience/components/Navbar/Navbar'; 

import WorkTransitionWrapper from './MainExperience/components/WorkTransitionWrapper'; 
import ProcessGrid from './MainExperience/components/ProcessGrid/ProcessGrid';
import Testimonials from './MainExperience/components/Testimonials/Testimonials';

import ChatSystem from './MainExperience/components/ChatSystem/ChatSystem';
// import ProcessGrid from './ProcessGrid/ProcessGrid'; 
import Footer from './MainExperience/components/Footer/Footer';

import styles from './FullWebsite.module.css';

const FullWebsite = () => {
  return (
    <div className={styles.scrollContainer}>
      
      {/* 1. Hero Section */}
      <MainExperience />

      {/* 2. About Us */}
      <div id="about-us" style={{ marginBottom: "clamp(50px, 5vh, 90px)" }}>
        <AboutUs />
      </div>

      {/* 3. Our Clients */}
      <div id="our-clients" style={{ marginBottom: "clamp(40px, 5vh, 70px)" }}>
        <OurClients />
      </div>

      {/* 4. The Cinematic Scroll (Services -> Case Studies) */}
      <div id="services">
        <WorkTransitionWrapper />
      </div>
      {/* <ProcessGrid /> */}
      {/* 5. Client Testimonials */}
      <div id="testimonials" style={{ marginBottom: "clamp(50px, 5vh, 100px)" }}>
        <Testimonials />
      </div>

      {/* 6. The Chat System (Mapped to FAQ!) */}
      <div id="faq" style={{ marginBottom: "clamp(50px, 5vh, 100px)" }}>
        <ChatSystem />
      </div>

      {/* 7. The Footer */}
      <Footer />

      {/* Floating Navbar */}
      <Navbar />

    </div>
  );
};

export default FullWebsite;