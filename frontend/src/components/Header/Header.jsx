import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container">
                    <div className="logo-circle"></div>
                    <span className="logo">Health Risk Assessment</span>
                </div>
                <nav className="nav-links">
                    <Link to="/" className={isActive('/') ? 'active' : ''}>
                        Home
                    </Link>
                    {token ? (
                        <>
                            <Link to="/health-form" className={isActive('/health-form') ? 'active' : ''}>
                                New Assessment
                            </Link>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                                Login
                            </Link>
                            <Link to="/register" className={`action-btn ${isActive('/register') ? 'active' : ''}`}>
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
