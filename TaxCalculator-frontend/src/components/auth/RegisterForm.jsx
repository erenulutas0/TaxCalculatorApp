import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !email || !password) {
            setError('Tüm alanlar zorunludur.');
            return;
        }

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        try {
            await register(username, email, password, role);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Kayıt işlemi başarısız.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div className="form-group">
                <label className="form-label">Kullanıcı Adı</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Kullanıcı adınızı girin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label className="form-label">E-posta</label>
                <input
                    type="email"
                    className="form-input"
                    placeholder="E-posta adresinizi girin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Şifre</label>
                <input
                    type="password"
                    className="form-input"
                    placeholder="Şifrenizi girin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Rol</label>
                <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                >
                    <option value="USER">Kullanıcı</option>
                    <option value="ADMIN">Yönetici</option>
                </select>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <div className="spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '10px' }}></div>
                        Kayıt ediliyor...
                    </>
                ) : 'Kayıt Ol'}
            </button>
        </form>
    );
};

export default RegisterForm;