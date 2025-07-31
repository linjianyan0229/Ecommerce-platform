<template>
  <div class="product-list-item" @click="handleClick">
    <div class="product-image">
      <img v-lazy="product.image" :alt="product.name" />
    </div>
    
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-desc">{{ product.description }}</p>
      
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
          <span class="reviews">({{ product.reviews }}评价)</span>
        </div>
        <div class="sales">已售 {{ product.sales }}</div>
      </div>
      
      <div class="product-tags">
        <el-tag
          v-for="tag in product.tags"
          :key="tag"
          size="small"
          type="success"
          effect="plain"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>
    
    <div class="product-actions">
      <div class="price-section">
        <span class="current-price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>
      
      <div class="action-buttons">
        <el-button @click.stop="handleFavorite">
          <el-icon><Star /></el-icon>
          收藏
        </el-button>
        <el-button type="primary" @click.stop="handleAddToCart">
          <el-icon><ShoppingCart /></el-icon>
          加入购物车
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'
import { formatPrice } from '@/utils'
import { Star, ShoppingCart } from '@element-plus/icons-vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['favorite'])

const router = useRouter()
const cartStore = useCartStore()

const handleClick = () => {
  router.push(`/product/${props.product.id}`)
}

const handleFavorite = () => {
  ElMessage.success('已添加到收藏')
  emit('favorite', props.product.id, true)
}

const handleAddToCart = () => {
  cartStore.addToCart(props.product, 1)
  ElMessage.success('已添加到购物车')
}
</script>

<style scoped lang="scss">
.product-list-item {
  @include card-style;
  display: flex;
  gap: var(--spacing-lg);
  cursor: pointer;
  transition: var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-medium);
  }
}

.product-image {
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius-small);
  }
}

.product-info {
  flex: 1;
  
  .product-name {
    color: var(--color-text-title);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-sm);
  }
  
  .product-desc {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-md);
    line-height: var(--line-height-loose);
  }
  
  .product-meta {
    @include flex-between;
    margin-bottom: var(--spacing-md);
    
    .rating {
      @include flex-center;
      gap: var(--spacing-xs);
      
      .reviews {
        color: var(--color-text-muted);
        font-size: var(--font-size-sm);
      }
    }
    
    .sales {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }
  }
  
  .product-tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
}

.product-actions {
  flex-shrink: 0;
  width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  .price-section {
    text-align: right;
    margin-bottom: var(--spacing-md);
    
    .current-price {
      color: var(--color-button);
      font-size: var(--font-size-xl);
      font-weight: bold;
      display: block;
    }
    
    .original-price {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      text-decoration: line-through;
    }
  }
  
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

@include mobile {
  .product-list-item {
    flex-direction: column;
  }
  
  .product-image {
    width: 100%;
    height: 200px;
  }
  
  .product-actions {
    width: 100%;
    
    .price-section {
      text-align: left;
    }
    
    .action-buttons {
      flex-direction: row;
    }
  }
}
</style>
