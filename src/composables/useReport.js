// composables/useReport.js
import { ref } from 'vue'

export function useReport() {
  const loading = ref(false)
  const allOrders = ref([])
  const allProducts = ref([])
  const revenueData = ref({ totalRevenue: 0, data: [], pagination: {} })

  const fetchOrders = async (params = {}) => {
    try {
      const { $api } = useNuxtApp()

      const [deliveredRes, cancelledRes] = await Promise.all([
        $api('/statistical/all', {
          params: { limit: 10000, status: 'Delivered', month: params.month || undefined }
        }).catch(() => ({ data: { data: [] } })),

        $api('/statistical/all', {
          params: { limit: 10000, status: 'Cancelled', month: params.month || undefined }
        }).catch(() => ({ data: { data: [] } }))
      ])

      // FIX CHÍNH TẠI ĐÂY: lấy đúng data.data.data nếu cần
      const getOrders = (res) => {
        if (Array.isArray(res.data)) return res.data
        if (res.data?.data && Array.isArray(res.data.data)) return res.data.data
        if (res.data?.data?.data && Array.isArray(res.data.data.data)) return res.data.data.data
        return []
      }

      const delivered = getOrders(deliveredRes)
      const cancelled = getOrders(cancelledRes)
      allOrders.value = [...delivered, ...cancelled]

      console.log('Đơn hàng:', { delivered: delivered.length, cancelled: cancelled.length, total: allOrders.value.length })

    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error)
      allOrders.value = []
    }
  }

  const fetchRevenue = async (params = {}) => {
    try {
      const { $api } = useNuxtApp()
      const res = await $api('/statistical/revenue', {
        params: { limit: 10000, month: params.month || undefined }
      })

      // FIX: lấy đúng totalRevenue và data
      let total = 0
      let payments = []

      if (res.data?.totalRevenue !== undefined) {
        total = res.data.totalRevenue
        payments = Array.isArray(res.data.data) ? res.data.data : []
      } else if (res.data?.data?.totalRevenue !== undefined) {
        total = res.data.data.totalRevenue
        payments = Array.isArray(res.data.data.data) ? res.data.data.data : []
      }

      revenueData.value = {
        totalRevenue: total,
        data: payments,
        pagination: res.data?.pagination || {}
      }

      console.log('Doanh thu:', total, 'từ', payments.length, 'thanh toán')

    } catch (error) {
      console.error('Lỗi tải doanh thu:', error)
      revenueData.value = { totalRevenue: 0, data: [], pagination: {} }
    }
  }

  const fetchProducts = async () => {
    try {
      const { getProducts } = useProduct()
      const res = await getProducts({ limit: 10000 })
      allProducts.value = Array.isArray(res.data) ? res.data : res.data?.data || []
    } catch (error) {
      console.warn('Không tải được sản phẩm:', error)
      allProducts.value = []
    }
  }

  const fetchData = async (params = {}) => {
    loading.value = true
    try {
      await Promise.all([
        fetchOrders(params),
        fetchRevenue(params),
        fetchProducts()
      ])
    } catch (error) {
      console.error('Lỗi tổng:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    allOrders,
    allProducts,
    revenueData,
    fetchData
  }
}