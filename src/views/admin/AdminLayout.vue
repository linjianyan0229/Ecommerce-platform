<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <div class="admin-sidebar">
      <div class="sidebar-header">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center" alt="自然商城" />
        <h2>管理后台</h2>
      </div>
      
      <el-menu
        :default-active="$route.path"
        router
        class="admin-menu"
      >
        <el-menu-item index="/admin">
          <el-icon><Odometer /></el-icon>
          <span>数据概览</span>
        </el-menu-item>
        <el-menu-item index="/admin/products">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/orders">
          <el-icon><Document /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="admin-main">
      <!-- 顶部导航 -->
      <div class="admin-header">
        <div class="header-left">
          <el-button class="menu-toggle" @click="toggleSidebar">
            <el-icon><Menu /></el-icon>
          </el-button>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">管理后台</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-button @click="$router.push('/')">
            <el-icon><House /></el-icon>
            返回前台
          </el-button>
          
          <el-dropdown @command="handleUserCommand">
            <div class="user-info">
              <img :src="userInfo.avatar || defaultAvatar" :alt="userInfo.username" />
              <span>{{ userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 页面内容 -->
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Odometer, Goods, Document, User, Menu, House } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const userInfo = computed(() => userStore.userInfo)

// 默认头像
const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'

// 方法
const toggleSidebar = () => {
  // 切换侧边栏显示/隐藏
  console.log('切换侧边栏')
}

const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      userStore.logout()
      router.push('/')
      break
  }
}
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  height: 100vh;
  background-color: var(--color-bg-primary);
}

.admin-sidebar {
  width: 250px;
  background-color: var(--color-bg-card);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  
  .sidebar-header {
    @include flex-center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    h2 {
      color: var(--color-text-title);
      margin: 0;
      font-size: var(--font-size-lg);
    }
  }
  
  .admin-menu {
    flex: 1;
    border: none;
    
    .el-menu-item {
      height: 50px;
      line-height: 50px;
      
      &:hover,
      &.is-active {
        background-color: var(--color-bg-hover);
        color: var(--color-button);
      }
    }
  }
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  @include flex-between;
  height: 60px;
  padding: 0 var(--spacing-lg);
  background-color: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  
  .header-left {
    @include flex-center;
    gap: var(--spacing-lg);
    
    .menu-toggle {
      display: none;
    }
  }
  
  .header-right {
    @include flex-center;
    gap: var(--spacing-lg);
    
    .user-info {
      @include flex-center;
      gap: var(--spacing-sm);
      cursor: pointer;
      
      img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      
      span {
        color: var(--color-text-primary);
        font-weight: 500;
      }
    }
  }
}

.admin-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
  background-color: var(--color-bg-primary);
}

// 响应式
@include tablet {
  .admin-sidebar {
    width: 200px;
  }
}

@include mobile {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    height: auto;
    order: 2;
    
    .sidebar-header {
      display: none;
    }
    
    .admin-menu {
      display: flex;
      overflow-x: auto;
      
      .el-menu-item {
        white-space: nowrap;
        min-width: 120px;
      }
    }
  }
  
  .admin-main {
    order: 1;
  }
  
  .admin-header {
    .header-left .menu-toggle {
      display: block;
    }
  }
}
</style>
