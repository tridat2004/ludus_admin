export default () => {
    const { $api } = useNuxtApp()

    // GET /payment-method/ - Lấy payment methods đang active
    const getActivePaymentMethods = async () => {
        try {
            const res = await $api.get('/payment-method/')
            console.log('getActivePaymentMethods response:', res)
            return res.data || res
        } catch (err) {
            console.error('getActivePaymentMethods error:', err)
            throw err
        }
    }

    // GET /payment-method/all - Lấy tất cả payment methods
    const getAllPaymentMethods = async () => {
        try {
            const res = await $api.get('/payment-method/all')
            console.log('getAllPaymentMethods response:', res)
            return res.data || res
        } catch (err) {
            console.error('getAllPaymentMethods error:', err)
            throw err
        }
    }

    // PATCH /payment-method/:paymentMethodId - Toggle isActive
    const togglePaymentMethodStatus = async (paymentMethodId) => {
        try {
            const res = await $api.patch(`/payment-method/${paymentMethodId}`)
            return res.data || res
        } catch (err) {
            console.error('togglePaymentMethodStatus error:', err)
            throw err
        }
    }

    return {
        getActivePaymentMethods,
        getAllPaymentMethods,
        togglePaymentMethodStatus
    }
}