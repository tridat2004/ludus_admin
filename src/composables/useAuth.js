export const useAuth = () => {
  const user = ref(null);
  const logout = () => {
    // Logic đăng xuất
  };
  return { user, logout };
};