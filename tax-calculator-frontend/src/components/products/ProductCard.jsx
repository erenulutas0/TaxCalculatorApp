import React from 'react';
import { Edit, Trash2, TrendingUp } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, icon }) => {
  const getTypeLabel = (type) => {
    const types = {
      'CAR': 'Araba',
      'COMMERCIAL_VEHICLE': 'Ticari Araç',
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
      'COMMERCIAL_VEHICLE': '3%',
      'HOUSE': '0.1%',
      'LAND': '0.1%',
      'STORE': '0.2%',
      'ELECTRONICS': '18%',
      'JEWELRY': '20%',
      'BOAT': '5%'
    };
    return rates[type] || '0%';
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {getTypeLabel(product.type)}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Düzenle"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Sil"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
      )}

      {/* Price and Tax Info */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Fiyat:</span>
          <span className="text-lg font-semibold text-gray-900">
            ₺{product.price?.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Vergi Oranı:</span>
          <span className="text-sm font-medium text-blue-600">
            {getTaxRate(product.type)}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-500">Vergi Tutarı:</span>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            <span className="text-lg font-semibold text-green-600">
              ₺{product.taxAmount?.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Toplam:</span>
          <span className="text-xl font-bold text-gray-900">
            ₺{((product.price || 0) + (product.taxAmount || 0)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;