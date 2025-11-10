export const useOrder = () => {
    const { $api } = useNuxtApp()

    const getAllOrder = async (params = {}) => {
        try {
            const queryParams = new URLSearchParams()
            if (params.status) queryParams.append('status', params.status)
            if (params.limit) queryParams.append('limit', params.limit)
            if (params.offset !== undefined) queryParams.append('offset', params.offset)

            const queryString = queryParams.toString()
            const url = `/manager-order/${queryString ? '?' + queryString : ''}`

            const res = await $api.get(url)
            console.log("getAllOrder response:", res.data)

            // ✅ Trả về mảng đơn hàng trực tiếp
            return res.data || res
        } catch (err) {
            console.error("getAllOrder error:", err)
            throw err
        }   
    }



    const updateOrder = async (orderId, status) => {
  try {
    const res = await $api.patch(`/manager-order/${orderId}`, { status })
    console.log("updateOrder response:", res)
    return res.data || res
  } catch (err) {
    console.error("updateOrder error:", err)
    throw err
  }
}


    return {
        getAllOrder,
        updateOrder
    }
}