import { autoLoginAdmin, fetchMe } from "~/services/authService";

export default defineNuxtPlugin(async () => {
  console.log("🚀 Khởi động plugin auth...");
  
  try {
    let user = await fetchMe();

    if (!user) {
      console.log("🔄 Thử auto login...");
      user = await autoLoginAdmin();
    }

    if (!user) {
      console.error("🚫 Không thể auto login admin");
    } else {
      console.log("✅ Admin đã đăng nhập:", user.email);
    }
  } catch (error) {
    console.error("💥 Lỗi trong auth plugin:", error);
  }
});