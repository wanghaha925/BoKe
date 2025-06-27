import { httpClient } from './http'
import type {
  ApiResponse,
  PaginatedResponse,
  CreatePostRequest,
  UpdatePostRequest,
  PostQuery,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  UploadResponse,
  BlogStats,
  API_ENDPOINTS
} from '../types/api'
import type { BlogPost, Category } from '../stores/blog'
import type { User } from '../stores/auth'

// 环境配置
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

// 认证API服务
export class AuthApiService {
  // 登录
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (USE_MOCK_API) {
      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        return {
          success: true,
          data: {
            user: {
              id: '1',
              username: 'admin',
              email: 'admin@luxuryblog.com',
              role: 'admin',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
            },
            token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            expiresIn: 24 * 60 * 60 // 24小时
          }
        }
      } else {
        throw {
          success: false,
          message: '用户名或密码错误',
          code: 401
        }
      }
    }
    
    return httpClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
  }

  // 登出
  static async logout(): Promise<ApiResponse<void>> {
    if (USE_MOCK_API) {
      return { success: true }
    }
    
    return httpClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT)
  }

  // 获取用户信息
  static async getProfile(): Promise<ApiResponse<User>> {
    if (USE_MOCK_API) {
      return {
        success: true,
        data: {
          id: '1',
          username: 'admin',
          email: 'admin@luxuryblog.com',
          role: 'admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
        }
      }
    }
    
    return httpClient.get<User>(API_ENDPOINTS.AUTH.PROFILE)
  }

  // 修改密码
  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (data.oldPassword === 'admin123') {
        return { success: true }
      } else {
        throw {
          success: false,
          message: '原密码错误',
          code: 400
        }
      }
    }
    
    return httpClient.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
  }
}

// 文章API服务
export class PostApiService {
  // 获取文章列表
  static async getPosts(query: PostQuery = {}): Promise<PaginatedResponse<BlogPost>> {
    if (USE_MOCK_API) {
      // 从localStorage获取数据
      const storedPosts = localStorage.getItem('luxury-blog-posts')
      let posts: BlogPost[] = []
      
      if (storedPosts) {
        posts = JSON.parse(storedPosts)
      }
      
      // 应用筛选和搜索
      let filteredPosts = posts
      
      if (query.category) {
        filteredPosts = filteredPosts.filter(post => post.category === query.category)
      }
      
      if (query.search) {
        const searchLower = query.search.toLowerCase()
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }
      
      if (query.featured !== undefined) {
        filteredPosts = filteredPosts.filter(post => post.featured === query.featured)
      }
      
      // 排序
      const sortBy = query.sortBy || 'publishedAt'
      const sortOrder = query.sortOrder || 'desc'
      
      filteredPosts.sort((a, b) => {
        let aValue: any = a[sortBy as keyof BlogPost]
        let bValue: any = b[sortBy as keyof BlogPost]
        
        if (sortBy === 'publishedAt' || sortBy === 'updatedAt') {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
      
      // 分页
      const page = query.page || 1
      const pageSize = query.pageSize || 10
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
      
      return {
        success: true,
        data: {
          items: paginatedPosts,
          total: filteredPosts.length,
          page,
          pageSize,
          totalPages: Math.ceil(filteredPosts.length / pageSize)
        }
      }
    }
    
    return httpClient.get<PaginatedResponse<BlogPost>['data']>(API_ENDPOINTS.POSTS.LIST, query)
      .then(response => ({ ...response, data: response.data! }))
  }

  // 获取单篇文章
  static async getPost(id: string): Promise<ApiResponse<BlogPost>> {
    if (USE_MOCK_API) {
      const storedPosts = localStorage.getItem('luxury-blog-posts')
      if (storedPosts) {
        const posts: BlogPost[] = JSON.parse(storedPosts)
        const post = posts.find(p => p.id === id)
        if (post) {
          return { success: true, data: post }
        }
      }
      throw {
        success: false,
        message: '文章不存在',
        code: 404
      }
    }
    
    return httpClient.get<BlogPost>(API_ENDPOINTS.POSTS.GET(id))
  }

  // 根据slug获取文章
  static async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    if (USE_MOCK_API) {
      const storedPosts = localStorage.getItem('luxury-blog-posts')
      if (storedPosts) {
        const posts: BlogPost[] = JSON.parse(storedPosts)
        const post = posts.find(p => p.slug === slug)
        if (post) {
          return { success: true, data: post }
        }
      }
      throw {
        success: false,
        message: '文章不存在',
        code: 404
      }
    }
    
    return httpClient.get<BlogPost>(API_ENDPOINTS.POSTS.BY_SLUG(slug))
  }

  // 创建文章
  static async createPost(data: CreatePostRequest): Promise<ApiResponse<BlogPost>> {
    if (USE_MOCK_API) {
      const newPost: BlogPost = {
        ...data,
        id: Date.now().toString(),
        publishedAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        readTime: Math.ceil(data.content.length / 200)
      }
      
      // 保存到localStorage
      const storedPosts = localStorage.getItem('luxury-blog-posts')
      const posts: BlogPost[] = storedPosts ? JSON.parse(storedPosts) : []
      posts.unshift(newPost)
      localStorage.setItem('luxury-blog-posts', JSON.stringify(posts))
      
      return { success: true, data: newPost }
    }
    
    return httpClient.post<BlogPost>(API_ENDPOINTS.POSTS.CREATE, data)
  }

  // 更新文章
  static async updatePost(id: string, data: Partial<UpdatePostRequest>): Promise<ApiResponse<BlogPost>> {
    if (USE_MOCK_API) {
      const storedPosts = localStorage.getItem('luxury-blog-posts')
      if (storedPosts) {
        const posts: BlogPost[] = JSON.parse(storedPosts)
        const index = posts.findIndex(p => p.id === id)
        if (index !== -1) {
          posts[index] = {
            ...posts[index],
            ...data,
            updatedAt: new Date().toISOString().split('T')[0]
          }
          localStorage.setItem('luxury-blog-posts', JSON.stringify(posts))
          return { success: true, data: posts[index] }
        }
      }
      throw {
        success: false,
        message: '文章不存在',
        code: 404
      }
    }
    
    return httpClient.put<BlogPost>(API_ENDPOINTS.POSTS.UPDATE(id), data)
  }

  // 删除文章
  static async deletePost(id: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_API) {
      const storedPosts = localStorage.getItem('luxury-blog-posts')
      if (storedPosts) {
        const posts: BlogPost[] = JSON.parse(storedPosts)
        const index = posts.findIndex(p => p.id === id)
        if (index !== -1) {
          posts.splice(index, 1)
          localStorage.setItem('luxury-blog-posts', JSON.stringify(posts))
          return { success: true }
        }
      }
      throw {
        success: false,
        message: '文章不存在',
        code: 404
      }
    }
    
    return httpClient.delete<void>(API_ENDPOINTS.POSTS.DELETE(id))
  }
}

// 分类API服务
export class CategoryApiService {
  // 获取分类列表
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    if (USE_MOCK_API) {
      const storedCategories = localStorage.getItem('luxury-blog-categories')
      const categories: Category[] = storedCategories ? JSON.parse(storedCategories) : []
      return { success: true, data: categories }
    }
    
