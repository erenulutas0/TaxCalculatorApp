import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm.jsx';

const LoginPage = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">🎉 Hoş Geldiniz</h2>
                <p className="auth-subtitle">
                    Hesabınıza giriş yapın ve vergi yönetiminizi kolaylaştırın
                </p>
                <LoginForm />
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <span style={{ color: '#666', fontSize: '0.95rem' }}>
                        Henüz hesabınız yok mu?
                    </span>
                    <br />
                    <Link
                        to="/register"
                        className="nav-link"
                        style={{
                            fontSize: '1rem',
                            marginTop: '0.5rem',
                            display: 'inline-block',
                        }}
                    >
                        ✨ Hemen kayıt olun
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;