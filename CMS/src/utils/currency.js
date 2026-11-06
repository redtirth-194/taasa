/**
 * Indian Rupee (INR / ₹) Currency Formatting Utilities
 * Formats numbers in standard Indian numbering system (Lakhs & Crores)
 * e.g. 18500 -> "₹18,500", 49999 -> "₹49,999", 125000 -> "₹1,25,000"
 */

export const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '₹0';
  const num = Math.round(Number(amount));
  return `₹${num.toLocaleString('en-IN')}`;
};

export const formatPrice = formatINR;

export const formatINRWithDecimals = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '₹0.00';
  const num = Number(amount);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default formatINR;

