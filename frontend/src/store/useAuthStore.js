import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  // 检查用户认证状态
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      // 如果检查成功，更新 authUser 状态
      set({
        authUser: res.data.user,
      });
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ authUser: null }); // 出错时重置用户状态
    } finally {
      set({ isCheckingAuth: false }); // 检查完成后重置状态
    }
  },

  // 注册用户
  signup: async (data) => {
    set({ isSignupLoading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("账户创建成功！");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message || "注册时出错，请稍后再试。"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },
   login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },
}));
