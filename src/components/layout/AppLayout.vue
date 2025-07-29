<template>
  <div class="app-layout">
    <!-- 顶部导航 -->
    <AppHeader />
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 底部 -->
    <AppFooter />
    
    <!-- 回到顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import BackToTop from '@/components/common/BackToTop.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* 为固定头部留出空间 */
  min-height: calc(100vh - 200px);
}

@media (max-width: 767px) {
  .main-content {
    padding-top: 60px;
  }
}
</style>
