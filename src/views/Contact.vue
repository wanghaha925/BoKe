<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          联系我们
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          有任何问题、建议或合作意向？我们很乐意听到您的声音。
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div class="card p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            发送消息
          </h2>
          
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  姓名 *
                </label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  姓氏
                </label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                邮箱地址 *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                主题 *
              </label>
              <select
                id="subject"
                v-model="form.subject"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">请选择主题</option>
                <option value="general">一般咨询</option>
                <option value="collaboration">合作提案</option>
                <option value="feedback">反馈建议</option>
                <option value="technical">技术支持</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                消息内容 *
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                required
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                placeholder="请详细描述您的问题或建议..."
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full btn-primary py-3 text-lg"
            >
              {{ isSubmitting ? '发送中...' : '发送消息' }}
            </button>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="space-y-8">
          <!-- Contact Methods -->
          <div class="card p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              联系方式
            </h2>
            
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    邮箱
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    contact@luxuryblog.com
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-500">
                    我们会在24小时内回复您的邮件
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    在线客服
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    周一至周五 9:00-18:00
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-500">
                    实时在线支持
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    地址
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400">
                    中国北京市朝阳区<br>
                    科技园区创新大厦
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="card p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              关注我们
            </h2>
            
            <div class="grid grid-cols-2 gap-4">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                class="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
              >
                <component :is="social.icon" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span class="text-gray-900 dark:text-gray-100 font-medium">{{ social.name }}</span>
              </a>
            </div>
          </div>

          <!-- FAQ -->
          <div class="card p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              常见问题
            </h2>
            
            <div class="space-y-4">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  如何订阅博客更新？
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  您可以在页面底部输入邮箱地址订阅我们的博客，我们会定期发送最新文章。
                </p>
              </div>
              
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  可以投稿吗？
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  当然可以！请通过邮件联系我们，我们欢迎高质量的原创内容。
                </p>
              </div>
              
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  如何合作？
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  请选择"合作提案"主题发送消息，详细说明您的合作意向。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, MessageCircle, MapPin, Github, Twitter, Linkedin, Instagram } from 'lucide-vue-next'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const socialLinks = [
  { name: 'GitHub', icon: Github, url: 'https://github.com' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com' }
]

const submitForm = async () => {
  isSubmitting.value = true
  
  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Show success message
  alert('消息发送成功！我们会尽快回复您。')
  
  // Reset form
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  }
  
  isSubmitting.value = false
}
</script>
