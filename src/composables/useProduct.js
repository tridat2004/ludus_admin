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

    const deleteProduct = async (id) => {
        try {
            const res = await $api.delete(`/product/delete/${id}`)
            return res.data || res
        } catch (error) {
            console.error('deleteProduct error:', error)
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
        getCategoriesAndSubcategories
    }
}