


export const formatTime = (time) => {
  return new Date(time).toLocaleTimeString();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};