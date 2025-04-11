import React from 'react';
// import { useNavigate } from 'react-router-dom';
import './Home.css';

// Icons for services
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const Home = () => {
  //  const navigate = useNavigate();
   // const token = localStorage.getItem('token');
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>A family of healthcare professionals for your family</h1>
                    <p>We put patients at the center with personalized care plans and collaborative clinical teams working to improve health outcomes and reduce costs.</p>
                </div>
                <div className="decorative-dots"></div>
                <img
                    src="https://img.freepik.com/free-vector/hand-drawn-ai-healthcare-illustration_52683-155547.jpg?semt=ais_hybrid&w=740"
                    alt="Healthcare professional"
                    className="doctor-image"
                />
            </section>

            <section className="features">
                <div className="section-header">
                    <h2>Our Medical Services</h2>
                    <p>Comprehensive healthcare solutions designed to meet your needs with a patient-centered approach</p>
                </div>
                <div className="services-grid">
                    <div className="service-card">
                        <div className="service-icon">
                            <HeartIcon />
                        </div>
                        <h3>Comprehensive Health Assessment</h3>
                        <p>Get detailed insights about various health risk factors affecting your well-being with our thorough evaluation process.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">
                            <ShieldIcon />
                        </div>
                        <h3>Personalized Care Plans</h3>
                        <p>Receive evidence-based health recommendations tailored specifically to your assessment results and health history.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">
                            <ChartIcon />
                        </div>
                        <h3>Health Monitoring & Progress</h3>
                        <p>Track your health metrics over time with our advanced monitoring tools and celebrate your improvement journey.</p>
                    </div>
                    <div className="service-card">
                        <div className="service-icon">
                            <UserIcon />
                        </div>
                        <h3>Secure Patient Portal</h3>
                        <p>Access your health information anytime with our HIPAA-compliant secure portal that protects your privacy.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;