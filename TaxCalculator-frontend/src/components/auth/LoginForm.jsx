import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Kullanıcı adı ve şifre gereklidir.');
            return;
        }

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Giriş başarısız. Kullanıcı adı veya şifre hatalı.');
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

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <div className="spinner" style={{ width: '20px', height: '20px', display: 'inline-block', marginRight: '10px' }}></div>
                        Giriş yapılıyor...
                    </>
                ) : 'Giriş Yap'}
            </button>
        </form>
    );
};

export default LoginForm;