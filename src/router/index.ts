import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Layout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'books',
          name: 'Books',
          component: () => import('../views/Books.vue')
        },
        {
          path: 'books/:id',
          name: 'BookDetail',
          component: () => import('../views/BookDetail.vue'),
          props: true
        },
        {
          path: 'my-books',
          name: 'MyBooks',
          component: () => import('../views/MyBooks.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'admin',
          name: 'Admin',
          component: () => import('../views/admin/AdminLayout.vue'),
          meta: { requiresAuth: true, requiresAdmin: true },
          children: [
            {
              path: '',
              name: 'AdminDashboard',
              component: () => import('../views/admin/Dashboard.vue')
            },
            {
              path: 'books',
              name: 'AdminBooks',
              component: () => import('../views/admin/Books.vue')
            },
            {
              path: 'books/edit/:id',
              name: 'EditBook',
              component: () => import('../views/admin/EditBook.vue'),
              props: true
            },
            {
              path: 'books/add',
              name: 'AddBook',
              component: () => import('../views/admin/AddBook.vue')
            },
            {
              path: 'users',
              name: 'AdminUsers',
              component: () => import('../views/admin/Users.vue')
            },
            {
              path: 'borrowings',
              name: 'AdminBorrowings',
              component: () => import('../views/admin/Borrowings.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router