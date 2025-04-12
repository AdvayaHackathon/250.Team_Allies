import React from 'react';
import { useNavigate } from 'react-router-dom';
import './contact.css';

const ContactUs = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };
  return (
    <div className="contact-wrapper">
      <div className="contact-card">
        <button className="close-btn" onClick={handleClose} aria-label="Close">
          &times;
        </button>
        <h1>Contact Us</h1>
          <p>We’re here to help. If you have any questions, feedback, or concerns, feel free to reach out to us.</p>
          <p>📞 +91 123456890</p>
          <p>📧 healthriskassessment@gmail.com</p>
          <p>🏢 Address:
                Health Risk Assessment Team
                SJCIT,Bangalore, Karnataka, India
          </p>

          <p>We aim to respond to all inquiries within 24–48 hours on business days.</p>
      </div>
    </div>
  );
};

export default ContactUs;