const TAX_RATES = {
    CAR: 0.10,
    COMMERCIAL: 0.18,
    HOUSE: 0.08,
    LAND: 0.05,
    STORE: 0.15,
    ELECTRONICS: 0.20,
    JEWELRY: 0.25,
    BOAT: 0.12
};

export const calculateTax = (product) => {
    if (!product || !product.price || !product.type) {
        return 0;
    }

    const rate = TAX_RATES[product.type] || 0;
    return product.price * rate;
};

export const getTaxRate = (productType) => {
    return TAX_RATES[productType] || 0;
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
};

export { TAX_RATES };