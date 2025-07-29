<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo" @click="$router.push('/')">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center" alt="自然商城" />
          <span class="logo-text">自然商城</span>
        </div>
        
        <!-- 导航菜单 -->
        <nav class="nav-menu desktop-only">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/products" class="nav-item">商品</router-link>
          <el-dropdown @command="handleCategoryCommand">
            <span class="nav-item dropdown-trigger">
              分类 <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="electronics">数码电子</el-dropdown-item>
                <el-dropdown-item command="clothing">服装配饰</el-dropdown-item>
                <el-dropdown-item command="home">家居生活</el-dropdown-item>
                <el-dropdown-item command="books">图书文具</el-dropdown-item>
                <el-dropdown-item command="sports">运动户外</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </nav>
        
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品..."
            @keyup.enter="handleSearch"
            class="search-input"
          >
            <template #suffix>
              <el-icon @click="handleSearch" class="search-icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        
        <!-- 用户操作区 -->
        <div class="user-actions">
          <!-- 购物车 -->
          <div class="cart-icon" @click="$router.push('/cart')">
            <el-badge :value="cartCount" :hidden="cartCount === 0">
              <el-icon size="24"><ShoppingCart /></el-icon>
            </el-badge>
          </div>
          
          <!-- 用户菜单 -->
          <div v-if="isLoggedIn" class="user-menu">
            <el-dropdown @command="handleUserCommand">
              <div class="user-avatar">
                <img :src="userInfo.avatar || defaultAvatar" :alt="userInfo.username" />
                <span class="username desktop-only">{{ userInfo.username }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item command="admin" v-if="userInfo.role === 'admin'">管理后台</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          
          <!-- 登录/注册 -->
          <div v-else class="auth-buttons">
            <el-button @click="$router.push('/login')" text>登录</el-button>
            <el-button @click="$router.push('/register')" type="primary">注册</el-button>
          </div>
          
          <!-- 移动端菜单按钮 -->
          <div class="mobile-menu-btn mobile-only" @click="showMobileMenu = true">
            <el-icon size="24"><Menu /></el-icon>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单抽屉 -->
    <el-drawer
      v-model="showMobileMenu"
      title="菜单"
      direction="rtl"
      size="280px"
    >
      <div class="mobile-menu">
        <div class="mobile-nav">
          <router-link to="/" class="mobile-nav-item" @click="showMobileMenu = false">首页</router-link>
          <router-link to="/products" class="mobile-nav-item" @click="showMobileMenu = false">商品</router-link>
          <div class="mobile-category">
            <div class="category-title">商品分类</div>
            <div class="category-list">
              <div class="category-item" @click="goToCategory('electronics')">数码电子</div>
              <div class="category-item" @click="goToCategory('clothing')">服装配饰</div>
              <div class="category-item" @click="goToCategory('home')">家居生活</div>
              <div class="category-item" @click="goToCategory('books')">图书文具</div>
              <div class="category-item" @click="goToCategory('sports')">运动户外</div>
            </div>
          </div>
        </div>
        
        <div v-if="isLoggedIn" class="mobile-user">
          <div class="user-info">
            <img :src="userInfo.avatar || defaultAvatar" :alt="userInfo.username" class="avatar" />
            <span class="username">{{ userInfo.username }}</span>
          </div>
          <div class="user-actions">
            <div class="action-item" @click="goToProfile">个人中心</div>
            <div class="action-item" @click="goToOrders">我的订单</div>
            <div class="action-item" v-if="userInfo.role === 'admin'" @click="goToAdmin">管理后台</div>
            <div class="action-item logout" @click="handleLogout">退出登录</div>
          </div>
        </div>
        
        <div v-else class="mobile-auth">
          <el-button @click="goToLogin" type="primary" class="w-full mb-md">登录</el-button>
          <el-button @click="goToRegister" class="w-full">注册</el-button>
        </div>
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { ArrowDown, Search, ShoppingCart, Menu } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

// 响应式数据
const searchKeyword = ref('')
const showMobileMenu = ref(false)

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)
const cartCount = computed(() => cartStore.totalCount)

// 默认头像
const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'

// 方法
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchKeyword.value.trim() }
    })
  }
}

