import React from "react";
import "./Homepage.css";

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      <div className="main-content">
        <div className="bg-animations">
          <div className="anim-shape shape-1"></div>
          <div className="anim-shape shape-2"></div>
          <div className="anim-shape shape-3"></div>
          <div className="anim-shape shape-4"></div>
          <div className="anim-shape shape-5"></div>
          <div className="anim-shape shape-6"></div>
        </div>

        <div className="text-content">
          <h1 className="hero-title">ALL THE SHIT YOU NEED</h1>
          <div className="tagline-text">Because shit matters.</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
