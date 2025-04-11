import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import './Login.css';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required'),
    rememberMe: yup.boolean()
});

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            const response = await api.login({
                email: data.email,
                password: data.password
            });

            if (response.token) {
                if (data.rememberMe) {
                    localStorage.setItem('token', response.token);
                } else {
                    sessionStorage.setItem('token', response.token);
                }
                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                toast.error('Invalid credentials. Please try again.');
            }
        } catch (err) {
            toast.error(err.message || 'Login failed. Please check your credentials.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-content">
                    <div className="login-header">
                        <div className="app-logo">
                            <div className="logo-circle"></div>
                            <span className="app-name">Health Risk Assesment</span>
                        </div>
                        <nav className="login-nav">
                            <Link to="/home" className="nav-link">Home</Link>
                        </nav>
                    </div>

                    <div className="login-form-container">
                        <h2>Login to your account</h2>
                        <p className="login-subtitle">
                            New to Anywhere? <Link to="/register" className="accent-link">Create Account</Link>
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        placeholder="your.email@example.com"
                                        {...register('email')}
                                        className={errors.email ? 'error' : ''}
                                    />
                                </div>
                                {errors.email && (
                                    <span className="error-message">{errors.email.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div className="input-wrapper password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...register('password')}
                                        className={errors.password ? 'error' : ''}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            {showPassword ? (
                                                <>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                    <line x1="2" y1="2" x2="22" y2="22"></line>
                                                </>
                                            ) : (
                                                <>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                    <circle cx="12" cy="12" r="3"></circle>
                                                </>
                                            )}
                                        </svg>
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className="error-message">{errors.password.message}</span>
                                )}
                            </div>

                            <div className="form-footer">
                                <div className="remember-me">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        {...register('rememberMe')}
                                    />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>
                                <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="login-image">
                    <div className="brand-mark">
                        <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;