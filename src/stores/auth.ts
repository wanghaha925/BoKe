import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthApiService } from '../services/api'
import { httpClient } from '../services/http'

export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'editor'
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const token = ref<string | null>(null)

  // 本地存储键名
  const STORAGE_KEYS = {
    TOKEN: 'luxury-blog-token',
    USER: 'luxury-blog-user'
  }

  // 默认管理员账户（仅用于演示）
  const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@luxuryblog.com',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  }

  // 计算属性
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isEditor = computed(() => user.value?.role === 'editor')

  // 从本地存储加载认证信息
  const loadFromStorage = () => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER)
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      }
    } catch (error) {
      console.error('加载认证信息失败:', error)
      logout()
    }
  }

  // 保存认证信息到本地存储
  const saveToStorage = () => {
    try {
      if (token.value && user.value) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token.value)
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
      }
    } catch (error) {
      console.error('保存认证信息失败:', error)
    }
  }

  // 登录
  const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
    isLoading.value = true

    try {
      const response = await AuthApiService.login({ username, password })

      if (response.success && response.data) {
        token.value = response.data.token
        user.value = response.data.user

        // 设置HTTP客户端的认证token
        httpClient.setAuthToken(response.data.token)

        saveToStorage()

        return {
          success: true,
          message: '登录成功'
        }
      } else {
        return {
          success: false,
          message: '登录失败'
        }
      }
    } catch (error: any) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: error.message || '登录失败，请重试'
      }
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      // 调用后端登出API（可选）
      await AuthApiService.logout()
    } catch (error) {
      console.error('登出API调用失败:', error)
    } finally {
      // 无论API调用是否成功，都清除本地状态
      user.value = null
      token.value = null
      httpClient.setAuthToken(null)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  }

  // 检查token有效性（模拟）
  const validateToken = async (): Promise<boolean> => {
    if (!token.value) return false
    
    try {
      // 在实际项目中，这里应该调用后端API验证token
      // 这里只是简单检查token格式
      const tokenParts = token.value.split('_')
      if (tokenParts.length === 3 && tokenParts[0] === 'token') {
        const timestamp = parseInt(tokenParts[1])
        const now = Date.now()
        // token有效期24小时
        const isValid = (now - timestamp) < 24 * 60 * 60 * 1000
        
        if (!isValid) {
          logout()
        }
        
        return isValid
      }
      
      logout()
      return false
    } catch (error) {
      console.error('验证token失败:', error)
      logout()
      return false
    }
  }

  // 更新用户信息
  const updateUser = (updatedUser: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser }
      saveToStorage()
    }
  }

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    isLoading.value = true

    try {
      const response = await AuthApiService.changePassword({ oldPassword, newPassword })

      if (response.success) {
        return {
          success: true,
          message: '密码修改成功'
        }
      } else {
        return {
          success: false,
          message: '密码修改失败'
        }
      }
    } catch (error: any) {
      console.error('修改密码失败:', error)
      return {
        success: false,
        message: error.message || '修改密码失败，请重试'
      }
    } finally {
      isLoading.value = false
    }
  }

  // 初始化
  loadFromStorage()

  // 如果有token，设置到HTTP客户端
  if (token.value) {
    httpClient.setAuthToken(token.value)
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    isEditor,
    login,
    logout,
    validateToken,
    updateUser,
    changePassword,
    loadFromStorage,
    saveToStorage
  }
})
