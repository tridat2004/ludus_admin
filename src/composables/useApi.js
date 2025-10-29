// export const useAuth = () => {
//   const user = useState('user', () => null);
//   const router = useRouter();

//   const login = async (email, password) => {
//     try {
//       // Gửi login request
//       await $fetch("/auth/login", {
//         method: "POST",
//         baseURL: "http://localhost:3000",
//         body: { email, password },
//         credentials: "include",
//       });

//       await new Promise((resolve) => setTimeout(resolve, 100));

//       // Lấy thông tin user
//       const response = await $fetch("/me", {
//         baseURL: "http://localhost:3000",
//         credentials: "include",
//       });

//       const userData = response?.data || response;

//       if (!userData || typeof userData !== "object") {
//         throw new Error("Không thể lấy thông tin admin sau khi đăng nhập");
//       }

//       user.value = userData;

//       // Lưu vào localStorage
//       if (typeof window !== 'undefined') {
//         localStorage.setItem("admin_user", JSON.stringify(userData));
//         window.dispatchEvent(new Event("auth-changed"));
//       }

//       console.log("✅ Đăng nhập thành công:", userData);

//       // ✅ REDIRECT VỀ TRANG ADMIN
//       await router.push('/dashboard');

//       return userData;
//     } catch (error) {
//       console.error("💥 Login failed:", error);
//       throw new Error(
//         error.data?.message || 
//         error.message || 
//         "Lỗi không xác định khi đăng nhập"
//       );
//     }
//   };

//   const autoLogin = async () => {
//     try {
//       const response = await $fetch("/me", {
//         baseURL: "http://localhost:3000",
//         credentials: "include",
//       });

//       const userData = response?.data || response;

//       if (userData && typeof userData === "object") {
//         user.value = userData;
//         if (typeof window !== 'undefined') {
//           localStorage.setItem("admin_user", JSON.stringify(userData));
//         }
//         return userData;
//       }

//       return null;
//     } catch (err) {
//       return null;
//     }
//   };

//   const logout = async () => {
//     try {
//       await $fetch("/auth/logout", {
//         method: "POST",
//         baseURL: "http://localhost:3000",
//         credentials: "include",
//       });
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       user.value = null;
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem("admin_user");
//         window.dispatchEvent(new Event("auth-changed"));
//       }
//       await router.push('/login');
//     }
//   };

//   return {
//     user,
//     login,
//     autoLogin,
//     logout,
//   };
// };