const handleCategoryCommand = (command) => {
  router.push(`/category/${command}`)
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'orders':
      router.push('/orders')
      break
    case 'admin':
      router.push('/admin')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
  showMobileMenu.value = false
}

// 移动端方法
const goToCategory = (category) => {
  router.push(`/category/${category}`)
  showMobileMenu.value = false
}

const goToProfile = () => {
  router.push('/profile')
  showMobileMenu.value = false
}

const goToOrders = () => {
  router.push('/orders')
  showMobileMenu.value = false
}

const goToAdmin = () => {
  router.push('/admin')
  showMobileMenu.value = false
}

const goToLogin = () => {
  router.push('/login')
  showMobileMenu.value = false
}

const goToRegister = () => {
  router.push('/register')
  showMobileMenu.value = false
}
</script>

<style scoped lang="scss">
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-light);
  height: 80px;
}

.header-content {
  @include flex-between;
  height: 80px;
  gap: var(--spacing-lg);
}

.logo {
  @include flex-center;
  gap: var(--spacing-sm);
  cursor: pointer;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .logo-text {
    font-size: var(--font-size-xl);
    font-weight: bold;
    color: var(--color-text-title);
  }
}

.nav-menu {
  display: flex;
  gap: var(--spacing-lg);
  
  .nav-item {
    color: var(--color-text-primary);
    font-weight: 500;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-medium);
    transition: var(--transition-normal);
    cursor: pointer;
    
    &:hover,
    &.router-link-active {
      background-color: var(--color-bg-hover);
      color: var(--color-button);
    }
  }
  
  .dropdown-trigger {
    @include flex-center;
    gap: var(--spacing-xs);
  }
}

.search-box {
  flex: 1;
  max-width: 400px;
  
  .search-input {
    width: 100%;
  }
  
  .search-icon {
    cursor: pointer;
    color: var(--color-text-muted);
    
    &:hover {
      color: var(--color-button);
    }
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.cart-icon {
  cursor: pointer;
  color: var(--color-text-primary);
  transition: var(--transition-normal);
  
  &:hover {
    color: var(--color-button);
  }
}

.user-avatar {
  @include flex-center;
  gap: var(--spacing-sm);
  cursor: pointer;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
  
  .username {
    color: var(--color-text-primary);
    font-weight: 500;
  }
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.mobile-menu-btn {
  cursor: pointer;
  color: var(--color-text-primary);
  
  &:hover {
    color: var(--color-button);
  }
}

// 移动端菜单样式
.mobile-menu {
  padding: var(--spacing-md);
}

.mobile-nav {
  margin-bottom: var(--spacing-xl);
  
  .mobile-nav-item {
    display: block;
    padding: var(--spacing-md);
    color: var(--color-text-primary);
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-sm);
    transition: var(--transition-normal);
    
    &:hover,
    &.router-link-active {
      background-color: var(--color-bg-hover);
      color: var(--color-button);
    }
  }
}

.mobile-category {
  margin-top: var(--spacing-lg);
  
  .category-title {
    font-weight: bold;
    color: var(--color-text-title);
    margin-bottom: var(--spacing-md);
  }
  
  .category-item {
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-xs);
    
    &:hover {
      background-color: var(--color-bg-hover);
      color: var(--color-button);
    }
  }
}

.mobile-user {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-lg);
  
  .user-info {
    @include flex-center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    
    .username {
      font-weight: bold;
      color: var(--color-text-title);
    }
  }
  
  .action-item {
    padding: var(--spacing-md);
    color: var(--color-text-primary);
    cursor: pointer;
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-sm);
    
    &:hover {
      background-color: var(--color-bg-hover);
      color: var(--color-button);
    }
    
    &.logout {
      color: var(--color-danger);
      
      &:hover {
        background-color: rgba(245, 108, 108, 0.1);
      }
    }
  }
}

.mobile-auth {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-lg);
}

// 响应式
@include mobile {
  .app-header {
    height: 60px;
  }
  
  .header-content {
    height: 60px;
    gap: var(--spacing-sm);
  }
  
  .logo .logo-text {
    font-size: var(--font-size-lg);
  }
  
  .search-box {
    max-width: 200px;
  }
}
</style>
