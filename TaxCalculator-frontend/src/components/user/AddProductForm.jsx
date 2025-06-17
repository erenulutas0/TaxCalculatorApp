import React, { useState } from 'react';
import productService from '../../services/productService.js';

const productTypes = [
    { value: "CAR", label: "Araba", icon: "🚗" },
    { value: "COMMERCIAL", label: "Ticari", icon: "🏢" },
    { value: "HOUSE", label: "Ev", icon: "🏠" },
    { value: "LAND", label: "Arsa", icon: "🌍" },
    { value: "STORE", label: "Mağaza", icon: "🏪" },
    { value: "ELECTRONICS", label: "Elektronik", icon: "📱" },
    { value: "JEWELRY", label: "Mücevher", icon: "💎" },
    { value: "BOAT", label: "Tekne", icon: "⛵" }
];

const AddProductForm = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        type: 'CAR'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.price || !formData.type) {
            setError('Tüm alanlar zorunludur.');
            return;
        }

        if (parseFloat(formData.price) <= 0) {
            setError('Fiyat 0\'dan büyük olmalıdır.');
            return;
        }

        try {
            setLoading(true);
            await productService.createProduct({
                name: formData.name,
                price: parseFloat(formData.price),
                type: formData.type
            });

            setSuccess('Varlık başarıyla eklendi! ✅');
            setFormData({ name: '', price: '', type: 'CAR' });

            if (onProductAdded) {
                onProductAdded();
            }

            // Success mesajını 3 saniye sonra temizle
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Varlık eklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && (
                <div className="alert alert-error">
                    ❌ {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Varlık Adı</label>
                        <input
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="Örn: BMW X5"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Fiyat (₺)</label>
                        <input
                            type="number"
                            name="price"
                            className="form-input"
                            placeholder="Örn: 1200000"
                            value={formData.price}
                            onChange={handleChange}
                            disabled={loading}
                            min="1"
                            step="0.01"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tür</label>
                        <select
                            name="type"
                            className="form-select"
                            value={formData.type}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {productTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.icon} {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                                    Ekleniyor...
                                </>
                            ) : (
                                <>
                                    ➕ Ekle
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProductForm;