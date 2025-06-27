<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20 overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 animate-fade-in">
            欢迎来到
            <span class="gradient-text">阿彬的博客</span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto animate-slide-up">
            探索技术前沿，分享设计灵感，记录生活感悟。在这里，每一篇文章都是一次思想的旅行。
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <router-link to="/blog" class="btn-primary text-lg px-8 py-3">
              开始阅读
            </router-link>
            <router-link to="/about" class="btn-secondary text-lg px-8 py-3">
              了解更多
            </router-link>
          </div>
        </div>
      </div>
      
      <!-- Floating elements -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-bounce-slow"></div>
      <div class="absolute bottom-20 right-10 w-16 h-16 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-bounce-slow" style="animation-delay: 1s;"></div>
    </section>

    <!-- Featured Posts Section -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            精选文章
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            我们精心挑选的优质内容，为您带来最有价值的阅读体验
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard
            v-for="post in blogStore.featuredPosts"
            :key="post.id"
            :post="post"
            class="animate-fade-in"
          />
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="text-center"
          >
            <div class="text-3xl md:text-4xl font-bold gradient-text mb-2">
              {{ stat.value }}
            </div>
            <div class="text-gray-600 dark:text-gray-400 font-medium">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Posts Section -->
    <section class="py-16 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              最新文章
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              保持对最新内容的关注
            </p>
          </div>
          <router-link
            to="/blog"
            class="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 flex items-center space-x-1"
          >
            <span>查看全部</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogCard
            v-for="post in blogStore.recentPosts"
            :key="post.id"
            :post="post"
            class="animate-fade-in"
          />
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            探索分类
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            按照您感兴趣的主题浏览内容
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <router-link
            v-for="category in blogStore.categories"
            :key="category.id"
            :to="`/blog?category=${category.slug}`"
            class="card p-6 text-center hover:scale-105 transition-transform duration-200 group"
          >
            <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <component :is="getCategoryIcon(category.slug)" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
              {{ category.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-3">
              {{ category.description }}
            </p>
            <span class="text-primary-600 dark:text-primary-400 text-sm font-medium">
              {{ category.count }} 篇文章
            </span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, Code, Palette, Smartphone, Coffee } from 'lucide-vue-next'
import BlogCard from '../components/BlogCard.vue'
import { useBlogStore } from '../stores/blog'

const blogStore = useBlogStore()

const stats = [
  { label: '总文章数', value: '50+' },
  { label: '月访问量', value: '10K+' },
  { label: '注册用户', value: '1K+' },
  { label: '获得点赞', value: '5K+' }
]

const getCategoryIcon = (slug: string) => {
  const icons: Record<string, any> = {
    technology: Code,
    frontend: Smartphone,
    design: Palette,
    lifestyle: Coffee
  }
  return icons[slug] || Code
}
</script>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
</style>
