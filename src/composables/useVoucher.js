export default () => {
    const { $api } = useNuxtApp();

    const getAllVoucher = async (offset = 0, limit = 10) => {
        try {
            const res = await $api.get(`/voucher/`, {
                params: { offset, limit }
            })
            console.log("getAllVoucher response:", res);
            return res.data || res;
        } catch (err) {
            console.error("getAllVoucher error:", err)
            throw err;
        }
    }

    const createVoucher = async (data) => {
        try {
            const res = await $api.post(`/voucher`, data)
            console.log("createVoucher response:", res)
            return res.data || res
        } catch (err) {
            console.error("createVoucher error:", err)
            throw err;
        }
    }
  const deleteVoucher = async (id) => {
        try {
            const res = await $api.delete(`/voucher/${id}`)
            console.log("deleteVoucher response:", res);
            return res.data || res
        } catch (err) {
            console.error("deleteVoucher error:", err)
            throw err;
        }
    }

    return {
        getAllVoucher,
        createVoucher,
        deleteVoucher
    }
}