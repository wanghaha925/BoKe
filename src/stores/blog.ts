import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  category: string
  tags: string[]
  coverImage: string
  readTime: number
  featured: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  count: number
}

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const categories = ref<Category[]>([])
  const searchQuery = ref('')
  const selectedCategory = ref('')
  const loading = ref(false)

  // 本地存储的键名
  const STORAGE_KEYS = {
    POSTS: 'luxury-blog-posts',
    CATEGORIES: 'luxury-blog-categories'
  }

  // Mock data for demonstration
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: '探索现代 Web 开发的未来趋势',
      slug: 'future-of-web-development',
      excerpt: '深入了解 Web 开发的最新技术趋势，包括 AI 集成、边缘计算和新兴框架。',
      content: `# 探索现代 Web 开发的未来趋势

Web 开发正在经历一场革命。随着技术的快速发展，我们看到了许多令人兴奋的新趋势...

## AI 集成
人工智能正在改变我们构建和交互 Web 应用的方式...

## 边缘计算
边缘计算使我们能够将计算资源更接近用户...

## 新兴框架
新的框架和工具正在不断涌现...`,
      author: '张三',
      publishedAt: '2024-01-15',
      updatedAt: '2024-01-15',
      category: 'technology',
      tags: ['Web开发', 'AI', '前端'],
      coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
      readTime: 8,
      featured: true
    },
    {
      id: '2',
      title: 'Vue.js 3 组合式 API 最佳实践',
      slug: 'vue3-composition-api-best-practices',
      excerpt: '学习如何有效使用 Vue.js 3 的组合式 API 来构建可维护的应用程序。',
      content: `# Vue.js 3 组合式 API 最佳实践

Vue.js 3 引入了组合式 API，为我们提供了更灵活的代码组织方式...`,
      author: '李四',
      publishedAt: '2024-01-10',
      updatedAt: '2024-01-10',
      category: 'frontend',
      tags: ['Vue.js', '前端', 'JavaScript'],
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      readTime: 12,
      featured: false
    },
    {
      id: '3',
      title: '设计系统：构建一致的用户体验',
      slug: 'design-systems-consistent-ux',
      excerpt: '了解如何创建和维护设计系统，以确保产品的一致性和可扩展性。',
      content: `# 设计系统：构建一致的用户体验

设计系统是现代产品开发的基石...`,
      author: '王五',
      publishedAt: '2024-01-05',
      updatedAt: '2024-01-05',
      category: 'design',
      tags: ['设计系统', 'UX', 'UI'],
      coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=400&fit=crop',
      readTime: 6,
      featured: true
    }
  ]

  const mockCategories: Category[] = [
    { id: '1', name: '技术', slug: 'technology', description: '最新的技术趋势和见解', count: 5 },
    { id: '2', name: '前端开发', slug: 'frontend', description: '前端开发技术和最佳实践', count: 8 },
    { id: '3', name: '设计', slug: 'design', description: 'UI/UX 设计和用户体验', count: 3 },
    { id: '4', name: '生活方式', slug: 'lifestyle', description: '工作与生活的平衡', count: 2 }
  ]

  // 从本地存储加载数据
  const loadFromStorage = () => {
    try {
      const storedPosts = localStorage.getItem(STORAGE_KEYS.POSTS)
      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES)

      if (storedPosts) {
        posts.value = JSON.parse(storedPosts)
      } else {
        // 如果没有存储数据，使用默认数据
        posts.value = mockPosts
        saveToStorage()
      }

      if (storedCategories) {
        categories.value = JSON.parse(storedCategories)
      } else {
        categories.value = mockCategories
        saveToStorage()
      }
    } catch (error) {
      console.error('加载本地数据失败:', error)
      // 如果加载失败，使用默认数据
      posts.value = mockPosts
      categories.value = mockCategories
    }
  }

  // 保存数据到本地存储
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts.value))
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories.value))
    } catch (error) {
      console.error('保存数据到本地存储失败:', error)
    }
  }

  // 初始化数据
  loadFromStorage()

  // Computed properties
  const filteredPosts = computed(() => {
    let filtered = posts.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    if (selectedCategory.value) {
      filtered = filtered.filter(post => post.category === selectedCategory.value)
    }

    return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  })

  const featuredPosts = computed(() => 
    posts.value.filter(post => post.featured)
  )

  const recentPosts = computed(() => 
    posts.value.slice(0, 3)
  )

  // Actions
  const getPostBySlug = (slug: string) => {
    return posts.value.find(post => post.slug === slug)
  }

  const getCategoryBySlug = (slug: string) => {
    return categories.value.find(category => category.slug === slug)
  }

  // 添加文章
  const addPost = (post: Omit<BlogPost, 'id'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    posts.value.unshift(newPost)
    saveToStorage()
    return newPost
  }

  // 更新文章
  const updatePost = (id: string, updatedPost: Partial<BlogPost>) => {
    const index = posts.value.findIndex(post => post.id === id)
    if (index !== -1) {
      posts.value[index] = {
        ...posts.value[index],
        ...updatedPost,
        updatedAt: new Date().toISOString().split('T')[0]
      }
      saveToStorage()
      return posts.value[index]
    }
    return null
  }

  // 删除文章
  const deletePost = (id: string) => {
    const index = posts.value.findIndex(post => post.id === id)
    if (index !== -1) {
      const deletedPost = posts.value.splice(index, 1)[0]
      saveToStorage()
      return deletedPost
    }
    return null
  }

  // 清空所有数据（用于重置）
  const clearAllData = () => {
    posts.value = []
    categories.value = []
    localStorage.removeItem(STORAGE_KEYS.POSTS)
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES)
  }

  // 重置为默认数据
  const resetToDefault = () => {
    posts.value = mockPosts
    categories.value = mockCategories
    saveToStorage()
  }

  return {
    posts,
    categories,
    searchQuery,
    selectedCategory,
    loading,
    filteredPosts,
    featuredPosts,
    recentPosts,
    getPostBySlug,
    getCategoryBySlug,
    addPost,
    updatePost,
    deletePost,
    saveToStorage,
    loadFromStorage,
    clearAllData,
    resetToDefault
  }
})
