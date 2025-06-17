import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.jsx';

const LoginPage = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Hoş Geldiniz</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>
                    Hesabınıza giriş yapın
                </p>
                <LoginForm />
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <span style={{ color: '#666' }}>Hesabınız yok mu? </span>
                    <Link to="/register" className="nav-link">
                        Kayıt olun
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;