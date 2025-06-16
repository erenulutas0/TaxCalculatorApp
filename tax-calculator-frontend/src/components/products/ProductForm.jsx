import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'CAR',
    price: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        type: product.type || 'CAR',
        price: product.price || '',
        description: product.description || ''
      });
    }
  }, [product]);

  const productTypes = [
    { value: 'CAR', label: 'Araba (2%)' },
    { value: 'COMMERCIAL', label: 'Ticari Araç (3%)' },
    { value: 'HOUSE', label: 'Ev (0.1%)' },
    { value: 'LAND', label: 'Arsa (0.1%)' },
    { value: 'STORE', label: 'Mağaza (0.2%)' },
    { value: 'ELECTRONICS', label: 'Elektronik (18%)' },
    { value: 'JEWELRY', label: 'Mücevher (20%)' },
    { value: 'BOAT', label: 'Tekne (5%)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
  };

  const buttonPrimaryStyle = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1
  };

  const buttonSecondaryStyle = {
    background: '#f3f4f6',
    color: '#374151',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Product Name */}
      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '8px' 
        }}>
          Ürün Adı *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Ürün adını girin"
          required
        />
      </div>

      {/* Product Type */}
      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '8px' 
        }}>
          Ürün Tipi *
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          {productTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '8px' 
        }}>
          Fiyat (₺) *
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Fiyatı girin"
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '8px' 
        }}>
          Açıklama
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
          placeholder="Ürün açıklaması (opsiyonel)"
          rows="3"
        />
      </div>

      {/* Submit Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button
          type="button"
          onClick={onClose}
          style={buttonSecondaryStyle}
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonPrimaryStyle,
            opacity: loading ? 0.5 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <span>
              {product ? 'Güncelleniyor...' : 'Ekleniyor...'}
            </span>
          ) : (
            product ? 'Güncelle' : 'Ekle'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;