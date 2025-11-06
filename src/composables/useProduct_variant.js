

export default () =>{
    const { $api } = useNuxtApp()
    const getProductVariants = async (productId, params = {}) => {
  try {
    const res = await $api.get(`/product-variant/all/${productId}`, { params })
    console.log('getProductVariants response:', res)
    return res?.data || res
  } catch (error) {
    console.error('getProductVariants error:', error)
    throw error
  }
}

    const createProductVariant = async (productId, data) => {
  try {
    const res = await $api.post(`/product-variant/create/${productId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data || res
  } catch (error) {
    console.error('createProductVariant error:', error)
    throw error
  }
}
    const updateProductVariant = async (id, data) => {
  try {
    const res = await $api.patch(`/product-variant/update/${id}`, data, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      }
    })
    return res.data || res      
  } catch (error) {
    console.error('updateProductVariant error:', error)
    throw error
  }
}
    const deleteProductVariant = async (id) => {
        try{
            const res = await $api.delete(`/product-variant/delete/${id}`)  
            return res.data || res    
        }catch (error){
            console.error('deleteProductVariant error:', error)
            throw error
        }
    }
    

    return {
        getProductVariants,
        createProductVariant,
        updateProductVariant,
        deleteProductVariant,
      
    }
}