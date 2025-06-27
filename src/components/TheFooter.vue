<template>
  <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand section -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <PenTool class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold gradient-text">阿彬的博客</span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            分享技术见解、设计灵感和生活感悟的现代博客平台。致力于为读者提供高质量的内容和优雅的阅读体验。
          </p>
          <div class="flex space-x-4">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              :aria-label="social.name"
            >
              <component :is="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
            快速链接
          </h3>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.name">
              <router-link
                :to="link.path"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Categories -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
            分类
          </h3>
          <ul class="space-y-3">
            <li v-for="category in blogStore.categories.slice(0, 4)" :key="category.id">
              <router-link
                :to="`/blog?category=${category.slug}`"
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex justify-between"
              >
                <span>{{ category.name }}</span>
                <span class="text-xs text-gray-400">({{ category.count }})</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- Newsletter subscription -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="max-w-md mx-auto text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            订阅我们的博客
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            获取最新文章和独家内容
          </p>
          <form @submit.prevent="subscribe" class="flex space-x-2">
            <input
              v-model="email"
              type="email"
              placeholder="输入您的邮箱"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            />
            <button
              type="submit"
              class="btn-primary whitespace-nowrap"
              :disabled="isSubscribing"
            >
              {{ isSubscribing ? '订阅中...' : '订阅' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom section -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          © {{ currentYear }} 豪华博客. 保留所有权利.
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a
            v-for="legal in legalLinks"
            :key="legal.name"
            :href="legal.url"
            class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
          >
            {{ legal.name }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PenTool, Github, Twitter, Linkedin, Mail } from 'lucide-vue-next'
import { useBlogStore } from '../stores/blog'

const blogStore = useBlogStore()

const email = ref('')
const isSubscribing = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
  { name: 'Email', icon: Mail, url: 'mailto:contact@luxuryblog.com' }
]

const quickLinks = [
  { name: '首页', path: '/' },
  { name: '博客', path: '/blog' },
  { name: '关于我们', path: '/about' },
  { name: '联系我们', path: '/contact' }
]

const legalLinks = [
  { name: '隐私政策', url: '/privacy' },
  { name: '服务条款', url: '/terms' },
  { name: 'Cookie 政策', url: '/cookies' }
]

const subscribe = async () => {
  if (!email.value) return
  
  isSubscribing.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Show success message (you can implement a toast notification here)
  alert('订阅成功！感谢您的关注。')
  
  email.value = ''
  isSubscribing.value = false
}
</script>
