import React from 'react';
import { useNavigate } from 'react-router-dom';
import './privacy.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="privacy-wrapper">
      <div className="privacy-card">
        <button className="close-btn" onClick={handleClose} aria-label="Close">
          &times;
        </button>
        <h1>Privacy Policy</h1>
          <p>
              We value your privacy and are committed to protecting your personal data. This policy outlines what data we collect and how we use it.
          </p>
        <h2>Information We Collect</h2>
          <p>Personal Information: Name, email address, phone number (if provided), and other registration details.</p>
          <p>  Usage Data: How you interact with our platform, including page visits and time spent.</p>
          <p>   Health Assessment Data: Any data you voluntarily provide while completing assessments</p>
        <h2>How We Use Your Data</h2>
          <p>To provide and improve our services.</p>
          <p>To personalize your experience and deliver relevant content.</p>
          <p>To maintain security and prevent fraud.</p>
          <p>To communicate updates and respond to inquiries.</p>
        <h2>Data Sharing</h2>
          <p>We do not sell or rent your personal data.</p><p> We may share data only:
            With service providers to help us operate our site.
            If required by law or legal process.
          </p>
        <h2>Your Rights</h2>
          <p>You can:
            Request access to your data.
            Ask for correction or deletion.
            Withdraw consent for data processing (where applicable).</p>
        <h2>Security</h2> 
          <p>We implement security measures to safeguard your data, but no method of transmission over the internet is 100% secure.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
