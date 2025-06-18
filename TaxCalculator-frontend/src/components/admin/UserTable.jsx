import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

// YENİ MODERN MODAL TASARIMI
const UserModal = ({ user, products, onClose }) => {
    if (!user) return null;

    const totalValue = products.reduce((sum, product) => sum + Number(product.price), 0);
    const totalTax = products.reduce((sum, product) => sum + calculateTax(product), 0);
    const paidTax = products.filter(product => product.taxPaid).reduce((sum, product) => sum + calculateTax(product), 0);
    const unpaidTax = totalTax - paidTax;

    const modalContent = (
        <div className="modern-modal-overlay" onClick={onClose}>
            <div className="modern-modal-content" onClick={e => e.stopPropagation()}>

                {/* Modern Header */}
                <div className="modern-modal-header">
                    <div className="modal-header-content">
                        <div className="user-avatar">
                            <span className="avatar-icon">👤</span>
                        </div>
                        <div className="user-info">
                            <h2 className="user-name">{user.username}</h2>
                            <p className="user-email">{user.email}</p>
                            <div className="user-badge">
                                <span className="badge-text">Detaylı Varlık Görünümü</span>
                            </div>
                        </div>
                    </div>
                    <button className="modern-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {/* Modern Stats Grid */}
                <div className="modern-stats-container">
                    <div className="modern-stats-grid">
                        <div className="modern-stat-card value-card">
                            <div className="stat-card-header">
                                <div className="stat-icon-wrapper value-icon">
                                    <span>💰</span>
                                </div>
                                <div className="stat-trend">
                                    <span className="trend-arrow">↗</span>
                                </div>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">₺{totalValue.toLocaleString()}</h3>
                                <p className="stat-label">Toplam Değer</p>
                            </div>
                        </div>

                        <div className="modern-stat-card tax-card">
                            <div className="stat-card-header">
                                <div className="stat-icon-wrapper tax-icon">
                                    <span>📊</span>
                                </div>
                                <div className="stat-trend">
                                    <span className="trend-arrow">↗</span>
                                </div>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">₺{totalTax.toLocaleString()}</h3>
                                <p className="stat-label">Toplam Vergi</p>
                            </div>
                        </div>

                        <div className="modern-stat-card paid-card">
                            <div className="stat-card-header">
                                <div className="stat-icon-wrapper paid-icon">
                                    <span>✅</span>
                                </div>
                                <div className="stat-trend">
                                    <span className="trend-arrow">↗</span>
                                </div>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">₺{paidTax.toLocaleString()}</h3>
                                <p className="stat-label">Ödenen Vergi</p>
                            </div>
                        </div>

                        <div className="modern-stat-card debt-card">
                            <div className="stat-card-header">
                                <div className="stat-icon-wrapper debt-icon">
                                    <span>⚠️</span>
                                </div>
                                <div className="stat-trend">
                                    <span className="trend-arrow">↘</span>
                                </div>
                            </div>
                            <div className="stat-content">
                                <h3 className="stat-value">₺{unpaidTax.toLocaleString()}</h3>
                                <p className="stat-label">Kalan Borç</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modern Table Section */}
                <div className="modern-table-section">
                    <div className="table-section-header">
                        <div className="section-title">
                            <h3>🏠 Kullanıcının Varlıkları</h3>
                            <span className="asset-count">{products.length} adet</span>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="modern-empty-state">
                            <div className="empty-illustration">
                                <div className="empty-icon">📦</div>
                                <div className="empty-circles">
                                    <div className="circle circle-1"></div>
                                    <div className="circle circle-2"></div>
                                    <div className="circle circle-3"></div>
                                </div>
                            </div>
                            <div className="empty-content">
                                <h3>Henüz varlık bulunmuyor</h3>
                                <p>Bu kullanıcı giriş yaptığında varlık ekleyebilecek</p>
                            </div>
                        </div>
                    ) : (
                        <div className="modern-table-wrapper">
                            <div className="modern-table-container">
                                <table className="modern-table">
                                    <thead>
                                    <tr>
                                        <th>Varlık</th>
                                        <th>Tür</th>
                                        <th>Değer</th>
                                        <th>Vergi Tutarı</th>
                                        <th>Vergi Oranı</th>
                                        <th>Durum</th>
                                        <th>Tarih</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {products.map((product, index) => {
                                        const taxAmount = calculateTax(product);
                                        const taxRate = (calculateTax({ ...product, price: 100 })).toFixed(1);
                                        return (
                                            <tr key={product.id} className="table-row" style={{ animationDelay: `${index * 0.1}s` }}>
                                                <td>
                                                    <div className="asset-cell">
                                                        <div className="asset-icon">
                                                            {getTypeIcon(product.type)}
                                                        </div>
                                                        <div className="asset-info">
                                                            <span className="asset-name">{product.name}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                        <span className="type-badge">
                                                            {getTypeLabel(product.type)}
                                                        </span>
                                                </td>
                                                <td>
                                                        <span className="value-amount">
                                                            ₺{product.price.toLocaleString()}
                                                        </span>
                                                </td>
                                                <td>
                                                        <span className="tax-amount">
                                                            ₺{taxAmount.toLocaleString()}
                                                        </span>
                                                </td>
                                                <td>
                                                        <span className="rate-pill">
                                                            %{taxRate}
                                                        </span>
                                                </td>
                                                <td>
                                                    <div className={`status-indicator ${product.taxPaid ? 'paid' : 'unpaid'}`}>
                                                        <div className="status-dot"></div>
                                                        <span className="status-text">
                                                                {product.taxPaid ? 'Ödendi' : 'Ödenmedi'}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td>
                                                        <span className="date-badge">
                                                            {product.createdAt ?
                                                                new Date(product.createdAt).toLocaleDateString('tr-TR') :
                                                                'Bilinmiyor'
                                                            }
                                                        </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

// YENİ MODERN DELETE CONFIRMATION MODAL
const DeleteConfirmModal = ({ user, onConfirm, onCancel }) => {
    if (!user) return null;

    const modalContent = (
        <div className="delete-modal-overlay" onClick={onCancel}>
            <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
                <div className="delete-modal-header">
                    <div className="delete-icon-wrapper">
                        <div className="delete-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FF4757" strokeWidth="2"/>
                                <path d="M12 8V12" stroke="#FF4757" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M12 16H12.01" stroke="#FF4757" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                    <button className="delete-close-btn" onClick={onCancel}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="delete-modal-body">
                    <h3 className="delete-title">Kullanıcıyı Sil</h3>
                    <p className="delete-message">
                        <strong>{user.username}</strong> kullanıcısını silmek istediğinizden emin misiniz?
                    </p>
                    <div className="delete-warning">
                        <div className="warning-icon">⚠️</div>
                        <div className="warning-text">
                            <strong>Dikkat:</strong> Bu işlem geri alınamaz. Kullanıcının tüm varlıkları ve vergi kayıtları silinecektir.
                        </div>
                    </div>

                    <div className="user-preview">
                        <div className="preview-header">
                            <span className="preview-icon">👤</span>
                            <div className="preview-info">
                                <div className="preview-name">{user.username}</div>
                                <div className="preview-email">{user.email}</div>
                            </div>
                        </div>
                        <div className="preview-stats">
                            <div className="preview-stat">
                                <span className="stat-number">{user.productCount || 0}</span>
                                <span className="stat-label">Varlık</span>
                            </div>
                            <div className="preview-stat">
                                <span className="stat-number">₺{(user.totalValue || 0).toLocaleString()}</span>
                                <span className="stat-label">Toplam Değer</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="delete-modal-footer">
                    <button className="delete-cancel-btn" onClick={onCancel}>
                        <span className="btn-icon">↩️</span>
                        İptal Et
                    </button>
                    <button className="delete-confirm-btn" onClick={onConfirm}>
                        <span className="btn-icon">🗑️</span>
                        Evet, Sil
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

// UserTable komponenti güncellemesi
const UserTable = ({ onUserDeleted }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserProducts, setSelectedUserProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Yeni state'ler
    const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
            document.body.classList.add('modal-open');
        } catch (err) {
            alert("Kullanıcının ürünleri getirilemedi.");
        }
    };

    const handleDelete = async (user) => {
        setDeleteConfirmUser(user);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmUser) return;

        try {
            setIsDeleting(true);
            await adminService.deleteUserById(deleteConfirmUser.id);

            // Kullanıcıyı listeden kaldır
            setUsers(prevUsers => prevUsers.filter(user => user.id !== deleteConfirmUser.id));

            setDeleteConfirmUser(null);

            // Üst bileşene silme işlemini bildir
            if (onUserDeleted) {
                onUserDeleted();
            }

        } catch (err) {
            console.error('Kullanıcı silinemedi:', err);
            alert('Kullanıcı silme işlemi başarısız: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmUser(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setSelectedUserProducts([]);
        document.body.classList.remove('modal-open');
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isModalOpen]);

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
                        <th>📈 Durum</th>
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
                            <td style={{ textAlign: 'center' }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.3rem',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        background: 'linear-gradient(135deg, #28a745, #20c997)',
                                        color: 'white',
                                        padding: '0.2rem 0.4rem',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                        boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
                                    }}>
                                        ✅ {user.paidTaxCount || 0}
                                    </span>
                                    <span style={{
                                        background: 'linear-gradient(135deg, #dc3545, #fd7e14)',
                                        color: 'white',
                                        padding: '0.2rem 0.4rem',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                        boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
                                    }}>
                                        ❌ {user.unpaidTaxCount || 0}
                                    </span>
                                </div>
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
                                        onClick={() => handleDelete(user)}
                                        className="btn btn-danger"
                                        disabled={isDeleting}
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

            {deleteConfirmUser && (
                <DeleteConfirmModal
                    user={deleteConfirmUser}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </>
    );
};

export default UserTable;