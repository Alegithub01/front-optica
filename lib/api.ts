import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para añadir el token a cada request
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const apiRequest = async <T,>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response = await apiClient({
      method,
      url: endpoint,
      data,
      ...config,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message)
    }
    throw error
  }
}

// Convenience methods for common HTTP verbs
export const api = {
  get: <T,>(endpoint: string, config?: AxiosRequestConfig) => apiRequest<T>("GET", endpoint, undefined, config),

  post: <T,>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>("POST", endpoint, data, config),

  put: <T,>(endpoint: string, data?: any, config?: AxiosRequestConfig) => apiRequest<T>("PUT", endpoint, data, config),

  patch: <T,>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>("PATCH", endpoint, data, config),

  delete: <T,>(endpoint: string, config?: AxiosRequestConfig) => apiRequest<T>("DELETE", endpoint, undefined, config),
}

export default api
