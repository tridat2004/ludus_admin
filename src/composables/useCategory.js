// composables/useCategory.js
export const useCategory = () => {
   const { $api } = useNuxtApp()

  // Get all categories
  const getCategories = async (params = {}) => {
  try {
    const res = await $api.get('/category/all', { params })
    // Lấy trực tiếp mảng categories
    return res.data?.data || []
  } catch (err) {
    console.error('getCategories error:', err)
    throw err
  }
}

  // Create category
  const createCategory = async (data) => {
    try {
      const res = await $api.post('/category/create', data)
      return res.data || res
    } catch (error) {
      console.error('createCategory error:', error)
      throw error
    }
  }

  // Update category
  const updateCategory = async (id, data) => {
    try {
      const res = await $api.patch(`/category/update/${id}`, data)
      return res.data || res
    } catch (error) {
      console.error('updateCategory error:', error)
      throw error
    }
  }

  // Delete category
  const deleteCategory = async (id) => {
    try {
      const res = await $api.delete(`/category/delete/${id}`)
      return res.data || res
    } catch (error) {
      console.error('deleteCategory error:', error)
      throw error
    }
  }

  return {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}