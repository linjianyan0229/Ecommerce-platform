<template>
  <el-dialog
    v-model="visible"
    title="商品快速查看"
    width="800px"
    :before-close="handleClose"
  >
    <div v-if="product" class="quick-view-content">
      <div class="product-images">
        <img v-lazy="product.image" :alt="product.name" />
      </div>
      
      <div class="product-details">
        <h2 class="product-name">{{ product.name }}</h2>
        <p class="product-desc">{{ product.description }}</p>
        
        <div class="product-meta">
          <div class="rating">
            <el-rate
              v-model="product.rating"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            />
            <span class="reviews">({{ product.reviews }}评价)</span>
          </div>
          <div class="sales">已售 {{ product.sales }}</div>
        </div>
        
        <div class="product-price">
          <span class="current-price">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>
        
        <div class="product-tags">
          <el-tag
            v-for="tag in product.tags"
            :key="tag"
            type="success"
            effect="plain"
          >
            {{ tag }}
          </el-tag>
        </div>
        
        <div class="quantity-selector">
          <span class="label">数量：</span>
          <el-input-number
            v-model="quantity"
            :min="1"
            :max="product.stock"
            size="large"
          />
          <span class="stock">库存：{{ product.stock }}件</span>
        </div>
        
        <div class="action-buttons">
          <el-button size="large" @click="handleAddToCart">
            <el-icon><ShoppingCart /></el-icon>
            加入购物车
          </el-button>
          <el-button type="primary" size="large" @click="handleBuyNow">
            立即购买
          </el-button>
        </div>
      </div>
    </div>
    
    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleViewDetail">查看详情</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'
import { formatPrice } from '@/utils'
import { ShoppingCart } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const cartStore = useCartStore()

const quantity = ref(1)

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  visible.value = false
  quantity.value = 1
}

const handleAddToCart = () => {
  if (props.product) {
    cartStore.addToCart(props.product, quantity.value)
    ElMessage.success(`已添加 ${quantity.value} 件商品到购物车`)
  }
}

const handleBuyNow = () => {
  if (props.product) {
    cartStore.addToCart(props.product, quantity.value)
    router.push('/cart')
    handleClose()
  }
}

const handleViewDetail = () => {
  if (props.product) {
    router.push(`/product/${props.product.id}`)
    handleClose()
  }
}
</script>

<style scoped lang="scss">
.quick-view-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.product-images {
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: var(--border-radius-medium);
  }
}

.product-details {
  .product-name {
    color: var(--color-text-title);
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
  }
  
  .product-desc {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
    line-height: var(--line-height-loose);
  }
  
  .product-meta {
    @include flex-between;
    margin-bottom: var(--spacing-lg);
    
    .rating {
      @include flex-center;
      gap: var(--spacing-sm);
      
      .reviews {
        color: var(--color-text-muted);
      }
    }
    
    .sales {
      color: var(--color-text-muted);
    }
  }
  
  .product-price {
    margin-bottom: var(--spacing-lg);
    
    .current-price {
      color: var(--color-button);
      font-size: var(--font-size-xxl);
      font-weight: bold;
    }
    
    .original-price {
      color: var(--color-text-muted);
      font-size: var(--font-size-lg);
      text-decoration: line-through;
      margin-left: var(--spacing-md);
    }
  }
  
  .product-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-bottom: var(--spacing-lg);
  }
  
  .quantity-selector {
    @include flex-center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    
    .label {
      color: var(--color-text-primary);
      font-weight: 500;
    }
    
    .stock {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }
  }
  
  .action-buttons {
    display: flex;
    gap: var(--spacing-md);
    
    .el-button {
      flex: 1;
      height: 48px;
    }
  }
}

@include mobile {
  .quick-view-content {
    grid-template-columns: 1fr;
  }
  
  .quantity-selector {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
