import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
const Home = () => import('@/views/Home.vue')
const ProductList = () => import('@/views/product/ProductList.vue')
const ProductDetail = () => import('@/views/product/ProductDetail.vue')
const Category = () => import('@/views/product/Category.vue')
const Cart = () => import('@/views/cart/Cart.vue')
const Order = () => import('@/views/order/Order.vue')
const OrderDetail = () => import('@/views/order/OrderDetail.vue')
const Checkout = () => import('@/views/order/Checkout.vue')
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const Profile = () => import('@/views/user/Profile.vue')
const Search = () => import('@/views/search/Search.vue')

// 管理后台页面
const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')
const AdminProducts = () => import('@/views/admin/Products.vue')
const AdminOrders = () => import('@/views/admin/Orders.vue')
const AdminUsers = () => import('@/views/admin/Users.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
    meta: { title: '商品列表' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: '商品详情' }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    meta: { title: '商品分类' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { title: '购物车', requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Order',
    component: Order,
    meta: { title: '我的订单', requiresAuth: true }
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { title: '订单详情', requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { title: '结算', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '个人中心', requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { title: '搜索结果' }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { title: '管理后台' }
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: AdminProducts,
        meta: { title: '商品管理' }
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: AdminOrders,
        meta: { title: '订单管理' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: { title: '用户管理' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 自然商城` : '自然商城'
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/login')
      return
    }
  }
  
  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin) {
    const userRole = localStorage.getItem('userRole')
    if (userRole !== 'admin') {
      next('/')
      return
    }
  }
  
  next()
})

export default router
