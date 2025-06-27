<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="relative py-20 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          关于我们
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          我们致力于分享高质量的技术内容、设计灵感和生活感悟，为读者提供有价值的知识和见解。
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose prose-lg dark:prose-invert mx-auto">
          <h2>我们的故事</h2>
          <p>
            博客诞生于对知识分享的热爱和对优质内容的追求。我们相信，在这个信息爆炸的时代，
            真正有价值的内容应该被精心策划、用心撰写，并以最优雅的方式呈现给读者。
          </p>
          
          <h2>我们的使命</h2>
          <p>
            我们的使命是创建一个高质量的内容平台，在这里：
          </p>
          <ul>
            <li>技术爱好者可以找到最前沿的技术见解和实践经验</li>
            <li>设计师可以获得灵感和设计思维的启发</li>
            <li>每个人都能在这里找到有价值的生活感悟和思考</li>
          </ul>

          <h2>我们的价值观</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose my-12">
            <div class="card p-6">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Heart class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">用心创作</h3>
              <p class="text-gray-600 dark:text-gray-400">
                每一篇文章都经过精心策划和反复打磨，确保为读者提供最有价值的内容。
              </p>
            </div>

            <div class="card p-6">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Users class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">社区驱动</h3>
              <p class="text-gray-600 dark:text-gray-400">
                我们重视读者的反馈和建议，致力于建设一个互动性强的知识分享社区。
              </p>
            </div>

            <div class="card p-6">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">持续创新</h3>
              <p class="text-gray-600 dark:text-gray-400">
                我们不断探索新的内容形式和表达方式，为读者带来更好的阅读体验。
              </p>
            </div>

            <div class="card p-6">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                <Target class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">专注品质</h3>
              <p class="text-gray-600 dark:text-gray-400">
                我们坚持质量胜过数量的原则，每一篇文章都力求做到最好。
              </p>
            </div>
          </div>

          <h2>加入我们</h2>
          <p>
            如果您也热爱分享知识，有独特的见解和经验，欢迎加入我们的创作者团队。
            我们提供完善的创作支持和广阔的展示平台，让您的声音被更多人听到。
          </p>
        </div>

        <!-- CTA Section -->
        <div class="mt-16 text-center">
          <div class="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-4">准备开始您的阅读之旅了吗？</h3>
            <p class="text-primary-100 mb-6 max-w-2xl mx-auto">
              探索我们精心策划的文章，发现新的见解和灵感。
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link
                to="/blog"
                class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                开始阅读
              </router-link>
              <router-link
                to="/contact"
                class="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                联系我们
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Heart, Users, Lightbulb, Target } from 'lucide-vue-next'
</script>

<style scoped>
.prose {
  max-width: none;
}

.prose h2 {
  @apply text-2xl font-bold text-gray-900 dark:text-gray-100 mt-12 mb-6;
}

.prose p {
  @apply text-gray-600 dark:text-gray-400 leading-relaxed mb-6;
}

.prose ul {
  @apply text-gray-600 dark:text-gray-400 space-y-2;
}

.prose li {
  @apply leading-relaxed;
}
</style>
