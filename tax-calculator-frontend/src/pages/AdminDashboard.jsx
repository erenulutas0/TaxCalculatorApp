import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/adminAPI';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]); // Orijinal sıralama için
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Sıralama state'leri
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Dashboard verileri yüklenirken hata oluştu');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
      setOriginalUsers(response.data); // Orijinal sıralamayı kaydet
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Kullanıcı verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sıralama fonksiyonu
  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Sayısal değerler için
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String değerler için
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    setUsers(sortedUsers);
  };

  // Reset fonksiyonu
  const handleReset = () => {
    setUsers([...originalUsers]);
    setSortConfig({ key: null, direction: null });
    toast.success('Tablo orijinal sıralamasına döndürüldü');
  };

  // Sıralama ikonları - Daha estetik versiyonu
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <span style={{ 
          color: '#9ca3af', 
          marginLeft: '8px',
          fontSize: '12px',
          opacity: 0.6,
          display: 'inline-flex',
          flexDirection: 'column',
          lineHeight: '0.5'
        }}>
          ▲<br/>▼
        </span>
      );
    }
    
    return (
      <span style={{ 
        color: '#3b82f6', 
        marginLeft: '8px',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        {sortConfig.direction === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const handleUserClick = async (userId, username) => {
    try {
      const response = await adminAPI.getUserProducts(userId);
      setUserProducts(response.data);
      setSelectedUser({ id: userId, username });
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user products:', error);
      toast.error('Kullanıcı ürünleri yüklenirken hata oluştu');
    }
  };

  const handleDeleteClick = (userId, username) => {
    setUserToDelete({ id: userId, username });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      await adminAPI.deleteUser(userToDelete.id);
      
      // Kullanıcı listesini güncelle
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setOriginalUsers(originalUsers.filter(user => user.id !== userToDelete.id));
      
      // Dashboard verilerini yenile
      fetchDashboardData();
      
      toast.success(`${userToDelete.username} kullanıcısı başarıyla silindi`);
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.error || 'Kullanıcı silinirken hata oluştu';
      toast.error(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const getTypeLabel = (type) => {
    const types = {
      'CAR': 'Araç',
      'COMMERCIAL': 'Ticari Araç',
      'HOUSE': 'Ev',
      'LAND': 'Arsa',
      'STORE': 'Mağaza',
      'ELECTRONICS': 'Elektronik',
      'JEWELRY': 'Mücevher',
      'BOAT': 'Tekne'
    };
    return types[type] || type;
  };

  const getProductIcon = (type) => {
    const icons = {
      'CAR': '🚗',
      'COMMERCIAL': '🚛',
      'HOUSE': '🏠',
      'LAND': '🌾',
      'STORE': '🏪',
      'ELECTRONICS': '📱',
      'JEWELRY': '💎',
      'BOAT': '⛵'
    };
    return icons[type] || '📦';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        color: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            👑 Admin Paneli - {user?.username}
          </h1>
          <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
            Tüm sistem verilerini yönetin
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          🚪 Çıkış Yap
        </button>
      </header>

      <div style={{ padding: '40px' }}>
        {/* Dashboard Stats */}
        {dashboardData && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            marginBottom: '40px' 
          }}>
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👥</div>
              <h3 style={{ color: '#1e40af', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {dashboardData.totalUsers}
              </h3>
              <p style={{ color: '#1e40af', margin: 0, fontWeight: '600' }}>Toplam Kullanıcı</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
              <h3 style={{ color: '#d97706', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {dashboardData.totalProducts}
              </h3>
              <p style={{ color: '#d97706', margin: 0, fontWeight: '600' }}>Toplam Ürün</p>
            </div>

            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <h3 style={{ color: '#059669', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {formatPrice(dashboardData.totalValue)}
              </h3>
              <p style={{ color: '#059669', margin: 0, fontWeight: '600' }}>Toplam Değer</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
              <h3 style={{ color: '#dc2626', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {formatPrice(dashboardData.totalTax)}
              </h3>
              <p style={{ color: '#dc2626', margin: 0, fontWeight: '600' }}>Toplam Vergi</p>
            </div>

            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <h3 style={{ color: '#065f46', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {formatPrice(dashboardData.totalPaidTax)}
              </h3>
              <p style={{ color: '#065f46', margin: 0, fontWeight: '600' }}>Ödenen Vergi</p>
            </div>

            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>❌</div>
              <h3 style={{ color: '#991b1b', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {formatPrice(dashboardData.totalUnpaidTax)}
              </h3>
              <p style={{ color: '#991b1b', margin: 0, fontWeight: '600' }}>Ödenmemiş Vergi</p>
            </div>

            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎯</div>
              <h3 style={{ color: '#065f46', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {dashboardData.paidTaxProducts}
              </h3>
              <p style={{ color: '#065f46', margin: 0, fontWeight: '600' }}>Ödenen Vergi Sayısı</p>
            </div>

            <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #fef2f2 0%, #fde2e2 100%)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
              <h3 style={{ color: '#991b1b', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {dashboardData.unpaidTaxProducts}
              </h3>
              <p style={{ color: '#991b1b', margin: 0, fontWeight: '600' }}>Ödenmemiş Vergi Sayısı</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px' 
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
              👥 Kullanıcı Listesi
            </h2>
            
            {/* Reset Button */}
            <button
              onClick={handleReset}
              style={{
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                color: '#374151',
                border: '2px solid #d1d5db',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🔄 Sıralamayi Sıfırla
            </button>
          </div>
          
          {users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                Henüz kullanıcı yok
              </h3>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>KULLANICI</th>
                    <th 
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('productCount')}
                    >
                      ÜRÜN SAYISI
                      {getSortIcon('productCount')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('totalValue')}
                    >
                      TOPLAM DEĞER
                      {getSortIcon('totalValue')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('totalTax')}
                    >
                      TOPLAM VERGİ
                      {getSortIcon('totalTax')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('paidTax')}
                    >
                      ÖDENEN VERGİ
                      {getSortIcon('paidTax')}
                    </th>
                    <th 
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      onClick={() => handleSort('unpaidTax')}
                    >
                      ÖDENMEMİŞ VERGİ
                      {getSortIcon('unpaidTax')}
                    </th>
                    <th>DURUM</th>
                    <th>İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                            padding: '12px',
                            borderRadius: '12px',
                            fontSize: '20px'
                          }}>
                            👤
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                              {user.username}
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280' }}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827' }}>
                        {user.productCount}
                      </td>
                      <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827' }}>
                        {formatPrice(user.totalValue)}
                      </td>
                      <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#3b82f6' }}>
                        {formatPrice(user.totalTax)}
                      </td>
                      <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#10b981' }}>
                        {formatPrice(user.paidTax)}
                      </td>
                      <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#ef4444' }}>
                        {formatPrice(user.unpaidTax)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{
                            background: user.paidTaxCount > 0 ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                            color: user.paidTaxCount > 0 ? '#059669' : '#dc2626',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            ✅ {user.paidTaxCount}
                          </span>
                          <span style={{
                            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                            color: '#dc2626',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            ❌ {user.unpaidTaxCount}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserClick(user.id, user.username);
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                              color: '#1e40af',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            👁️ Görüntüle
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(user.id, user.username);
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                              color: '#dc2626',
                              border: 'none',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
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
          )}
        </div>
      </div>

      {/* User Products Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '900px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {selectedUser.username} - Mal Varlıkları
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px'
                }}
              >
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {userProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <p>Bu kullanıcının henüz ürünü yok</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ÜRÜN</th>
                      <th>TİP</th>
                      <th>DEĞER</th>
                      <th>VERGİ TUTARI</th>
                      <th>DURUM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ fontSize: '20px' }}>
                              {getProductIcon(product.type)}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                {product.name}
                              </div>
                              {product.description && (
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                            color: '#1e40af',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {getTypeLabel(product.type)}
                          </span>
                        </td>
                        <td style={{ fontSize: '14px', fontWeight: 'bold' }}>
                          {formatPrice(product.price)}
                        </td>
                        <td style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981' }}>
                          {formatPrice(product.taxAmount)}
                        </td>
                        <td>
                          <span style={{
                            background: product.taxPaid 
                              ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                              : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                            color: product.taxPaid ? '#059669' : '#dc2626',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {product.taxPaid ? '✅ Ödendi' : '❌ Ödenmedi'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '20px',
                filter: 'grayscale(1)'
              }}>
                ⚠️
              </div>
              
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#dc2626', 
                margin: '0 0 16px 0' 
              }}>
                Kullanıcı Silme Onayı
              </h3>
              
              <p style={{ 
                fontSize: '16px', 
                color: '#374151', 
                margin: '0 0 24px 0',
                lineHeight: '1.6'
              }}>
                <strong>{userToDelete.username}</strong> kullanıcısını silmek istediğinizden emin misiniz?
                <br />
                <br />
                ⚠️ <strong>Bu işlem geri alınamaz!</strong>
                <br />
                Kullanıcının tüm ürünleri de silinecektir.
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'center' 
              }}>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  disabled={deleteLoading}
                  style={{
                    background: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                    color: '#374151',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  ❌ İptal
                </button>
                
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  style={{
                    background: deleteLoading 
                      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                      : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {deleteLoading ? '🔄 Siliniyor...' : '🗑️ Evet, Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;