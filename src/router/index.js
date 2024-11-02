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
        name: 'User',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          }
        },
        children: [
          {
            path: '/admin/user/management',
            name: 'User Management',
            component: () => import('@/views/admin/UserManagement.vue'),
          },
          {
            path: '/admin/user/register',
            name: 'Admin Register',
            component: () => import('@/views/error/Page404.vue'),
          },
          {
            path: '/admin/user/:id',
            name: 'Admin Detail',
            component: () => import('@/views/admin/UserModify.vue'),
            props: true,
          }
        ]
      },
      {
        path: '/admin/role',
        name: 'Role',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          }
        },
        redirect: '/admin/role/management',
        children: [
          {
            path: '/admin/role/management',
            name: 'Role Management',
            component: () => import('@/views/admin/RoleManagement.vue'),
          },
          {
            path: '/admin/role/:id',
            name: 'Role Detail',
            component: () => import('@/views/admin/RoleModify.vue'),
            props: true,
          },
        ]
      },
      {
        path: '/admin/category',
        name: 'Category',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          }
        },
        redirect: "/admin/category/management",
        children: [
          {
            path: '/admin/category/management',
            name: 'Category Management',
            component: () => import('@/views/admin/CategoryManagement.vue'),
          },
          {
            path: '/admin/category/:id',
            name: 'Category Detail',
            component: () => import('@/views/admin/CategoryModify.vue'),
            props: true,
          },
        ]
      },
      {
        path: '/admin/product',
        name: 'Product',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          }
        },
        children: [
          {
            path: '/admin/product/management',
            name: 'Product Management',
            component: () => import('@/views/admin/ProductManagement.vue'),
          },
          {
            path: '/admin/product/:id',
            name: 'Add Product',
            component: () => import('@/views/admin/ProductModify.vue'),
            props: true,
          },
        ]
      },
      {
        path: '/admin/order',
        name: 'Order',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          }
        },
        redirect: '/admin/order/management',
        children: [
          {
            path: '/admin/order/management',
            name: 'Order Management',
            component: () => import('@/views/admin/OrderManagement.vue'),
          },
          {
            path: '/admin/order/:id',
            name: 'Order Detail',
            component: () => import('@/views/admin/OrderModify.vue'),
            props: true,
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
  if (!router.hasRoute(to.name)) {
    return next({ name: "Forbidden" });
  }

  if (to.path.startsWith('/admin') || to.path.includes('/check-out')) {
    const userData = sessionStorage.getItem('user');

    if (!userData) {
      console.error("No user data found");
      sessionStorage.removeItem('jwt');
      return next({ path: '/login', query: { error: 'access_denied' } });
    }

    const user = JSON.parse(userData);

    if (user.roles && user.roles.includes('ADMIN')) {
      return next();
    } else {
      console.error("Unauthorized access - not an admin");
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('jwt');
      return next({ path: '/login', query: { error: 'access_denied' } });
    }
  }

  return next();
});

export default router
