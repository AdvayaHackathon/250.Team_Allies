import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/ErrorBoundary';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import HealthForm from './components/HealthForm/HealthForm';
import RiskAssessment from './components/RiskAssessment/RiskAssessment';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';
import TermsAndServices from './pages/terms/terms';
import PrivacyPolicy from './pages/Privacy/privacy';
import ContactUs from './pages/contact/contact';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
            <Route path="/terms" element={<TermsAndServices />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/health-form" element={
                <ProtectedRoute>
                  <HealthForm />
                </ProtectedRoute>
              } />
              <Route path="/risk-assessment" element={
                <ProtectedRoute>
                  <RiskAssessment />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
