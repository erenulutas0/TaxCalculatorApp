import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService.js';
import { calculateTax } from '../../utils/taxUtils.js';

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

const UserModal = ({ user, products, onClose }) => {
    if (!user) return null;

    const totalValue = products.reduce((sum, product) => sum + Number(product.price), 0);
    const totalTax = products.reduce((sum, product) => sum + calculateTax(product), 0);
    const paidTax = products.filter(product => product.taxPaid).reduce((sum, product) => sum + calculateTax(product), 0);
    const unpaidTax = totalTax - paidTax;
    const paidCount = products.filter(product => product.taxPaid).length;
    const unpaidCount = products.length - paidCount;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        👤 {user.username} - Detaylı Görünüm
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body">
                    {/* User Info Section */}
                    <div className="user-info-section">
                        <div className="user-info-grid">
                            <div className="user-info-item">
                                <span className="user-info-label">👤 Kullanıcı Adı</span>
                                <span className="user-info-value">{user.username}</span>
                            </div>
                            <div className="user-info-item">
                                <span className="user-info-label">📧 E-posta</span>
                                <span className="user-info-value">{user.email}</span>
                            </div>
                            <div className="user-info-item">
                                <span className="user-info-label">📦 Toplam Varlık</span>
                                <span className="user-info-value">{products.length} adet</span>
                            </div>
                            <div className="user-info-item">
                                <span className="user-info-label">📅 Kayıt Tarihi</span>
                                <span className="user-info-value">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* User Stats */}
                    <div className="user-stats-grid">
                        <div className="user-stat-card">
                            <div className="user-stat-icon">💰</div>
                            <div className="user-stat-value">₺{totalValue.toLocaleString()}</div>
                            <div className="user-stat-label">Toplam Değer</div>
                        </div>
                        <div className="user-stat-card">
                            <div className="user-stat-icon">📊</div>
                            <div className="user-stat-value">₺{totalTax.toLocaleString()}</div>
                            <div className="user-stat-label">Toplam Vergi</div>
                        </div>
                        <div className="user-stat-card">
                            <div className="user-stat-icon">✅</div>
                            <div className="user-stat-value">₺{paidTax.toLocaleString()}</div>
                            <div className="user-stat-label">Ödenen Vergi</div>
                        </div>
                        <div className="user-stat-card">
                            <div className="user-stat-icon">⚠️</div>
                            <div className="user-stat-value">₺{unpaidTax.toLocaleString()}</div>
                            <div className="user-stat-label">Kalan Borç</div>
                        </div>
                    </div>

                    {/* Products Section */}
                    <div className="products-section">
                        <div className="products-header">
                            <h3 className="products-title">🏠 Kullanıcının Varlıkları</h3>
                            <span className="products-count">
                                {products.length} varlık
                            </span>
                        </div>

                        {products.length === 0 ? (
                            <div className="empty-products">
                                <div className="empty-products-icon">📦</div>
                                <p><strong>Bu kullanıcının henüz varlığı bulunmuyor</strong></p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                    Kullanıcı giriş yaptığında varlık ekleyebilecek
                                </p>
                            </div>
                        ) : (
                            products.map(product => {
                                const taxAmount = calculateTax(product);
                                return (
                                    <div key={product.id} className="product-card">
                                        <div className="product-header">
                                            <div className="product-main-info">
                                                <div className="product-icon">
                                                    {getTypeIcon(product.type)}
                                                </div>
                                                <div className="product-details">
                                                    <h4>{product.name}</h4>
                                                    <span className="product-type">
                                                        {getTypeLabel(product.type)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="product-status">
                                                <span className={`status-badge large ${product.taxPaid ? 'status-paid' : 'status-unpaid'}`}>
                                                    {product.taxPaid ? '✅ Vergisi Ödendi' : '❌ Vergi Ödenmedi'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="product-metrics">
                                            <div className="product-metric">
                                                <div className="product-metric-value">
                                                    ₺{product.price.toLocaleString()}
                                                </div>
                                                <div className="product-metric-label">Değer</div>
                                            </div>
                                            <div className="product-metric">
                                                <div className="product-metric-value">
                                                    ₺{taxAmount.toLocaleString()}
                                                </div>
                                                <div className="product-metric-label">Vergi Tutarı</div>
                                            </div>
                                            <div className="product-metric">
                                                <div className="product-metric-value">
                                                    %{(calculateTax({ ...product, price: 100 })).toFixed(1)}
                                                </div>
                                                <div className="product-metric-label">Vergi Oranı</div>
                                            </div>
                                            <div className="product-metric">
                                                <div className="product-metric-value">
                                                    {product.createdAt ?
                                                        new Date(product.createdAt).toLocaleDateString('tr-TR') :
                                                        'Bilinmiyor'
                                                    }
                                                </div>
                                                <div className="product-metric-label">Eklenme Tarihi</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserProducts, setSelectedUserProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const userList = await adminService.getAllUsersWithProducts();
            setUsers(userList);
        } catch (err) {
            setError('Kullanıcılar getirilemedi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleView = async (user) => {
        try {
            const products = await adminService.getUserProductsById(user.id);
            setSelectedUser(user);
            setSelectedUserProducts(products);
            setIsModalOpen(true);
        } catch (err) {
            alert("Kullanıcının ürünleri getirilemedi.");
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
            try {
                await adminService.deleteUserById(userId);
                fetchUsers();
                alert('Kullanıcı başarıyla silindi.');
            } catch (err) {
                alert('Kullanıcı silinemedi: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setSelectedUserProducts([]);
    };

    if (loading) {
        return (
            <div className="empty-state">
                <div className="spinner"></div>
                <p>Kullanıcılar yükleniyor...</p>
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

    if (!users || users.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">👥</div>
                <div className="empty-state-text">Henüz kullanıcı bulunmuyor</div>
                <div className="empty-state-subtext">Kullanıcılar kayıt oldukça burada görünecekler</div>
            </div>
        );
    }

    return (
        <>
            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <th>👤 Kullanıcı</th>
                        <th>📧 Email</th>
                        <th>📦 Varlık</th>
                        <th>💰 Değer</th>
                        <th>📊 Vergi</th>
                        <th>✅ Ödenen</th>
                        <th>❌ Borç</th>
                        <th>⚙️ İşlemler</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <div style={{ fontWeight: '600', color: '#333' }}>
                                    {user.username}
                                </div>
                            </td>
                            <td>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                    {user.email}
                                </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                                    <span style={{
                                        fontWeight: '600',
                                        color: '#667eea',
                                        background: 'rgba(102, 126, 234, 0.1)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '12px'
                                    }}>
                                        {user.productCount}
                                    </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: '600', color: '#28a745' }}>
                                        ₺{user.totalValue?.toLocaleString()}
                                    </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: '600', color: '#667eea' }}>
                                        ₺{user.totalTax?.toLocaleString()}
                                    </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: '600', color: '#28a745' }}>
                                        ₺{user.paidTax?.toLocaleString()}
                                    </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontWeight: '600',
                                        color: user.unpaidTax > 0 ? '#dc3545' : '#28a745'
                                    }}>
                                        ₺{user.unpaidTax?.toLocaleString()}
                                    </span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button
                                        onClick={() => handleView(user)}
                                        className="btn btn-primary"
                                    >
                                        👁️ Görüntüle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="btn btn-danger"
                                    >
                                        🗑️ Sil
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <UserModal
                    user={selectedUser}
                    products={selectedUserProducts}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default UserTable;