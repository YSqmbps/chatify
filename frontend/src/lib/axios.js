import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? "http://localhost:3000/api" : "/api",
    timeout: 10000,
    // 允许携带凭证（如 Cookie）
    withCredentials: true,
})