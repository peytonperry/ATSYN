import React from 'react';
import background from '../Homepage/ATSYN_Logo.png'
const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      <div 
        className="background-image"
        style={{
          backgroundImage: `url(${background})` 
        }}
      ></div>
      
      <div className="dark-overlay"></div>

      <div className="main-content">
        <div className="text-content">
          <h1 className="hero-title">ALL THE SHIT YOU NEED</h1>
          <div className="tagline-text">Because shit matters.</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;