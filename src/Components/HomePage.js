import React from "react";
import "./HomePage.css";
import WGJLogo from "../assets/images/WGJLogo.png"; // Import Logo

function HomePage() {
  return (
    <div id='Home-Page-Container'> {/* Home Page Wrapper */}
        <div id='Title'>Home Page Placeholder</div>
        <img id='logo' src={WGJLogo} alt="Logo"></img>
    </div>
    
  );
}

export default HomePage;