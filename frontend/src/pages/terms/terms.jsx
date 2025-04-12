import React from 'react';
import { useNavigate } from 'react-router-dom';
import './terms.css';

const TermsAndServices = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="terms-wrapper">
      <div className="terms-card">
        <button className="close-btn" onClick={handleClose} aria-label="Close">
          &times;
        </button>
        <h1>Terms & Services</h1>
          <p>By accessing our site, you agree to our terms and conditions. Please read them carefully.</p>
        <h2>Use of Site</h2>
          <p>This site is for personal and non-commercial use only. You agree not to misuse the content.</p>
        <h2>Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password.</p>
        <h2>Health Information Disclaimer</h2>
          <p> The assessments provided on this platform are not a substitute for professional medical advice.</p>
          <p>Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>     
          <p>The information provided through assessments is for informational purposes only.</p>
          <p>It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>    
          <p>It does not replace professional medical advice, diagnosis, or treatment.</p>
        <h2>Intellectual Property</h2>
          <p>All content, graphics, and branding on this site are the intellectual property of Health Risk Assessment.</p>
          <p>You may not reproduce, distribute, or modify any content without our written permission.</p>
        <h2> Termination</h2>
          <p>We reserve the right to terminate access to users who violate these terms or misuse the platform.</p>
        <h2> Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of the platform implies acceptance of the new terms.</p>
      </div>
    </div>
  );
};

export default TermsAndServices;