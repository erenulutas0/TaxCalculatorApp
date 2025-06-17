import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm.jsx';

const RegisterPage = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Hesap Oluştur</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>
                    TaxCalc'a katılın ve vergi yönetimini kolaylaştırın
                </p>
                <RegisterForm />
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <span style={{ color: '#666' }}>Zaten hesabınız var mı? </span>
                    <Link to="/login" className="nav-link">
                        Giriş yapın
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;