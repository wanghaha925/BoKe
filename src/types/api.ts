// API 响应类型定义
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
  timestamp?: string
}

// 分页响应类型
export interface PaginatedResponse<T> {
  success: boolean
  data: {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
  message?: string
}

// 错误响应类型
export interface ApiError {
  success: false
  message: string
  code: number
  details?: any
  timestamp: string
}

// 请求配置类型
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  params?: Record<string, any>
  data?: any
  timeout?: number
}

// 文章相关API类型
export interface CreatePostRequest {
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  coverImage?: string
  featured?: boolean
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string
}

export interface PostQuery {
  page?: number
  pageSize?: number
  category?: string
  tags?: string[]
  search?: string
  featured?: boolean
  author?: string
  sortBy?: 'publishedAt' | 'updatedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
}

// 分类相关API类型
export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string
}

// 用户认证相关API类型
export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  user: {
    id: string
    username: string
    email: string
    role: string
    avatar?: string
  }
  token: string
  refreshToken?: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

// 文件上传相关API类型
export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

// 统计数据API类型
export interface BlogStats {
  totalPosts: number
  totalCategories: number
  totalTags: number
  totalViews: number
  featuredPosts: number
  publishedPosts: number
  draftPosts: number
}

// API端点常量
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password'
  },
  
  // 文章相关
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    GET: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    BY_SLUG: (slug: string) => `/api/posts/slug/${slug}`,
    FEATURED: '/api/posts/featured',
    SEARCH: '/api/posts/search'
  },
  
  // 分类相关
  CATEGORIES: {
    LIST: '/api/categories',
    CREATE: '/api/categories',
    GET: (id: string) => `/api/categories/${id}`,
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
    BY_SLUG: (slug: string) => `/api/categories/slug/${slug}`
  },
  
  // 标签相关
  TAGS: {
    LIST: '/api/tags',
    POPULAR: '/api/tags/popular'
  },
  
  // 文件上传
  UPLOAD: {
    IMAGE: '/api/upload/image',
    FILE: '/api/upload/file'
  },
  
  // 统计数据
  STATS: {
    BLOG: '/api/stats/blog',
    POSTS: '/api/stats/posts',
    VIEWS: '/api/stats/views'
  }
} as const

// HTTP状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

// 错误代码常量
export const ERROR_CODES = {
  // 通用错误
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // 认证错误
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // 业务错误
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  SLUG_ALREADY_EXISTS: 'SLUG_ALREADY_EXISTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  
  // 文件上传错误
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED'
} as const
