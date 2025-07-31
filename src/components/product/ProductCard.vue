<template>
  <div class="product-card" @click="handleCardClick">
    <!-- 商品图片 -->
    <div class="product-image">
      <img v-lazy="product.image" :alt="product.name" />
      
      <!-- 折扣标签 -->
      <div v-if="discountPercent > 0" class="discount-badge">
        -{{ discountPercent }}%
      </div>
      
      <!-- 收藏按钮 -->
      <div class="favorite-btn" @click.stop="handleFavorite">
        <el-icon :class="{ 'is-favorite': isFavorite }">
          <Star />
        </el-icon>
      </div>
      
      <!-- 快速操作 -->
      <div class="quick-actions">
        <el-button
          class="quick-btn"
          @click.stop="handleQuickView"
          circle
        >
          <el-icon><View /></el-icon>
        </el-button>
        <el-button
          class="quick-btn"
          @click.stop="handleAddToCart"
          circle
          type="primary"
        >
          <el-icon><ShoppingCart /></el-icon>
        </el-button>
      </div>
    </div>
    
    <!-- 商品信息 -->
    <div class="product-info">
      <!-- 商品名称 -->
      <h3 class="product-name" :title="product.name">
        {{ product.name }}
      </h3>
      
      <!-- 商品描述 -->
      <p class="product-desc">{{ product.description }}</p>
      
      <!-- 评分和销量 -->
      <div class="product-meta">
        <div class="rating">
          <el-rate
            v-model="product.rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
            size="small"
          />
          <span class="reviews">({{ product.reviews }})</span>
        </div>
        <div class="sales">已售 {{ product.sales }}</div>
      </div>
      
      <!-- 价格 -->
      <div class="product-price">
        <span class="current-price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>
      
      <!-- 标签 -->
      <div v-if="product.tags && product.tags.length" class="product-tags">
        <el-tag
          v-for="tag in product.tags.slice(0, 2)"
          :key="tag"
          size="small"
          type="success"
          effect="plain"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'
import { formatPrice } from '@/utils'
import { Star, View, ShoppingCart } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['favorite', 'quickView'])

const router = useRouter()
const cartStore = useCartStore()

// 响应式数据
const isFavorite = ref(false)

// 计算属性
const discountPercent = computed(() => {
  if (props.product.originalPrice && props.product.originalPrice > props.product.price) {
    return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
  }
  return 0
})

// 方法
const handleCardClick = () => {
  router.push(`/product/${props.product.id}`)
}

const handleFavorite = () => {
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '已添加到收藏' : '已取消收藏')
  emit('favorite', props.product.id, isFavorite.value)
}

const handleQuickView = () => {
  emit('quickView', props.product)
}

const handleAddToCart = () => {
  cartStore.addToCart(props.product, 1)
  ElMessage.success('已添加到购物车')
}
</script>

<style scoped lang="scss">
.product-card {
  @include card-style;
  cursor: pointer;
  transition: var(--transition-normal);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-medium);
    
    .quick-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.product-image {
  position: relative;
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  border-radius: var(--border-radius-small);
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: var(--transition-normal);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  .discount-badge {
    position: absolute;
    top: var(--spacing-sm);
    left: var(--spacing-sm);
    background-color: var(--color-danger);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-large);
    font-size: var(--font-size-xs);
    font-weight: bold;
  }
  
  .favorite-btn {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    width: 32px;
    height: 32px;
    @include flex-center;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition-normal);
    
    &:hover {
      background-color: white;
      transform: scale(1.1);
    }
    
    .el-icon {
      color: var(--color-text-muted);
      transition: var(--transition-normal);
      
      &.is-favorite {
        color: var(--color-danger);
      }
    }
  }
  
  .quick-actions {
    position: absolute;
    bottom: var(--spacing-sm);
    right: var(--spacing-sm);
    display: flex;
    gap: var(--spacing-xs);
    opacity: 0;
    transform: translateY(10px);
    transition: var(--transition-normal);
    
    .quick-btn {
      width: 36px;
      height: 36px;
      padding: 0;
      background-color: rgba(255, 255, 255, 0.9);
      border: none;
      
      &:hover {
        background-color: white;
        transform: scale(1.1);
      }
      
      &.el-button--primary {
        background-color: var(--color-button);
        color: white;
        
        &:hover {
          background-color: var(--color-button-hover);
        }
      }
    }
  }
}

.product-info {
  .product-name {
    color: var(--color-text-title);
    font-size: var(--font-size-md);
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
    @include text-ellipsis;
  }
  
  .product-desc {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-sm);
    @include text-ellipsis;
  }
  
  .product-meta {
    @include flex-between;
    margin-bottom: var(--spacing-sm);
    
    .rating {
      @include flex-center;
      gap: var(--spacing-xs);
      
      .reviews {
        color: var(--color-text-muted);
        font-size: var(--font-size-xs);
      }
    }
    
    .sales {
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
    }
  }
  
  .product-price {
    margin-bottom: var(--spacing-sm);
    
    .current-price {
      color: var(--color-button);
      font-size: var(--font-size-lg);
      font-weight: bold;
    }
    
    .original-price {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      text-decoration: line-through;
      margin-left: var(--spacing-sm);
    }
  }
  
  .product-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
}

// 响应式
@include mobile {
  .product-image {
    img {
      height: 180px;
    }
  }
  
  .product-info {
    .product-name {
      font-size: var(--font-size-sm);
    }
    
    .product-price .current-price {
      font-size: var(--font-size-md);
    }
  }
}
</style>
