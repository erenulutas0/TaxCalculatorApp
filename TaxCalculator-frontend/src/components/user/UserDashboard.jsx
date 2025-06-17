// filepath: c:\Users\pc\OneDrive\Masaüstü\TaxCalculator\TaxCalculator-frontend\src\components\user\UserDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import productService from '../../services/productService.js';
import AddProductForm from './AddProductForm.jsx';
import AssetList from './AssetList.jsx';
import { calculateTax } from '../../utils/taxUtils.js';

const UserDashboard = () => {
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            const data = await productService.getUserProducts();
            setAssets(data);
        } catch (err) {
            setError('Varlıklar yüklenemedi');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const summary = useMemo(() => {
        const totalValue = assets.reduce((sum, asset) => sum + Number(asset.price), 0);
        const totalTax = assets.reduce((sum, asset) => sum + calculateTax(asset), 0);
        const paidTax = assets.filter(asset => asset.taxPaid).reduce((sum, asset) => sum + calculateTax(asset), 0);
        const unpaidTax = totalTax - paidTax;

        return {
            totalAssets: assets.length,
            totalValue,
            totalTax,
            paidTax,
            unpaidTax
        };
    }, [assets]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="container">
                    <h1 className="dashboard-title">👋 Hoş Geldiniz, {user?.username}</h1>
                    <p className="dashboard-subtitle">Varlıklarınızı ve vergi durumunuzu kolayca yönetin</p>
                </div>
            </div>

            <div className="container">
                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-value">{summary.totalAssets}</div>
                        <div className="stat-label">Toplam Varlık</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">₺{summary.totalValue.toLocaleString()}</div>
                        <div className="stat-label">Toplam Değer</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📈</div>
                        <div className="stat-value">₺{summary.totalTax.toLocaleString()}</div>
                        <div className="stat-label">Toplam Vergi</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-value">₺{summary.unpaidTax.toLocaleString()}</div>
                        <div className="stat-label">Ödenmemiş Vergi</div>
                    </div>
                </div>

                {/* Add Product Form */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">➕ Yeni Varlık Ekle</h3>
                    </div>
                    <div className="card-body">
                        <AddProductForm onProductAdded={fetchAssets} />
                    </div>
                </div>

                {/* Assets List */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">📋 Varlıklarım ({assets.length})</h3>
                    </div>
                    <div className="card-body">
                        <AssetList
                            assets={assets}
                            loading={loading}
                            error={error}
                            onAssetUpdate={fetchAssets}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;