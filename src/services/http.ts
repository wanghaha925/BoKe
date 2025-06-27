import type { ApiResponse, ApiError, RequestConfig } from '../types/api'

// HTTP客户端配置
interface HttpClientConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

// 默认配置
const DEFAULT_CONFIG: HttpClientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}

class HttpClient {
  private config: HttpClientConfig
  private authToken: string | null = null

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.loadAuthToken()
  }

  // 加载认证token
  private loadAuthToken() {
    this.authToken = localStorage.getItem('luxury-blog-token')
  }

  // 设置认证token
  setAuthToken(token: string | null) {
    this.authToken = token
    if (token) {
      localStorage.setItem('luxury-blog-token', token)
    } else {
      localStorage.removeItem('luxury-blog-token')
    }
  }

  // 获取请求头
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers = { ...this.config.headers, ...customHeaders }
    
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }
    
    return headers
  }

  // 构建URL
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.config.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    
    return url.toString()
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    
    let data: any
    if (isJson) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      const error: ApiError = {
        success: false,
        message: data.message || `HTTP ${response.status}: ${response.statusText}`,
        code: response.status,
        details: data,
        timestamp: new Date().toISOString()
      }
      throw error
    }

    // 如果后端返回的数据已经是标准格式，直接返回
    if (data && typeof data === 'object' && 'success' in data) {
      return data
    }

    // 否则包装成标准格式
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    }
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      data,
      timeout = this.config.timeout
    } = config

    const url = this.buildURL(endpoint, params)
    const requestHeaders = this.getHeaders(headers)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const requestInit: RequestInit = {
        method,
        headers: requestHeaders,
        signal: controller.signal
      }

      if (data && method !== 'GET') {
        if (data instanceof FormData) {
          // 如果是FormData，不设置Content-Type，让浏览器自动设置
          delete requestHeaders['Content-Type']
          requestInit.body = data
        } else {
          requestInit.body = JSON.stringify(data)
        }
      }

      const response = await fetch(url, requestInit)
      return await this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw {
            success: false,
            message: '请求超时',
            code: 408,
            timestamp: new Date().toISOString()
          } as ApiError
        }
        
        throw {
          success: false,
          message: error.message || '网络请求失败',
          code: 0,
          timestamp: new Date().toISOString()
        } as ApiError
      }
      
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', params })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', data })
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', data })
  }

  // PATCH请求
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PATCH', data })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // 上传文件
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    return this.request<T>(endpoint, { method: 'POST', data: formData })
  }
}

// 创建默认的HTTP客户端实例
export const httpClient = new HttpClient()

// 导出类型和客户端
export { HttpClient }
export type { HttpClientConfig }
