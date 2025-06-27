<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          博客文章
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          探索我们精心撰写的文章，涵盖技术、设计、生活等多个领域
        </p>
      </div>

      <!-- Filters and Search -->
      <div class="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            v-model="blogStore.searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        <!-- Category filter -->
        <div class="flex items-center space-x-4">
          <select
            v-model="blogStore.selectedCategory"
            class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="">所有分类</option>
            <option
              v-for="category in blogStore.categories"
              :key="category.id"
              :value="category.slug"
            >
              {{ category.name }} ({{ category.count }})
            </option>
          </select>

          <!-- Sort options -->
          <select
            v-model="sortBy"
            class="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="newest">最新发布</option>
            <option value="oldest">最早发布</option>
            <option value="title">标题排序</option>
          </select>
        </div>
      </div>

      <!-- Results info -->
      <div class="mb-6 flex items-center justify-between">
        <p class="text-gray-600 dark:text-gray-400">
          找到 {{ sortedPosts.length }} 篇文章
          <span v-if="blogStore.searchQuery || blogStore.selectedCategory">
            {{ blogStore.searchQuery ? `包含 "${blogStore.searchQuery}"` : '' }}
            {{ blogStore.selectedCategory ? `在 "${getCategoryName(blogStore.selectedCategory)}" 分类中` : '' }}
          </span>
        </p>

        <!-- Clear filters -->
        <button
          v-if="blogStore.searchQuery || blogStore.selectedCategory"
          @click="clearFilters"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200 flex items-center space-x-1"
        >
          <X class="w-4 h-4" />
          <span>清除筛选</span>
        </button>
      </div>

      <!-- Posts grid -->
      <div v-if="sortedPosts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BlogCard
          v-for="post in paginatedPosts"
          :key="post.id"
          :post="post"
          class="animate-fade-in"
        />
      </div>

      <!-- No results -->
      <div v-else class="text-center py-16">
        <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
          <FileText class="w-12 h-12 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          没有找到文章
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          尝试调整搜索条件或浏览其他分类
        </p>
        <button
          @click="clearFilters"
          class="btn-primary"
        >
          查看所有文章
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>

          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
              page === currentPage
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, X, FileText, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import BlogCard from '../components/BlogCard.vue'
import { useBlogStore } from '../stores/blog'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const sortBy = ref('newest')
const currentPage = ref(1)
const postsPerPage = 9

// Initialize filters from URL params
onMounted(() => {
  if (route.query.category) {
    blogStore.selectedCategory = route.query.category as string
  }
  if (route.query.search) {
    blogStore.searchQuery = route.query.search as string
  }
})

// Watch for filter changes and update URL
watch(
  () => [blogStore.searchQuery, blogStore.selectedCategory],
  () => {
    const query: Record<string, string> = {}
    if (blogStore.searchQuery) query.search = blogStore.searchQuery
    if (blogStore.selectedCategory) query.category = blogStore.selectedCategory
    
    router.replace({ query })
    currentPage.value = 1
  }
)

const sortedPosts = computed(() => {
  const posts = [...blogStore.filteredPosts]
  
  switch (sortBy.value) {
    case 'oldest':
      return posts.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    case 'title':
      return posts.sort((a, b) => a.title.localeCompare(b.title))
    case 'newest':
    default:
      return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
})

const totalPages = computed(() => Math.ceil(sortedPosts.value.length / postsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return sortedPosts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const getCategoryName = (categorySlug: string) => {
  const category = blogStore.getCategoryBySlug(categorySlug)
  return category?.name || categorySlug
}

const clearFilters = () => {
  blogStore.searchQuery = ''
  blogStore.selectedCategory = ''
  currentPage.value = 1
}
</script>
