<template>
  <transition name="fade">
    <div
      v-show="visible"
      class="back-to-top"
      @click="scrollToTop"
    >
      <el-icon size="20">
        <ArrowUp />
      </el-icon>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'

const visible = ref(false)

const handleScroll = () => {
  visible.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  @include flex-center;
  background-color: var(--color-button);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-medium);
  transition: var(--transition-normal);
  z-index: 999;
  
  &:hover {
    background-color: var(--color-button-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-heavy);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@include mobile {
  .back-to-top {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
}
</style>
