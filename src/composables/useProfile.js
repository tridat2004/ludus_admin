export default () => {
    const { $api } = useNuxtApp()
    
    const getProfile = async () => {
        try{
            // Sửa từ /manage-profile thành /manager-profile
            const res = await $api.get('/manager-profile/profile')
            console.log('📝 Full response:', res)
            return res?.data?.data || null
        }
        catch (error) {
            console.error('Error fetching profile:', error)
            throw error
        }
    }
    
    const updateProfile = async (profileData) => {
        try{
            // Sửa từ /manage-profile thành /manager-profile
            const res = await $api.patch('/manager-profile/profile', profileData)
            console.log('📝 Full response:', res)
            return res?.data?.data || null
        }
        catch (error) {
            console.error('Error updating profile:', error)
            throw error
        }
    }
    
    const sendMailResetPassword = async () => {
        try{
            // Sửa từ /manage-profile thành /manager-profile
            const res = await $api.post('/manager-profile/profile')
            console.log('📝 Full response:', res)
            return res?.data || null
        }   
        catch (error) {
            console.error('Error sending reset password email:', error)
            throw error
        }
    }
    
    return {
        getProfile,
        updateProfile,
        sendMailResetPassword
    }
}