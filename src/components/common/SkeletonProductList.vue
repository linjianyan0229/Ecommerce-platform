<template>
  <div class="skeleton-product-list">
    <!-- 筛选栏骨架 -->
    <div class="skeleton-filters">
      <div class="skeleton-filter-item">
        <div class="skeleton-shimmer"></div>
      </div>
      <div class="skeleton-filter-item">
        <div class="skeleton-shimmer"></div>
      </div>
      <div class="skeleton-filter-item">
        <div class="skeleton-shimmer"></div>
      </div>
      <div class="skeleton-filter-item">
        <div class="skeleton-shimmer"></div>
      </div>
    </div>
    
    <!-- 排序栏骨架 -->
    <div class="skeleton-sort-bar">
      <div class="skeleton-sort-item">
        <div class="skeleton-shimmer"></div>
      </div>
      <div class="skeleton-sort-item">
        <div class="skeleton-shimmer"></div>
      </div>
      <div class="skeleton-sort-item">
        <div class="skeleton-shimmer"></div>
      </div>
      <div class="skeleton-view-toggle">
        <div class="skeleton-shimmer"></div>
      </div>
    </div>
    
    <!-- 商品网格骨架 -->
    <div class="skeleton-products-grid">
      <SkeletonCard v-for="n in count" :key="n" />
    </div>
  </div>
</template>

<script setup>
import SkeletonCard from './SkeletonCard.vue'

// Props
const props = defineProps({
  count: {
    type: Number,
    default: 12
  }
})
</script>

<style scoped lang="scss">
.skeleton-product-list {
  padding: var(--spacing-lg);
}

.skeleton-filters {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border);
}

.skeleton-filter-item {
  height: 32px;
  width: 120px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  position: relative;
  overflow: hidden;
}

.skeleton-sort-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--color-border);
}

.skeleton-sort-item {
  height: 28px;
  width: 80px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  position: relative;
  overflow: hidden;
}

.skeleton-view-toggle {
  height: 32px;
  width: 80px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  position: relative;
  overflow: hidden;
}

.skeleton-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

// 响应式设计
@include tablet {
  .skeleton-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--spacing-md);
  }
  
  .skeleton-filters {
    flex-wrap: wrap;
  }
}

@include mobile {
  .skeleton-product-list {
    padding: var(--spacing-md);
  }
  
  .skeleton-products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--spacing-sm);
  }
  
  .skeleton-filters {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .skeleton-filter-item {
    width: 100%;
  }
  
  .skeleton-sort-bar {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: stretch;
  }
  
  .skeleton-sort-item,
  .skeleton-view-toggle {
    width: 100%;
  }
}
</style>
