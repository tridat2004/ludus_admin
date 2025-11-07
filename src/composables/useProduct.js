// composables/useProduct.js
export default () => {
    const { $api } = useNuxtApp()

    const getProducts = async (params = {}) => {
        try {
            const res = await $api.get('/product/all', { params })
            return res.data || res
        } catch (error) {
            console.error('getProducts error:', error)
            throw error
        }
    }

    const createProduct = async (categoryId, data) => {
        try {
            const formData = new FormData()
            
            // Append all fields to FormData
            Object.keys(data).forEach(key => {
                if (key === 'file' && data[key]) {
                    formData.append('file', data[key])
                } else if (Array.isArray(data[key])) {
                    formData.append(key, JSON.stringify(data[key]))
                } else if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key])
                }
            })

            const res = await $api.post(`/product/create/${categoryId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return res.data || res
        } catch (error) {
            console.error('createProduct error:', error)
            throw error
        }
    }

    const updateProduct = async (id, data) => {
        try {
            const formData = new FormData()
            
            // Append all fields to FormData
            Object.keys(data).forEach(key => {
                if (key === 'file' && data[key]) {
                    formData.append('file', data[key])
                } else if (Array.isArray(data[key])) {
                    formData.append(key, JSON.stringify(data[key]))
                } else if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key])
                }
            })

            const res = await $api.patch(`/product/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return res.data || res
        } catch (error) {
            console.error('updateProduct error:', error)
            throw error
        }
    }
    const deleteProductVariantByProduct = async (productId) => {
        try {
            console.log(`🗑️ Lấy danh sách biến thể của sản phẩm ${productId}`)
            const res = await $api.get(`/product-variant/all/${productId}`)
            
            // Cấu trúc trả về có thể res.data.data.data
            const variants = res.data?.data?.data || [] 

            if (!Array.isArray(variants)) {
            console.error('Variants không phải mảng:', variants)
            return
            }

            for (const variant of variants) {
            const variantId = variant._id?.$oid || variant.id
            if (!variantId) continue
            console.log(`🗑️ Xoá biến thể ID: ${variantId}`)
            await $api.delete(`/product-variant/delete/${variantId}`)
            }

            console.log(`✅ Đã xoá toàn bộ biến thể của sản phẩm ${productId}`)
        } catch (err) {
            console.error('deleteProductVariantByProduct error:', err)
            throw err
        }
}
// useProduct.js

// Hàm kiểm tra product còn ảnh hay không
const checkProductHasImages = async (productId) => {
  try {
    const res = await $api.get(`/product/all`, { 
      params: { id: productId, limit: 1, offset: 0 } 
    })
    const product = res.data?.data?.data?.[0]
    if (!product) return false
    return product.productImages && product.productImages.length > 0
  } catch (err) {
    console.error('checkProductHasImages error:', err)
    return true // nếu lỗi thì mặc định coi như có ảnh để tránh xoá nhầm
  }
}


const deleteProduct = async (id) => {
  try {
    console.log("🗑️ Đang gửi yêu cầu xoá sản phẩm ID:", id)
    
    // Xoá tất cả biến thể trước
    await deleteProductVariantByProduct(id);

    // Sau đó xoá sản phẩm
    const res = await $api.delete(`/product/delete/${id}`)
    return res.data || res || []
  } catch (error) {
    console.error('deleteProduct error:', error)
    throw error
  }
}



    const uploadProductImages = async (productId, files) => {
        try {
            const formData = new FormData()
            
            // Append multiple files
            files.forEach(file => {
                formData.append('files', file)
            })

            const res = await $api.post(`/product/upload-images/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return res.data || res
        } catch (error) {
            console.error('uploadProductImages error:', error)
            throw error
        }
    }

    const getCategoriesAndSubcategories = async () => {
        try {
            const res = await $api.get('/product/categories-subcategories')
            return res.data || res
        } catch (error) {
            console.error('getCategoriesAndSubcategories error:', error)
            throw error
        }
    }

    return {
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        uploadProductImages,
        getCategoriesAndSubcategories,
        deleteProductVariantByProduct,
        checkProductHasImages
    }
}