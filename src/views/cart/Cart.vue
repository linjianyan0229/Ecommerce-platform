<template>
  <div class="cart-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">购物车</h1>
        <div class="cart-count">共 {{ cartStore.totalCount }} 件商品</div>
      </div>
      
      <!-- 购物车内容 -->
      <div v-if="!cartStore.isEmpty" class="cart-content">
        <!-- 购物车列表 -->
        <div class="cart-list">
          <div class="cart-header">
            <el-checkbox
              v-model="allSelected"
              :indeterminate="isIndeterminate"
              @change="handleSelectAll"
            >
              全选
            </el-checkbox>
            <span class="header-title">商品信息</span>
            <span class="header-price">单价</span>
            <span class="header-quantity">数量</span>
            <span class="header-total">小计</span>
            <span class="header-action">操作</span>
          </div>
          
          <div class="cart-items">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-item"
            >
              <div class="item-select">
                <el-checkbox
                  v-model="item.selected"
                  @change="handleItemSelect"
                />
              </div>
              
              <div class="item-info">
                <img :src="item.image" :alt="item.name" class="item-image" />
                <div class="item-details">
                  <h3 class="item-name">{{ item.name }}</h3>
                  <p class="item-desc">自然健康，品质保证</p>
                </div>
              </div>
              
              <div class="item-price">
                {{ formatPrice(item.price) }}
              </div>
              
              <div class="item-quantity">
                <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  :max="99"
                  @change="(value) => handleQuantityChange(item.id, value)"
                />
              </div>
              
              <div class="item-total">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
              
              <div class="item-actions">
                <el-button text @click="handleRemoveItem(item.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 结算区域 -->
        <div class="checkout-section">
          <div class="checkout-card">
            <div class="checkout-summary">
              <div class="summary-item">
                <span>已选商品：</span>
                <span class="highlight">{{ selectedCount }} 件</span>
              </div>
              <div class="summary-item">
                <span>商品总价：</span>
                <span class="highlight">{{ formatPrice(selectedTotalPrice) }}</span>
              </div>
              <div class="summary-item">
                <span>运费：</span>
                <span class="highlight">{{ formatPrice(shippingFee) }}</span>
              </div>
              <div class="summary-total">
                <span>合计：</span>
                <span class="total-price">{{ formatPrice(finalTotalPrice) }}</span>
              </div>
            </div>
            
            <div class="checkout-actions">
              <el-button
                type="primary"
                size="large"
                :disabled="selectedCount === 0"
                @click="handleCheckout"
              >
                去结算 ({{ selectedCount }})
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空购物车 -->
      <div v-else class="empty-cart">
        <el-empty description="购物车是空的">
          <el-button type="primary" @click="$router.push('/products')">
            去购物
          </el-button>
        </el-empty>
      </div>
      
      <!-- 推荐商品 -->
      <div v-if="!cartStore.isEmpty" class="recommend-section">
        <h2 class="section-title">为您推荐</h2>
        <div class="recommend-products">
          <ProductCard
            v-for="product in recommendProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatPrice } from '@/utils'
import { mockProducts } from '@/utils/mock'
import ProductCard from '@/components/product/ProductCard.vue'

const router = useRouter()
const cartStore = useCartStore()

// 响应式数据
const recommendProducts = ref(mockProducts.slice(0, 4))

// 计算属性
const allSelected = computed({
  get: () => {
    return cartStore.items.length > 0 && cartStore.items.every(item => item.selected)
  },
  set: (value) => {
    cartStore.toggleAllSelection(value)
  }
})

const isIndeterminate = computed(() => {
  const selectedItems = cartStore.items.filter(item => item.selected)
  return selectedItems.length > 0 && selectedItems.length < cartStore.items.length
})

const selectedCount = computed(() => cartStore.getSelectedCount())
const selectedTotalPrice = computed(() => cartStore.getSelectedTotalPrice())

const shippingFee = computed(() => {
  return selectedTotalPrice.value >= 99 ? 0 : 10
})

const finalTotalPrice = computed(() => {
  return selectedTotalPrice.value + shippingFee.value
})

