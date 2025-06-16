import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import ProductForm from '../components/products/ProductForm';

// Heroicons yerine basit SVG iconlar
const PlusIcon = ({ style }) => (
  <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const PencilIcon = ({ style }) => (
  <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = ({ style }) => (
  <svg style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [taxCalculation, setTaxCalculation] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, taxResponse] = await Promise.all([
        productsAPI.getAll(),
        productsAPI.getTaxCalculation()
      ]);
      
      setProducts(productsResponse.data);
      setTaxCalculation(taxResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        toast.success('Ürün başarıyla güncellendi!');
      } else {
        await productsAPI.create(formData);
        toast.success('Ürün başarıyla eklendi!');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Ürün kaydedilirken hata oluştu');
    }
  };

  const handlePayTax = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Ürün bulunamadı');
      }

      const updatedProduct = { ...product, taxPaid: true };
      
      await productsAPI.update(productId, updatedProduct);
      toast.success('Vergi başarıyla ödendi!');
      fetchData();
    } catch (error) {
      console.error('Error paying tax:', error);
      toast.error('Vergi ödeme sırasında hata oluştu');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await productsAPI.delete(productId);
        toast.success('Ürün başarıyla silindi!');
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Ürün silinirken hata oluştu');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
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

  const getTaxRate = (type) => {
    const rates = {
      'CAR': '2%',
      'COMMERCIAL': '3%',
      'HOUSE': '0.1%',
      'LAND': '0.1%',
      'STORE': '0.2%',
      'ELECTRONICS': '18%',
      'JEWELRY': '20%',
      'BOAT': '5%'
    };
    return rates[type] || '0%';
  };

  const calculateTaxAmount = (price, type) => {
    const rates = {
      'CAR': 0.02,
      'COMMERCIAL': 0.03,
      'HOUSE': 0.001,
      'LAND': 0.001,
      'STORE': 0.002,
      'ELECTRONICS': 0.18,
      'JEWELRY': 0.20,
      'BOAT': 0.05
    };
    return price * (rates[type] || 0);
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
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
        color: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Merhaba, {user?.username}! 👋
          </h1>
          <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
            Vergi hesaplama sistemine hoşgeldiniz
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
        {/* Stats Cards */}
        {taxCalculation && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px', 
            marginBottom: '40px' 
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <h3 style={{ color: '#059669', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {formatPrice(taxCalculation.totalValue)}
              </h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Toplam Değer</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
              <h3 style={{ color: '#dc2626', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {formatPrice(taxCalculation.totalTax)}
              </h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Toplam Vergi</p>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
              <h3 style={{ color: '#3b82f6', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {formatPrice(taxCalculation.totalValue + taxCalculation.totalTax)}
              </h3>
              <p style={{ color: '#6b7280', margin: 0 }}>Vergi Dahil Toplam</p>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px' 
          }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                Mal Varlıkları
              </h2>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
                Tüm mal varlıklarınızı görüntüleyin ve yönetin
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <PlusIcon style={{ width: '20px', height: '20px' }} />
              Yeni Mal Varlığı Ekle
            </button>
          </div>

          {products.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#6b7280' 
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                Henüz mal varlığınız yok
              </h3>
              <p style={{ margin: 0 }}>
                İlk mal varlığınızı eklemek için yukarıdaki butona tıklayın
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>MAL VARLIĞI</th>
                    <th>TİP</th>
                    <th>DEĞER</th>
                    <th>VERGİ ORANI</th>
                    <th>VERGİ TUTARI</th>
                    <th>İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div className={`status-indicator ${product.taxPaid ? 'status-paid' : 'status-unpaid'}`}></div>
                          <div style={{
                            background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                            padding: '14px',
                            borderRadius: '12px',
                            fontSize: '20px'
                          }}>
                            {getProductIcon(product.type)}
                          </div>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                              {product.name}
                            </div>
                            {product.description && (
                              <div style={{ fontSize: '13px', color: '#6b7280' }}>
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
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {getTypeLabel(product.type)}
                        </span>
                      </td>
                      <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827' }}>
                        {formatPrice(product.price)}
                      </td>
                      <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#3b82f6' }}>
                        {getTaxRate(product.type)}
                      </td>
                      <td style={{ fontSize: '15px', fontWeight: 'bold', color: '#10b981' }}>
                        {formatPrice(calculateTaxAmount(product.price, product.type))}
                      </td>
                      <td>
                        <div className="button-group">
                          {!product.taxPaid ? (
                            <button
                              onClick={() => handlePayTax(product.id)}
                              style={{
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}
                            >
                              💳 Vergisini Öde
                            </button>
                          ) : (
                            <div style={{
                              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                              color: '#059669',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              ✅ Ödendi
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleEdit(product)}
                            className="btn-secondary"
                            style={{ padding: '10px' }}
                          >
                            <PencilIcon style={{ width: '16px', height: '16px' }} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(product.id)}
                            style={{
                              background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                              color: '#dc2626',
                              padding: '10px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <TrashIcon style={{ width: '16px', height: '16px' }} />
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {editingProduct ? 'Mal Varlığını Düzenle' : 'Yeni Mal Varlığı Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
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
            <ProductForm
              product={editingProduct}
              onSubmit={handleProductSubmit}
              onClose={() => {
                setShowModal(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;