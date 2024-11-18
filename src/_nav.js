export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },
  {
    component: 'CNavTitle',
    name: 'User',
  },
  {
    component: 'CNavItem',
    name: 'User',
    to: '/admin/user',
    icon: 'cil-fingerprint',
    items: [
      {
        component: 'CNavItem',
        name: 'User Management',
        to: '/admin/user/management',
      },
      {
        component: 'CNavItem',
        name: 'User Detail',
        to: '/admin/user/addUser',
      },
    ]
  },
  {
    component: 'CNavTitle',
    name: 'Role',
  },
  {
    component: 'CNavItem',
    name: 'Role',
    to: '/admin/role',
    icon: 'cil-contact',
    items: [
      {
        component: 'CNavItem',
        name: 'Role Management',
        to: '/admin/role/management',
      },
      {
        component: 'CNavItem',
        name: 'Role Detail',
        to: '/admin/role/addRole',
      },
    ]
  },
  {
    component: 'CNavTitle',
    name: 'Product',
  },
  {
    component: 'CNavItem',
    name: 'Product',
    to: '/admin/product',
    icon: 'cil-apple',
    items: [
      {
        component: "CNavItem",
        name: 'Product Management',
        to: '/admin/product/management',
      },
      {
        component: 'CNavItem',
        name: 'Product Detail',
        to: '/admin/product/addProduct',
      }
    ]
  },
  {
    component: 'CNavTitle',
    name: 'Category',
  },
  {
    component: 'CNavItem',
    name: 'Category',
    to: '/admin/category',
    icon: 'cil-tags',
    items: [
      {
        component: "CNavItem",
        name: 'Category Management',
        to: '/admin/category/management',
      },
      {
        component: 'CNavItem',
        name: 'Category Detail',
        to: '/admin/category/addCategory',
      }
    ]
  },
  {
    component: 'CNavTitle',
    name: 'Order',
  },
  {
    component: 'CNavItem',
    name: 'Order Management',
    to: '/admin/order',
    icon: 'cil-basket',
    items: [
      {
        component: 'CNavItem',
        name: 'Management',
        to: '/admin/order/management',
        icon: ''
      },
      {
        component: 'CNavItem',
        name: 'Order Detail',
        to: '/admin/order/orderProduct',
        icon: ''
      }
    ]
  },
]
