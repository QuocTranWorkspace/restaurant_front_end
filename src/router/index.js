import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/admin/DefaultLayout'

const isAuthenticated = () => {
  return !!sessionStorage.getItem('token')
}

const isAdmin = () => {
  return sessionStorage.getItem('user')['roles'][0]['roleName'] === 'ADMIN'
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      }
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home Page',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'
          ),
      },
      {
        path: '/login',
        name: 'Log in',
        component: () => import('@/views/auth/Login.vue'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/auth/Register.vue'),
      },
      {
        path: '/products',
        name: 'Product Page',
        component: () => import('@/views/base/Accordion.vue'),
        children: [
          {
            path: '/products/:id',
            name: 'Product Detail',
            component: () => import('@/views/base/Accordion.vue'),
          },
        ],
      },
      {
        path: '/cart',
        name: 'Shopping Cart',
        component: () => import('@/views/base/Accordion.vue'),
      },
      {
        path: '/check-out',
        name: 'Check-out',
        component: () => import('@/views/base/Accordion.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: 'Forbidden',
    component: () => import('@/views/pages/Page404.vue'),
  },
  {
    path: '/500',
    name: 'Internal Error',
    component: () => import('@/views/pages/Page500.vue'),
  },
  {
    path: '/admin',
    name: 'Restaurant Admin',
    component: DefaultLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: '/admin/dashboard',
        name: 'Dashboard',
        component: () => import(
          /* webpackChunkName: "dashboard" */ '@/views/dashboard/Dashboard.vue'
        ),
      },
      {
        path: '/admin/user',
        name: 'User Management',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          }
        },
        children: [
          {
            path: '/admin/user/management',
            name: 'Management',
            component: () => import('@/views/pages/Page404.vue'),
          },
          {
            path: '/admin/user/role',
            name: 'Role',
            component: () => import('@/views/pages/Page404.vue'),
          },
          {
            path: '/admin/user/register',
            name: 'Admin Register',
            component: () => import('@/views/pages/Page404.vue'),
          },
          {
            path: '/admin/user/:id',
            name: 'User Detail',
            component: () => import('@/views/pages/Page404.vue'),
          }
        ]
      },
      {
        path: '/admin/product',
        name: 'Product Management',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          }
        },
        children: [
          {
            path: '/admin/product/management',
            name: 'Management',
            component: () => import('@/views/pages/Page404.vue'),
          },
          {
            path: '/admin/product/addproduct',
            name: 'Add Product',
            component: () => import('@/views/pages/Page404.vue'),
          },
          {
            path: '/admin/product/:id',
            name: 'Product Detail',
            component: () => import('@/views/pages/Page404.vue'),
          },
        ]
      },
      {
        path: '/admin/order',
        name: 'Order Management',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          }
        },
        children: [
          {
            path: '/admin/order/management',
            name: 'Management',
            component: () => import('@/views/pages/Page404.vue'),
          },
          {
            path: '/admin/order/:id',
            name: 'Order Detail',
            component: () => import('@/views/pages/Page404.vue'),
          },
        ]
      },
    ],
    beforeEnter: (to, from, next) => {
      if (isAuthenticated() && isAdmin()) {
        next();
      }
      else {
        next({
          path: '/login'
        })
      }
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
