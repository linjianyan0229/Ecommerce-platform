<template>
  <div class="skeleton-card">
    <!-- 图片骨架 -->
    <div class="skeleton-image">
      <div class="skeleton-shimmer"></div>
    </div>
    
    <!-- 内容骨架 -->
    <div class="skeleton-content">
      <!-- 标题骨架 -->
      <div class="skeleton-title">
        <div class="skeleton-shimmer"></div>
      </div>
      
      <!-- 描述骨架 -->
      <div class="skeleton-desc">
        <div class="skeleton-shimmer"></div>
      </div>
      <div class="skeleton-desc short">
        <div class="skeleton-shimmer"></div>
      </div>
      
      <!-- 评分和销量骨架 -->
      <div class="skeleton-meta">
        <div class="skeleton-rating">
          <div class="skeleton-shimmer"></div>
        </div>
        <div class="skeleton-sales">
          <div class="skeleton-shimmer"></div>
        </div>
      </div>
      
      <!-- 价格骨架 -->
      <div class="skeleton-price">
        <div class="skeleton-shimmer"></div>
      </div>
      
      <!-- 标签骨架 -->
      <div class="skeleton-tags">
        <div class="skeleton-tag">
          <div class="skeleton-shimmer"></div>
        </div>
        <div class="skeleton-tag">
          <div class="skeleton-shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 商品卡片骨架屏组件
</script>

<style scoped lang="scss">
.skeleton-card {
  @include card-style;
  overflow: hidden;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  margin-bottom: var(--spacing-md);
  position: relative;
  overflow: hidden;
}

.skeleton-content {
  padding: var(--spacing-sm);
}

.skeleton-title {
  height: 20px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  margin-bottom: var(--spacing-sm);
  position: relative;
  overflow: hidden;
}

.skeleton-desc {
  height: 14px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  margin-bottom: var(--spacing-xs);
  position: relative;
  overflow: hidden;
  
  &.short {
    width: 70%;
  }
}

.skeleton-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.skeleton-rating {
  width: 120px;
  height: 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  position: relative;
  overflow: hidden;
}

.skeleton-sales {
  width: 60px;
  height: 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  position: relative;
  overflow: hidden;
}

.skeleton-price {
  height: 24px;
  width: 100px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  margin-bottom: var(--spacing-sm);
  position: relative;
  overflow: hidden;
}

.skeleton-tags {
  display: flex;
  gap: var(--spacing-xs);
}

.skeleton-tag {
  width: 50px;
  height: 20px;
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-small);
  position: relative;
  overflow: hidden;
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

@keyframes skeleton-loading {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

// 响应式设计
@include mobile {
  .skeleton-image {
    height: 150px;
  }
  
  .skeleton-content {
    padding: var(--spacing-xs);
  }
}
</style>
