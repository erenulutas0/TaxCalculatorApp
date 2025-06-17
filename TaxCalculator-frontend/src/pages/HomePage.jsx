import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">TaxCalc</h1>
                <p className="home-subtitle">
                    Vergi yönetiminde yeni nesil çözüm.
                    Varlıklarınızı kolayca yönetin ve vergi hesaplamalarınızı otomatikleştirin.
                </p>
                <div className="home-buttons">
                    <Link to="/login" className="btn btn-primary">
                        Giriş Yap
                    </Link>
                    <Link to="/register" className="btn btn-secondary">
                        Kayıt Ol
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;