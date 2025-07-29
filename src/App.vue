<template>
  <div id="app">
    <!-- 主布局 -->
    <AppLayout v-if="!isAdminRoute" />
    <!-- 管理后台布局 -->
    <router-view v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()

// 判断是否为管理后台路由
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background-color: var(--color-bg-primary);
}
</style>
