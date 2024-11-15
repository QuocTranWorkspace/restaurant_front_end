
# Restaurant Front-End Project Setup

## Prerequisites
- Node.js 16 or higher
- Vue CLI

---

## Setup Instructions

### 1. Install Dependencies
Run the following command in the project root directory to install dependencies:
```bash
npm install
```

### 2. Start the Development Server
Use the following command to start the front-end development server:
```bash
npm run dev
```
or
```bash
npm run serve
```
The application will be accessible at `http://localhost:3001`.

### 3. Build for Production
To build the front-end for production, run:
```bash
npm run build
```

---

## How to Run
1. Follow the backend setup instructions to start the Spring Boot server.
2. Start the front-end development server using `npm run serve`.
3. Open `http://localhost:3000` in your web browser.

---

## Login with Default Accounts
The application has two default accounts for testing purposes:

### Admin Account
- **Username:** admin  
- **Password:** Admin@123  

### User Account
- **Username:** non_admin  
- **Password:** Non_admin@123  

### Steps to Create Products
1. Log in using the admin account (admin/Admin@123).
2. Navigate to the product management section in the admin panel.
3. Use the interface to add, update, or delete products as needed.

---

### Notes
- Ensure the backend server is running before using the application.
- The default accounts are for development and testing only. Update them for production environments.

# Routes

## Public Routes

### User Layout
- `/` → **Home** (Redirects to `/home`)
  - `/home` → **Home Page** (Lazy-loaded from `@/views/user/Home.vue`)
  - `/login` → **Log in** (Lazy-loaded from `@/views/auth/Login.vue`)
  - `/register` → **Register** (Lazy-loaded from `@/views/auth/Register.vue`)
  - `/products` → **Product Page** (Redirects to `/home`)
    - `/products/:category` → **Product Filtered** (Lazy-loaded from `@/views/user/Home.vue`, Props enabled)
  - `/product/:id` → **Product Detail** (Lazy-loaded from `@/views/user/ProductDetail.vue`, Props enabled)
  - `/check-out` → **Check-out** (Lazy-loaded from `@/views/user/Check-out.vue`)
  - `/profile` → **User Profile** (Lazy-loaded from `@/views/user/UserProfile.vue`)

### Error Pages
- `/404` → **Forbidden** (Lazy-loaded from `@/views/error/Page404.vue`)
- `/500` → **Internal Error** (Lazy-loaded from `@/views/error/Page500.vue`)

## Admin Routes

### Admin Layout
- `/admin` → **Restaurant Admin** (Redirects to `/admin/dashboard`)
  - `/admin/dashboard` → **Dashboard** (Lazy-loaded from `@/views/admin/Dashboard.vue`)

#### User Management
- `/admin/user` → **User**
  - `/admin/user/management` → **User Management** (Lazy-loaded from `@/views/admin/UserManagement.vue`)
  - `/admin/user/register` → **Admin Register** (Lazy-loaded from `@/views/error/Page404.vue`)
  - `/admin/user/:id` → **Admin Detail** (Lazy-loaded from `@/views/admin/UserModify.vue`, Props enabled)

#### Role Management
- `/admin/role` → **Role** (Redirects to `/admin/role/management`)
  - `/admin/role/management` → **Role Management** (Lazy-loaded from `@/views/admin/RoleManagement.vue`)
  - `/admin/role/:id` → **Role Detail** (Lazy-loaded from `@/views/admin/RoleModify.vue`, Props enabled)

#### Category Management
- `/admin/category` → **Category** (Redirects to `/admin/category/management`)
  - `/admin/category/management` → **Category Management** (Lazy-loaded from `@/views/admin/CategoryManagement.vue`)
  - `/admin/category/:id` → **Category Detail** (Lazy-loaded from `@/views/admin/CategoryModify.vue`, Props enabled)

#### Product Management
- `/admin/product` → **Product**
  - `/admin/product/management` → **Product Management** (Lazy-loaded from `@/views/admin/ProductManagement.vue`)
  - `/admin/product/:id` → **Add Product** (Lazy-loaded from `@/views/admin/ProductModify.vue`, Props enabled)

#### Order Management
- `/admin/order` → **Order** (Redirects to `/admin/order/management`)
  - `/admin/order/management` → **Order Management** (Lazy-loaded from `@/views/admin/OrderManagement.vue`)
  - `/admin/order/:id` → **Order Detail** (Lazy-loaded from `@/views/admin/OrderModify.vue`, Props enabled)
