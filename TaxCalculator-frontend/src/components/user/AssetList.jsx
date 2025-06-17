import React, { useState } from 'react';
import productService from '../../services/productService.js';
import { calculateTax } from '../../utils/taxUtils.js';
import Button from '../common/Button.jsx';

const getTypeIcon = (type) => {
    const icons = {
        CAR: "🚗",
        COMMERCIAL: "🏢",
        HOUSE: "🏠",
        LAND: "🌍",
        STORE: "🏪",
        ELECTRONICS: "📱",
        JEWELRY: "💎",
        BOAT: "⛵"
    };
    return icons[type] || "📦";
};

const getTypeLabel = (type) => {
    const labels = {
        CAR: "Araba",
        COMMERCIAL: "Ticari",
        HOUSE: "Ev",
        LAND: "Arsa",
        STORE: "Mağaza",
        ELECTRONICS: "Elektronik",
        JEWELRY: "Mücevher",
        BOAT: "Tekne"
    };
    return labels[type] || type;
};

// Bileşen artık kendi state'ini yönetmiyor, tüm veriyi props'tan alıyor.
const AssetList = ({ assets, loading, error, onAssetUpdate }) => {
    const [processingIds, setProcessingIds] = useState(new Set());

    const handlePayTax = async (assetId) => {
        if (processingIds.has(assetId)) return;

        try {
            setProcessingIds(prev => new Set([...prev, assetId]));
            await productService.payTax(assetId);
            onAssetUpdate();
        } catch (err) {
            alert('Vergi ödemesi sırasında hata oluştu: ' + (err.response?.data?.message || err.message));
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(assetId);
                return newSet;
            });
        }
    };

    if (loading) {
        return (
            <div className="empty-state">
                <div className="spinner"></div>
                <p>Varlıklar yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                ❌ {error}
            </div>
        );
    }

    if (!assets || assets.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <div className="empty-state-text">Henüz varlığınız bulunmuyor</div>
                <div className="empty-state-subtext">Yukarıdaki formu kullanarak ilk varlığınızı ekleyin</div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                <tr>
                    <th>Varlık</th>
                    <th>Değer</th>
                    <th>Vergi Tutarı</th>
                    <th>Durum</th>
                    <th>İşlem</th>
                </tr>
                </thead>
                <tbody>
                {assets.map(asset => {
                    const taxAmount = calculateTax(asset);
                    const isProcessing = processingIds.has(asset.id);

                    return (
                        <tr key={asset.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>
                                            {getTypeIcon(asset.type)}
                                        </span>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#333' }}>
                                            {asset.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                            {getTypeLabel(asset.type)}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                    <span style={{ fontWeight: '600', color: '#333' }}>
                                        ₺{asset.price.toLocaleString()}
                                    </span>
                            </td>
                            <td>
                                    <span style={{ fontWeight: '600', color: '#667eea' }}>
                                        ₺{taxAmount.toLocaleString()}
                                    </span>
                            </td>
                            <td>
                                    <span className={`status-badge ${asset.taxPaid ? 'status-paid' : 'status-unpaid'}`}>
                                        {asset.taxPaid ? '✅ Ödendi' : '❌ Ödenmedi'}
                                    </span>
                            </td>
                            <td>
                                {!asset.taxPaid && (
                                    <Button
                                        onClick={() => handlePayTax(asset.id)}
                                        className="btn-success"
                                        disabled={isProcessing}
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                                                Ödeniyor...
                                            </>
                                        ) : (
                                            <>
                                                💳 Vergi Öde
                                            </>
                                        )}
                                    </Button>
                                )}
                                {asset.taxPaid && (
                                    <span style={{ color: '#28a745', fontWeight: '600' }}>
                                            ✅ Tamamlandı
                                        </span>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default AssetList;