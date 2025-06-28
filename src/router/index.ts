import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../views/BlogPost.vue'
import Contact from '../views/Contact.vue'
import Admin from '../views/Admin.vue'
import Login from '../views/Login.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  // 在生产环境使用 hash 模式以支持 GitHub Pages
  history: import.meta.env.PROD
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: BlogPost,
      props: true
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // 未登录，重定向到登录页面
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 验证token有效性
    const isValid = await authStore.validateToken()
    if (!isValid) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // 检查是否需要游客状态（如登录页面）
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'admin' })
    return
  }

  next()
})

export default router
