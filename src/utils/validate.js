// utils/validate.js

// Kiểm tra email hợp lệ
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Kiểm tra URL hợp lệ
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate dữ liệu sản phẩm
export const validateProduct = (data, requireImage = true) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3)
    errors.push("Tên sản phẩm phải có ít nhất 3 ký tự.");

  if (!data.description || data.description.trim().length < 10)
    errors.push("Mô tả sản phẩm phải có ít nhất 10 ký tự.");

  if (!data.price || isNaN(data.price) || Number(data.price) <= 0)
    errors.push("Giá sản phẩm phải là số lớn hơn 0.");

  if (
    data.stockQuantity === undefined ||
    isNaN(data.stockQuantity) ||
    Number(data.stockQuantity) < 0
  )
    errors.push("Số lượng tồn kho phải là số nguyên ≥ 0.");

  if (!data.productCode || !/^[A-Za-z0-9_-]+$/.test(data.productCode))
    errors.push("Mã sản phẩm chỉ được chứa chữ, số, gạch ngang và gạch dưới.");

  if (!data.subcategoryId)
    errors.push("Vui lòng chọn danh mục con.");

  if (requireImage && !data.imageUrl)
    errors.push("Vui lòng tải lên hình ảnh sản phẩm.");

  if (data.imageUrl && !isValidUrl(data.imageUrl))
    errors.push("Đường dẫn hình ảnh không hợp lệ.");

  if (!Array.isArray(data.colors) || data.colors.length === 0)
    errors.push("Vui lòng chọn ít nhất 1 màu sắc.");

  if (!Array.isArray(data.sizes) || data.sizes.length === 0)
    errors.push("Vui lòng chọn ít nhất 1 kích thước.");

  return errors;
};
