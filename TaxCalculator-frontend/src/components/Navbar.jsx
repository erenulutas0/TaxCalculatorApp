import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Eğer user yoksa navbar'ı gösterme (login/register sayfaları için)
    if (!user) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-brand">
                    TaxCalc
                </Link>

                <div className="navbar-menu">
                    <div className="navbar-links">
                        {user.role === 'ADMIN' ? (
                            <Link
                                to="/admin/dashboard"
                                className={`navbar-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
                            >
                                Yönetici Paneli
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/products"
                                    className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}
                                >
                                    Varlıklarım
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="navbar-user">
                        <div className="user-info">
                            <span className="user-greeting">Hoş geldin,</span>
                            <span className="user-name">{user.username}</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="logout-btn"
                        >
                            <span className="logout-icon">🚪</span>
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;