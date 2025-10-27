import axios from "axios";

let adminToken = null;

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBase, // http://localhost:4000
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  // 🔐 Auto login admin bằng ENV nếu chưa có token
//   if (!adminToken) {
//     try {
//       const res = await axios.post(`${config.public.apiBase}/auth/login`, {
//         email: config.public.adminEmail,
//         password: config.public.adminPassword,
//       });
//       adminToken = res.data.token;
//       console.log("✅ Admin logged in successfully");
//     } catch (err) {
//       console.error("❌ Admin auto login failed:", err.response?.data || err);
//     }
//   }

//   // 🧠 Thêm Authorization header tự động
//   api.interceptors.request.use((req) => {
//     if (adminToken) req.headers.Authorization = `Bearer ${adminToken}`;
//     return req;
//   });

  api.interceptors.response.use(
    (res) => res,
    (err) => {
      console.error("API Error:", err.response?.data || err.message);
      return Promise.reject(err);
    }
  );

  return {
    provide: { api },
  };
});