// 方法
const handleSelectAll = (value) => {
  cartStore.toggleAllSelection(value)
}

const handleItemSelect = () => {
  // 选中状态已经通过 v-model 更新
}

const handleQuantityChange = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity)
}

const handleRemoveItem = async (productId) => {
  try {
    await ElMessageBox.confirm('确定要删除这件商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    cartStore.removeFromCart(productId)
    ElMessage.success('商品已删除')
  } catch (error) {
    // 用户取消删除
  }
}

const handleCheckout = () => {
  if (selectedCount.value === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  
  router.push('/checkout')
}

onMounted(() => {
  // 初始化购物车数据
  cartStore.init()
})
</script>

<style scoped lang="scss">
.cart-page {
  padding: var(--spacing-lg) 0;
  min-height: calc(100vh - 200px);
}

.page-header {
  @include flex-between;
  margin-bottom: var(--spacing-xl);
  
  .page-title {
    color: var(--color-text-title);
    font-size: var(--font-size-title);
    margin: 0;
  }
  
  .cart-count {
    color: var(--color-text-secondary);
  }
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-xl);
}

.cart-list {
  @include card-style;
  
  .cart-header {
    display: grid;
    grid-template-columns: 60px 1fr 100px 120px 100px 80px;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    font-weight: 500;
    color: var(--color-text-title);
    align-items: center;
  }
  
  .cart-items {
    .cart-item {
      display: grid;
      grid-template-columns: 60px 1fr 100px 120px 100px 80px;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--color-border);
      align-items: center;
      
      &:last-child {
        border-bottom: none;
      }
      
      .item-info {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        
        .item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: var(--border-radius-small);
        }
        
        .item-details {
          .item-name {
            color: var(--color-text-title);
            font-size: var(--font-size-md);
            margin-bottom: var(--spacing-xs);
          }
          
          .item-desc {
            color: var(--color-text-secondary);
            font-size: var(--font-size-sm);
            margin: 0;
          }
        }
      }
      
      .item-price,
      .item-total {
        color: var(--color-button);
        font-weight: 500;
      }
    }
  }
}

.checkout-section {
  .checkout-card {
    @include card-style;
    position: sticky;
    top: 100px;
    
    .checkout-summary {
      margin-bottom: var(--spacing-lg);
      
      .summary-item {
        @include flex-between;
        margin-bottom: var(--spacing-md);
        color: var(--color-text-secondary);
        
        .highlight {
          color: var(--color-text-primary);
          font-weight: 500;
        }
      }
      
      .summary-total {
        @include flex-between;
        padding-top: var(--spacing-md);
        border-top: 1px solid var(--color-border);
        font-size: var(--font-size-lg);
        font-weight: bold;
        
        .total-price {
          color: var(--color-button);
          font-size: var(--font-size-xl);
        }
      }
    }
    
    .checkout-actions {
      .el-button {
        width: 100%;
        height: 48px;
        font-size: var(--font-size-md);
      }
    }
  }
}

.empty-cart {
  text-align: center;
  padding: var(--spacing-xxl);
}

.recommend-section {
  margin-top: var(--spacing-xxl);
  
  .section-title {
    color: var(--color-text-title);
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }
  
  .recommend-products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }
}

// 响应式
@include tablet {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-header,
  .cart-item {
    grid-template-columns: 40px 1fr 80px 100px 80px 60px !important;
    font-size: var(--font-size-sm);
  }
  
  .recommend-products {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@include mobile {
  .cart-header {
    display: none !important;
  }
  
  .cart-item {
    display: flex !important;
    flex-direction: column;
    gap: var(--spacing-md) !important;
    
    .item-info {
      order: 1;
    }
    
    .item-select {
      order: 2;
      align-self: flex-start;
    }
    
    .item-quantity {
      order: 3;
      align-self: flex-start;
    }
    
    .item-price,
    .item-total {
      order: 4;
      align-self: flex-start;
    }
    
    .item-actions {
      order: 5;
      align-self: flex-start;
    }
  }
  
  .recommend-products {
    grid-template-columns: 1fr !important;
  }
}
</style>