    return httpClient.get<Category[]>(API_ENDPOINTS.CATEGORIES.LIST)
  }

  // 创建分类
  static async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
    if (USE_MOCK_API) {
      const newCategory: Category = {
        ...data,
        id: Date.now().toString(),
        count: 0
      }
      
      const storedCategories = localStorage.getItem('luxury-blog-categories')
      const categories: Category[] = storedCategories ? JSON.parse(storedCategories) : []
      categories.push(newCategory)
      localStorage.setItem('luxury-blog-categories', JSON.stringify(categories))
      
      return { success: true, data: newCategory }
    }
    
    return httpClient.post<Category>(API_ENDPOINTS.CATEGORIES.CREATE, data)
  }
}

// 文件上传API服务
export class UploadApiService {
  // 上传图片
  static async uploadImage(file: File): Promise<ApiResponse<UploadResponse>> {
    if (USE_MOCK_API) {
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 返回模拟的图片URL
      return {
        success: true,
        data: {
          url: `https://images.unsplash.com/photo-${Date.now()}?w=800&h=400&fit=crop`,
          filename: file.name,
          size: file.size,
          mimeType: file.type
        }
      }
    }
    
    return httpClient.upload<UploadResponse>(API_ENDPOINTS.UPLOAD.IMAGE, file)
  }
}

// 统计API服务
export class StatsApiService {
  // 获取博客统计数据
  static async getBlogStats(): Promise<ApiResponse<BlogStats>> {
    if (USE_MOCK_API) {
      const storedPosts = localStorage.getItem('luxury-blog-posts')
      const storedCategories = localStorage.getItem('luxury-blog-categories')
      
      const posts: BlogPost[] = storedPosts ? JSON.parse(storedPosts) : []
      const categories: Category[] = storedCategories ? JSON.parse(storedCategories) : []
      
      const featuredPosts = posts.filter(post => post.featured)
      const allTags = posts.flatMap(post => post.tags)
      const uniqueTags = [...new Set(allTags)]
      
      return {
        success: true,
        data: {
          totalPosts: posts.length,
          totalCategories: categories.length,
          totalTags: uniqueTags.length,
          totalViews: posts.length * 150, // 模拟数据
          featuredPosts: featuredPosts.length,
          publishedPosts: posts.length,
          draftPosts: 0
        }
      }
    }
    
    return httpClient.get<BlogStats>(API_ENDPOINTS.STATS.BLOG)
  }
}
