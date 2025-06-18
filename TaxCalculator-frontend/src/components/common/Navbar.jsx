import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    TaxCalc
                </Link>
                <ul className="nav-menu">
                    {user ? (
                        <>
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-links">
                                    {isAdmin ? 'Yönetici Paneli' : 'Dashboard'}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <span className="nav-user-info">
                                    Hoş geldin, {user.username}
                                </span>
                            </li>
                            <li className="nav-item">
                                <button
                                    onClick={handleLogout}
                                    className="nav-links-button"
                                >
                                    Çıkış Yap
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-links">
                                    Giriş Yap
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-links">
                                    Kayıt Ol
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;