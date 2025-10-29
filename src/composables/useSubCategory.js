// composables/useSubCategory.js
export const useSubCategory = () => {
  const { $api } = useNuxtApp()

  // Get all subcategories
  const getSubCategories = async (params = {}) => {
  try {
    const res = await $api.get('/subcategory/all', { params })
    // Lấy mảng con trong data
    return res.data?.data || []
  } catch (error) {
    console.error('getSubCategories error:', error)
    throw error
  }
}


  // Create subcategory
  const createSubCategory = async (categoryId, data) => {
    try {
      const res = await $api.post(`/subcategory/create/${categoryId}`, data)
      return res.data || res
    } catch (error) {
      console.error('createSubCategory error:', error)
      throw error
    }
  }

  // Update subcategory
  const updateSubCategory = async (id, data) => {
    try {
      const res = await $api.patch(`/subcategory/update/${id}`, data)
      return res.data || res
    } catch (error) {
      console.error('updateSubCategory error:', error)
      throw error
    }
  }

  // Delete subcategory
  const deleteSubCategory = async (id) => {
    try {
      const res = await $api.delete(`/subcategory/delete/${id}`)
      return res.data || res
    } catch (error) {
      console.error('deleteSubCategory error:', error)
      throw error
    }
  }

  return {
    getSubCategories,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
  }
}
