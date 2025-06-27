<template>
  <article class="card group cursor-pointer overflow-hidden" @click="navigateToPost">
    <!-- Cover image -->
    <div class="relative overflow-hidden">
      <img
        :src="post.coverImage"
        :alt="post.title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <!-- Featured badge -->
      <div
        v-if="post.featured"
        class="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        精选
      </div>
      
      <!-- Category badge -->
      <div class="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
        {{ getCategoryName(post.category) }}
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Meta info -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
        <div class="flex items-center space-x-4">
          <span class="flex items-center space-x-1">
            <User class="w-4 h-4" />
            <span>{{ post.author }}</span>
          </span>
          <span class="flex items-center space-x-1">
            <Clock class="w-4 h-4" />
            <span>{{ post.readTime }} 分钟阅读</span>
          </span>
        </div>
        <time :datetime="post.publishedAt">
          {{ formatDate(post.publishedAt) }}
        </time>
      </div>

      <!-- Title -->
      <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-2">
        {{ post.title }}
      </h3>

      <!-- Excerpt -->
      <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {{ post.excerpt }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
        >
          #{{ tag }}
        </span>
        <span
          v-if="post.tags.length > 3"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md"
        >
          +{{ post.tags.length - 3 }}
        </span>
      </div>

      <!-- Read more -->
      <div class="flex items-center justify-between">
        <button class="text-primary-600 dark:text-primary-400 font-medium text-sm hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 flex items-center space-x-1 group/btn">
          <span>阅读更多</span>
          <ArrowRight class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </button>
        
        <!-- Share button -->
        <button
          @click.stop="sharePost"
          class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          :aria-label="'分享文章: ' + post.title"
        >
          <Share2 class="w-4 h-4" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { User, Clock, ArrowRight, Share2 } from 'lucide-vue-next'
import { useBlogStore, type BlogPost } from '../stores/blog'

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()
const router = useRouter()
const blogStore = useBlogStore()

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

const navigateToPost = () => {
  router.push(`/blog/${props.post.slug}`)
}

const sharePost = async () => {
  const url = `${window.location.origin}/blog/${props.post.slug}`
  const title = props.post.title
  const text = props.post.excerpt

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      })
    } catch (error) {
      // User cancelled sharing
    }
  } else {
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url)
      alert('链接已复制到剪贴板')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
