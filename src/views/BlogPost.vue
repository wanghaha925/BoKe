<template>
  <div v-if="post" class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="relative h-96 overflow-hidden">
      <img
        :src="post.coverImage"
        :alt="post.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      <!-- Content overlay -->
      <div class="absolute inset-0 flex items-end">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div class="text-white">
            <!-- Category -->
            <div class="mb-4">
              <span class="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {{ getCategoryName(post.category) }}
              </span>
            </div>
            
            <!-- Title -->
            <h1 class="text-3xl md:text-5xl font-bold mb-4 text-balance">
              {{ post.title }}
            </h1>
            
            <!-- Meta info -->
            <div class="flex flex-wrap items-center gap-6 text-gray-200">
              <div class="flex items-center space-x-2">
                <User class="w-5 h-5" />
                <span>{{ post.author }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Calendar class="w-5 h-5" />
                <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
              </div>
              <div class="flex items-center space-x-2">
                <Clock class="w-5 h-5" />
                <span>{{ post.readTime }} 分钟阅读</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Article Content -->
    <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <!-- Main content -->
        <div class="lg:col-span-3">
          <!-- Article body -->
          <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div v-html="formattedContent"></div>
          </div>

          <!-- Tags -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">标签</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200 cursor-pointer"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Share buttons -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">分享文章</h3>
            <div class="flex space-x-4">
              <button
                v-for="share in shareButtons"
                :key="share.name"
                @click="sharePost(share.platform)"
                :class="[
                  'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                  share.class
                ]"
              >
                <component :is="share.icon" class="w-5 h-5" />
                <span>{{ share.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-24 space-y-8">
            <!-- Table of contents -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">目录</h3>
              <nav class="space-y-2">
                <a
                  v-for="heading in tableOfContents"
                  :key="heading.id"
                  :href="`#${heading.id}`"
                  :class="[
                    'block text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200',
                    heading.level === 2 ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400 ml-4'
                  ]"
                >
                  {{ heading.text }}
                </a>
              </nav>
            </div>

            <!-- Author info -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">作者</h3>
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold">{{ post.author.charAt(0) }}</span>
                </div>
                <div>
                  <div class="font-medium text-gray-900 dark:text-gray-100">{{ post.author }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">技术作家</div>
                </div>
              </div>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                专注于前端技术和用户体验设计，热爱分享技术见解和实践经验。
              </p>
            </div>

            <!-- Related posts -->
            <div class="card p-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">相关文章</h3>
              <div class="space-y-4">
                <article
                  v-for="relatedPost in relatedPosts"
                  :key="relatedPost.id"
                  class="group cursor-pointer"
                  @click="navigateToPost(relatedPost.slug)"
                >
                  <h4 class="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 mb-2 line-clamp-2">
                    {{ relatedPost.title }}
                  </h4>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(relatedPost.publishedAt) }}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Navigation -->
    <section class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center">
          <router-link
            to="/blog"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>返回博客列表</span>
          </router-link>
          
          <button
            @click="scrollToTop"
            class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <ArrowUp class="w-5 h-5" />
            <span>回到顶部</span>
          </button>
        </div>
      </div>
    </section>
  </div>

  <!-- 404 state -->
  <div v-else class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
    <div class="text-center">
      <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
        <FileText class="w-12 h-12 text-gray-400" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">文章未找到</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">抱歉，您要查找的文章不存在。</p>
      <router-link to="/blog" class="btn-primary">
        返回博客列表
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  User, Calendar, Clock, ArrowLeft, ArrowUp, FileText,
  Twitter, Facebook, Linkedin, Link
} from 'lucide-vue-next'
import { useBlogStore } from '../stores/blog'

interface Props {
  slug: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const post = computed(() => blogStore.getPostBySlug(props.slug))

const formattedContent = computed(() => {
  if (!post.value) return ''
  // Simple markdown-like formatting
  return post.value.content
    .replace(/^# (.*$)/gm, '<h1 id="$1">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 id="$1">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 id="$1">$1</h3>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.*)$/gm, '<p>$1</p>')
})

const tableOfContents = computed(() => {
  if (!post.value) return []
  const headings = post.value.content.match(/^#{1,3} (.*)$/gm) || []
  return headings.map(heading => {
    const level = heading.match(/^#+/)?.[0].length || 2
    const text = heading.replace(/^#+\s/, '')
    const id = text.toLowerCase().replace(/\s+/g, '-')
    return { level, text, id }
  })
})

const relatedPosts = computed(() => {
  if (!post.value) return []
  return blogStore.posts
    .filter(p => p.id !== post.value!.id && p.category === post.value!.category)
    .slice(0, 3)
})

const shareButtons = [
  {
    name: 'Twitter',
    platform: 'twitter',
    icon: Twitter,
    class: 'bg-blue-500 hover:bg-blue-600 text-white'
  },
  {
    name: 'Facebook',
    platform: 'facebook',
    icon: Facebook,
    class: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  {
    name: 'LinkedIn',
    platform: 'linkedin',
    icon: Linkedin,
    class: 'bg-blue-700 hover:bg-blue-800 text-white'
  },
  {
    name: '复制链接',
    platform: 'copy',
    icon: Link,
    class: 'bg-gray-500 hover:bg-gray-600 text-white'
  }
]

const getCategoryName = (categorySlug: string) => {
  const category = blogStore.getCategoryBySlug(categorySlug)
  return category?.name || categorySlug
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const navigateToPost = (slug: string) => {
  router.push(`/blog/${slug}`)
}

const sharePost = async (platform: string) => {
  const url = window.location.href
  const title = post.value?.title || ''
  const text = post.value?.excerpt || ''

  switch (platform) {
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
      break
    case 'facebook':
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
      break
    case 'linkedin':
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)
      break
    case 'copy':
      try {
        await navigator.clipboard.writeText(url)
        alert('链接已复制到剪贴板')
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
      }
      break
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  // If post not found, redirect to blog list
  if (!post.value) {
    router.push('/blog')
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose h1, .prose h2, .prose h3 {
  @apply font-serif font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4;
}

.prose h1 {
  @apply text-3xl;
}

.prose h2 {
  @apply text-2xl;
}

.prose h3 {
  @apply text-xl;
}

.prose p {
  @apply text-gray-700 dark:text-gray-300 leading-relaxed mb-4;
}
</style>
