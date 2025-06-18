import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService.js';
import UserTable from './UserTable.jsx';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setError('');
            const data = await adminService.getDashboardStats();
            console.log('Backend\'den gelen stats:', data); // Debug için
            setStats(data);
        } catch (err) {
            console.error('Dashboard stats hatası:', err);
            setError('İstatistikler yüklenirken hata oluştu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Kullanıcı silindiğinde stats'ları yenile
    const handleUserDeleted = () => {
        fetchStats();
    };

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="alert alert-error">
                    ❌ {error}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Yönetici Paneli</h1>
                    <p className="dashboard-subtitle">Sistem genel durumu ve kullanıcı yönetimi</p>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Veriler yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Yönetici Paneli</h1>
                <p className="dashboard-subtitle">Sistem genel durumu ve kullanıcı yönetimi</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-number">{stats?.totalUsers || 0}</div>
                    <div className="stat-label">Toplam Kullanıcı</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-number">{stats?.totalProducts || 0}</div>
                    <div className="stat-label">Toplam Ürün</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-number">₺{stats?.totalValue?.toLocaleString() || '0'}</div>
                    <div className="stat-label">Toplam Değer</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-number">₺{stats?.totalTax?.toLocaleString() || '0'}</div>
                    <div className="stat-label">Toplam Vergi</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-number">₺{stats?.totalPaidTax?.toLocaleString() || '0'}</div>
                    <div className="stat-label">Ödenen Vergi</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">❌</div>
                    <div className="stat-number">₺{stats?.totalUnpaidTax?.toLocaleString() || '0'}</div>
                    <div className="stat-label">Ödenmemiş Vergi</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-number">{stats?.paidTaxProducts || 0}</div>
                    <div className="stat-label">Vergisi Ödenen Ürün</div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🚫</div>
                    <div className="stat-number">{stats?.unpaidTaxProducts || 0}</div>
                    <div className="stat-label">Vergisi Ödenmemiş</div>
                </div>
            </div>

            <div className="user-management-section">
                <UserTable onUserDeleted={handleUserDeleted} />
            </div>
        </div>
    );
};

export default AdminDashboard;