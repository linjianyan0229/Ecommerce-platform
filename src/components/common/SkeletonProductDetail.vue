<template>
  <div class="skeleton-product-detail">
    <div class="container">
      <div class="skeleton-detail-content">
        <!-- 商品图片区域骨架 -->
        <div class="skeleton-images">
          <div class="skeleton-main-image">
            <div class="skeleton-shimmer"></div>
          </div>
          <div class="skeleton-thumbnails">
            <div v-for="n in 4" :key="n" class="skeleton-thumbnail">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
        </div>
        
        <!-- 商品信息区域骨架 -->
        <div class="skeleton-info">
          <!-- 商品标题 -->
          <div class="skeleton-title">
            <div class="skeleton-shimmer"></div>
          </div>
          
          <!-- 商品描述 -->
          <div class="skeleton-desc">
            <div class="skeleton-shimmer"></div>
          </div>
          <div class="skeleton-desc short">
            <div class="skeleton-shimmer"></div>
          </div>
          
          <!-- 评分和销量 -->
          <div class="skeleton-meta">
            <div class="skeleton-rating">
              <div class="skeleton-shimmer"></div>
            </div>
            <div class="skeleton-sales">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
          
          <!-- 价格 -->
          <div class="skeleton-price-section">
            <div class="skeleton-current-price">
              <div class="skeleton-shimmer"></div>
            </div>
            <div class="skeleton-original-price">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
          
          <!-- 规格选择 -->
          <div class="skeleton-specs">
            <div class="skeleton-spec-title">
              <div class="skeleton-shimmer"></div>
            </div>
            <div class="skeleton-spec-options">
              <div v-for="n in 3" :key="n" class="skeleton-spec-option">
                <div class="skeleton-shimmer"></div>
              </div>
            </div>
          </div>
          
          <!-- 数量选择 -->
          <div class="skeleton-quantity">
            <div class="skeleton-quantity-label">
              <div class="skeleton-shimmer"></div>
            </div>
            <div class="skeleton-quantity-input">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="skeleton-actions">
            <div class="skeleton-btn">
              <div class="skeleton-shimmer"></div>
            </div>
            <div class="skeleton-btn primary">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 商品详情标签页骨架 -->
      <div class="skeleton-tabs">
        <div class="skeleton-tab-headers">
          <div v-for="n in 3" :key="n" class="skeleton-tab-header">
            <div class="skeleton-shimmer"></div>
          </div>
        </div>
        <div class="skeleton-tab-content">
          <div v-for="n in 5" :key="n" class="skeleton-content-line">
            <div class="skeleton-shimmer"></div>
          </div>
          <div class="skeleton-content-line short">
            <div class="skeleton-shimmer"></div>
          </div>
        </div>
      </div>
      
      <!-- 推荐商品骨架 -->
      <div class="skeleton-recommendations">
        <div class="skeleton-section-title">
          <div class="skeleton-shimmer"></div>
        </div>
        <div class="skeleton-recommend-grid">
          <SkeletonCard v-for="n in 4" :key="n" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonCard from './SkeletonCard.vue'
</script>

<style scoped lang="scss">
.skeleton-product-detail {
  padding: var(--spacing-lg) 0;
}

.skeleton-detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.skeleton-images {
  .skeleton-main-image {
    width: 100%;
    height: 400px;
    background: var(--color-bg-secondary);
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-md);
    position: relative;
    overflow: hidden;
  }
  
  .skeleton-thumbnails {
    display: flex;
    gap: var(--spacing-sm);
    
    .skeleton-thumbnail {
      width: 80px;
      height: 80px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      position: relative;
      overflow: hidden;
    }
  }
}

.skeleton-info {
  .skeleton-title {
    height: 32px;
    background: var(--color-bg-secondary);
    border-radius: var(--border-radius-small);
    margin-bottom: var(--spacing-md);
    position: relative;
    overflow: hidden;
  }
  
  .skeleton-desc {
    height: 16px;
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
    gap: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
    
    .skeleton-rating {
      width: 150px;
      height: 20px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      position: relative;
      overflow: hidden;
    }
    
    .skeleton-sales {
      width: 80px;
      height: 20px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      position: relative;
      overflow: hidden;
    }
  }
  
  .skeleton-price-section {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    
    .skeleton-current-price {
      width: 120px;
      height: 36px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      position: relative;
      overflow: hidden;
    }
    
    .skeleton-original-price {
      width: 80px;
      height: 24px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      position: relative;
      overflow: hidden;
    }
  }
  
  .skeleton-specs {
    margin-bottom: var(--spacing-lg);
    
    .skeleton-spec-title {
      width: 60px;
      height: 20px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      margin-bottom: var(--spacing-sm);
      position: relative;
      overflow: hidden;
    }
    
    .skeleton-spec-options {
      display: flex;
      gap: var(--spacing-sm);
      
      .skeleton-spec-option {
        width: 60px;
        height: 32px;
        background: var(--color-bg-secondary);
        border-radius: var(--border-radius-small);
        position: relative;
        overflow: hidden;
      }
    }
  }
  
  .skeleton-quantity {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    
    .skeleton-quantity-label {
      width: 40px;
      height: 20px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      position: relative;
      overflow: hidden;
    }
    
    .skeleton-quantity-input {
      width: 120px;
      height: 40px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      position: relative;
      overflow: hidden;
    }
  }
  
  .skeleton-actions {
    display: flex;
    gap: var(--spacing-md);
    
    .skeleton-btn {
      height: 48px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-medium);
      position: relative;
      overflow: hidden;
      flex: 1;
      
      &.primary {
        background: var(--color-primary-light);
      }
    }
  }
}

.skeleton-tabs {
  margin-bottom: var(--spacing-xl);
  
  .skeleton-tab-headers {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: var(--spacing-md);
    
    .skeleton-tab-header {
      width: 80px;
      height: 24px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      position: relative;
      overflow: hidden;
    }
  }
  
  .skeleton-tab-content {
    .skeleton-content-line {
      height: 16px;
      background: var(--color-bg-secondary);
      border-radius: var(--border-radius-small);
      margin-bottom: var(--spacing-sm);
      position: relative;
      overflow: hidden;
      
      &.short {
        width: 60%;
      }
    }
  }
}

.skeleton-recommendations {
  .skeleton-section-title {
    width: 120px;
    height: 28px;
    background: var(--color-bg-secondary);
    border-radius: var(--border-radius-small);
    margin-bottom: var(--spacing-lg);
    position: relative;
    overflow: hidden;
  }
  
  .skeleton-recommend-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-lg);
  }
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
  .skeleton-detail-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .skeleton-recommend-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include mobile {
  .skeleton-product-detail {
    padding: var(--spacing-md) 0;
  }
  
  .skeleton-images {
    .skeleton-main-image {
      height: 250px;
    }
    
    .skeleton-thumbnails {
      .skeleton-thumbnail {
        width: 60px;
        height: 60px;
      }
    }
  }
  
  .skeleton-recommend-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
  
  .skeleton-actions {
    flex-direction: column;
  }
}
</style>
