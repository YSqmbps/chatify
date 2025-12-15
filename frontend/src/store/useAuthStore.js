import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      // 改进错误处理
      if (error.response) {
        // 服务器返回了错误响应
        toast.error(error.response.data?.message || "注册失败");
      } else if (error.request) {
        // 请求已发送但未收到响应（网络错误）
        toast.error("网络错误，请检查连接");
      } else {
        // 其他错误
        toast.error("注册失败，请重试");
      }
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

      get().connectSocket();
    } catch (error) {
      console.log("Error in login:", error);
      
      // 改进错误处理
      if (error.response) {
        // 服务器返回了错误响应
        toast.error(error.response.data?.message || "登录失败");
      } else if (error.request) {
        // 请求已发送但未收到响应（网络错误）
        toast.error("网络错误，请检查连接");
      } else {
        // 其他错误
        toast.error("登录失败，请重试");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("Logout error:", error);
      
      // 改进错误处理
      if (error.response) {
        // 服务器返回了错误响应
        toast.error(error.response.data?.message || "退出失败");
      } else if (error.request) {
        // 请求已发送但未收到响应（网络错误）
        toast.error("网络错误，请检查连接");
      } else {
        // 其他错误
        toast.error("退出失败，请重试");
      }
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      
      // 改进错误处理
      if (error.response) {
        // 服务器返回了错误响应
        toast.error(error.response.data?.message || "更新失败");
      } else if (error.request) {
        // 请求已发送但未收到响应（网络错误）
        toast.error("网络错误，请检查连接");
      } else {
        // 其他错误
        toast.error("更新失败，请重试");
      }
    }
  },

  // connectSocket: () => {
  //   const { authUser } = get();
  //   if (!authUser || get().socket?.connected) return;

  //   const socket = io(BASE_URL, {
  //     withCredentials: true, // this ensures cookies are sent with the connection
  //   });

  //   socket.connect();

  //   set({ socket });

  //   // listen for online users event
  //   socket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });
  // },

  // disconnectSocket: () => {
  //   if (get().socket?.connected) get().socket.disconnect();
  // },
}));