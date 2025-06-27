<template>
  <nav class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2 group">
          <div class="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
            <PenTool class="w-5 h-5 text-white" />
          </div>
          <span class="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-200">
            阿彬的博客
          </span>
        </router-link>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 relative group"
            :class="{ 'text-primary-600 dark:text-primary-400': $route.path === item.path }"
          >
            {{ item.name }}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
          </router-link>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Search button -->
          <button
            @click="toggleSearch"
            class="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <Search class="w-5 h-5" />
          </button>

          <!-- Theme toggle -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <Sun v-if="themeStore.isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <!-- User Menu -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <img
                v-if="authStore.user?.avatar"
                :src="authStore.user.avatar"
                :alt="authStore.user.username"
                class="w-6 h-6 rounded-full"
              />
              <User v-else class="w-5 h-5" />
              <span class="hidden sm:block text-sm font-medium">{{ authStore.user?.username }}</span>
            </button>

            <!-- User Dropdown -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
            >
              <router-link
                to="/admin"
                @click="closeUserMenu"
                class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User class="w-4 h-4 mr-2" />
                管理面板
              </router-link>
              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut class="w-4 h-4 mr-2" />
                退出登录
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <router-link
            v-else
            to="/login"
            class="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
          >
            <User class="w-4 h-4" />
            <span>登录</span>
          </router-link>

          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
            <X v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-up"
      >
        <div class="flex flex-col space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            @click="closeMobileMenu"
            class="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200"
            :class="{ 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20': $route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Search overlay -->
    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      @click="closeSearch"
    >
      <div class="max-w-2xl mx-auto mt-20 px-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6" @click.stop>
          <div class="flex items-center space-x-3 mb-4">
            <Search class="w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="flex-1 bg-transparent text-lg outline-none text-gray-900 dark:text-gray-100"
              @keyup.enter="performSearch"
            />
            <button @click="closeSearch" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <X class="w-4 h-4" />
            </button>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            按 Enter 搜索，Esc 关闭
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { PenTool, Search, Sun, Moon, Menu, X, User, LogOut } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import { useBlogStore } from '../stores/blog'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const themeStore = useThemeStore()
const blogStore = useBlogStore()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const isUserMenuOpen = ref(false)
const searchQuery = ref('')

const navItems = [
  { name: '首页', path: '/' },
  { name: '博客', path: '/blog' },
  { name: '关于', path: '/about' },
  { name: '联系', path: '/contact' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    searchQuery.value = ''
  }
}

const closeSearch = () => {
  isSearchOpen.value = false
  searchQuery.value = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    blogStore.searchQuery = searchQuery.value
    router.push('/blog')
    closeSearch()
  }
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeUserMenu()
  router.push('/')
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (isSearchOpen.value) {
      closeSearch()
    } else if (isMobileMenuOpen.value) {
      closeMobileMenu()
    } else if (isUserMenuOpen.value) {
      closeUserMenu()
    }
  }
}

// 点击外部关闭菜单
const handleClickOutside = (e: Event) => {
  const target = e.target as Element
  if (isUserMenuOpen.value && !target.closest('.relative')) {
    closeUserMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.removeEventListener('click', handleClickOutside)
})
</script>
