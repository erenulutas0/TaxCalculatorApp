import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService.js';
import UserTable from './UserTable.jsx';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (err) {
                setError('Dashboard istatistikleri yüklenemedi');
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="dashboard-container">
                <div className="container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="container">
                    <h1 className="dashboard-title">Yönetici Paneli</h1>
                    <p className="dashboard-subtitle">Sistem genel durumu ve kullanıcı yönetimi</p>
                </div>
            </div>

            <div className="container">
                {/* Admin Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">👥</div>
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-label">Toplam Kullanıcı</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green">📦</div>
                        <div className="stat-value">{stats.totalProducts}</div>
                        <div className="stat-label">Toplam Ürün</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">💰</div>
                        <div className="stat-value">₺{stats.totalValue?.toLocaleString()}</div>
                        <div className="stat-label">Toplam Değer</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon red">📊</div>
                        <div className="stat-value">₺{stats.totalTax?.toLocaleString()}</div>
                        <div className="stat-label">Toplam Vergi</div>
                    </div>
                </div>

                {/* Additional Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon green">✅</div>
                        <div className="stat-value">₺{stats.totalPaidTax?.toLocaleString()}</div>
                        <div className="stat-label">Ödenen Vergi</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon red">❌</div>
                        <div className="stat-value">₺{stats.totalUnpaidTax?.toLocaleString()}</div>
                        <div className="stat-label">Ödenmemiş Vergi</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon blue">📈</div>
                        <div className="stat-value">{stats.paidTaxProducts}</div>
                        <div className="stat-label">Vergisi Ödenen Ürün</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange">📉</div>
                        <div className="stat-value">{stats.unpaidTaxProducts}</div>
                        <div className="stat-label">Vergisi Ödenmemiş</div>
                    </div>
                </div>

                {/* User Management */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Kullanıcı Yönetimi</h3>
                    </div>
                    <div className="card-body">
                        <UserTable />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;