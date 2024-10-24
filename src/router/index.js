import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/admin/DefaultLayout'

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
            /* webpackChunkName: "dashboard" */ '@/views/admin/Dashboard.vue'
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
    component: () => import('@/views/error/Page404.vue'),
  },
  {
    path: '/500',
    name: 'Internal Error',
    component: () => import('@/views/error/Page500.vue'),
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
          /* webpackChunkName: "dashboard" */ '@/views/admin/Dashboard.vue'
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
            component: () => import('@/views/error/Page404.vue'),
          },
          {
            path: '/admin/user/role',
            name: 'Role',
            component: () => import('@/views/error/Page404.vue'),
          },
          {
            path: '/admin/user/register',
            name: 'Admin Register',
            component: () => import('@/views/error/Page404.vue'),
          },
          {
            path: '/admin/user/:id',
            name: 'User Detail',
            component: () => import('@/views/error/Page404.vue'),
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
            component: () => import('@/views/error/Page404.vue'),
          },
          {
            path: '/admin/product/addproduct',
            name: 'Add Product',
            component: () => import('@/views/error/Page404.vue'),
          },
          {
            path: '/admin/product/:id',
            name: 'Product Detail',
            component: () => import('@/views/error/Page404.vue'),
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
            component: () => import('@/views/admin/OrderManagement.vue'),
          },
          {
            path: '/admin/order/:id',
            name: 'Order Detail',
            component: () => import('@/views/error/Page404.vue'),
          },
        ]
      },
    ],
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

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin')) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!!user && user['roles'][0] === 'ADMIN') {
      next();
    } else {
      next({ path: '/login' });
    }
  } else {
    next();
  }
});

export default router
