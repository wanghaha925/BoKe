<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            文章管理
          </h1>
          <button
            @click="showCreateModal = true"
            class="btn-primary flex items-center space-x-2"
          >
            <Plus class="w-5 h-5" />
            <span>新建文章</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FileText class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">总文章数</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ blogStore.posts.length }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Star class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">精选文章</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ blogStore.featuredPosts.length }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Folder class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">分类数量</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ blogStore.categories.length }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Clock class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">草稿数量</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">0</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Articles Table -->
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">文章列表</h2>
            <div class="flex items-center space-x-4">
              <select
                v-model="filterCategory"
                class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              >
                <option value="">所有分类</option>
                <option v-for="category in blogStore.categories" :key="category.id" :value="category.slug">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  文章
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  分类
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  发布时间
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <img :src="post.coverImage" :alt="post.title" class="w-12 h-12 rounded-lg object-cover mr-4" />
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ post.title }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ post.author }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                    {{ getCategoryName(post.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="post.featured" class="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                    精选
                  </span>
                  <span v-else class="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    已发布
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(post.publishedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editPost(post)"
                      class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="deletePost(post.id)"
                      class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingPost" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>
        
        <div class="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ editingPost ? '编辑文章' : '新建文章' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="savePost" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文章标题 *
                </label>
                <input
                  v-model="postForm.title"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL 别名 *
                </label>
                <input
                  v-model="postForm.slug"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分类 *
                </label>
                <select
                  v-model="postForm.category"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">选择分类</option>
                  <option v-for="category in blogStore.categories" :key="category.id" :value="category.slug">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  作者
                </label>
                <input
                  v-model="postForm.author"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                封面图片 URL
              </label>
              <input
                v-model="postForm.coverImage"
                type="url"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                文章摘要 *
              </label>
              <textarea
                v-model="postForm.excerpt"
                rows="3"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标签（用逗号分隔）
              </label>
              <input
                v-model="tagsInput"
                type="text"
                placeholder="Vue.js, 前端, JavaScript"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                文章内容 *
              </label>
              <textarea
                v-model="postForm.content"
                rows="12"
                required
                placeholder="在这里输入您的文章内容，支持 Markdown 格式..."
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none font-mono text-sm"
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                  v-model="postForm.featured"
                  type="checkbox"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">设为精选文章</span>
              </label>
            </div>

            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="closeModal"
                class="btn-secondary"
              >
                取消
              </button>
              <button
                type="submit"
                class="btn-primary"
              >
                {{ editingPost ? '更新文章' : '发布文章' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Plus, FileText, Star, Folder, Clock, Edit, Trash2, X } from 'lucide-vue-next'
import { useBlogStore, type BlogPost } from '../stores/blog'

const blogStore = useBlogStore()

const showCreateModal = ref(false)
const editingPost = ref<BlogPost | null>(null)
const filterCategory = ref('')

const postForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  category: '',
  coverImage: '',
  featured: false
})

const tagsInput = ref('')

const filteredPosts = computed(() => {
  if (!filterCategory.value) return blogStore.posts
  return blogStore.posts.filter(post => post.category === filterCategory.value)
})

// Auto-generate slug from title
watch(() => postForm.value.title, (newTitle) => {
  if (newTitle && !editingPost.value) {
    postForm.value.slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

const getCategoryName = (categorySlug: string) => {
  const category = blogStore.getCategoryBySlug(categorySlug)
  return category?.name || categorySlug
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const editPost = (post: BlogPost) => {
  editingPost.value = post
  postForm.value = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    category: post.category,
    coverImage: post.coverImage,
    featured: post.featured
  }
  tagsInput.value = post.tags.join(', ')
}

const closeModal = () => {
  showCreateModal.value = false
  editingPost.value = null
  postForm.value = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    coverImage: '',
    featured: false
  }
  tagsInput.value = ''
}

const savePost = () => {
  const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)

  const postData = {
    ...postForm.value,
    tags,
    readTime: Math.ceil(postForm.value.content.length / 200), // Rough estimate
  }

  if (editingPost.value) {
    // Update existing post
    const updatedPost = blogStore.updatePost(editingPost.value.id, postData)
    if (updatedPost) {
      closeModal()
      alert('文章更新成功！')
    } else {
      alert('更新失败，请重试')
    }
  } else {
    // Add new post
    const newPost = blogStore.addPost(postData as Omit<BlogPost, 'id'>)
    if (newPost) {
      closeModal()
      alert('文章发布成功！')
    } else {
      alert('发布失败，请重试')
    }
  }
}

const deletePost = (postId: string) => {
  if (confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
    const deletedPost = blogStore.deletePost(postId)
    if (deletedPost) {
      alert('文章删除成功！')
    } else {
      alert('删除失败，请重试')
    }
  }
}
</script>
