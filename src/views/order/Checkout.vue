<template>
  <div class="checkout-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">确认订单</h1>
      </div>
      
      <div class="checkout-content">
        <!-- 收货地址 -->
        <div class="address-section">
          <h2 class="section-title">收货地址</h2>
          <div class="address-list">
            <div
              v-for="address in addresses"
              :key="address.id"
              class="address-item"
              :class="{ 'is-selected': selectedAddress?.id === address.id }"
              @click="selectedAddress = address"
            >
              <div class="address-info">
                <div class="address-header">
                  <span class="name">{{ address.name }}</span>
                  <span class="phone">{{ address.phone }}</span>
                  <el-tag v-if="address.isDefault" type="success" size="small">默认</el-tag>
                </div>
                <div class="address-detail">
                  {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
                </div>
              </div>
              <el-radio
                v-model="selectedAddressId"
                :value="address.id"
                @change="selectedAddress = address"
              />
            </div>
          </div>
        </div>
        
        <!-- 商品信息 -->
        <div class="products-section">
          <h2 class="section-title">商品信息</h2>
          <div class="products-list">
            <div
              v-for="item in selectedItems"
              :key="item.id"
              class="product-item"
            >
              <img :src="item.image" :alt="item.name" class="product-image" />
              <div class="product-info">
                <h3 class="product-name">{{ item.name }}</h3>
                <div class="product-meta">
                  <span class="price">{{ formatPrice(item.price) }}</span>
                  <span class="quantity">x{{ item.quantity }}</span>
                  <span class="total">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 支付方式 -->
        <div class="payment-section">
          <h2 class="section-title">支付方式</h2>
          <el-radio-group v-model="paymentMethod" class="payment-methods">
            <el-radio value="alipay" class="payment-option">
              <div class="payment-info">
                <el-icon size="24"><CreditCard /></el-icon>
                <span>支付宝</span>
              </div>
            </el-radio>
            <el-radio value="wechat" class="payment-option">
              <div class="payment-info">
                <el-icon size="24"><ChatDotRound /></el-icon>
                <span>微信支付</span>
              </div>
            </el-radio>
            <el-radio value="bank" class="payment-option">
              <div class="payment-info">
                <el-icon size="24"><CreditCard /></el-icon>
                <span>银行卡</span>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
        
        <!-- 订单备注 -->
        <div class="note-section">
          <h2 class="section-title">订单备注</h2>
          <el-input
            v-model="orderNote"
            type="textarea"
            :rows="3"
            placeholder="请输入订单备注（选填）"
            maxlength="200"
            show-word-limit
          />
        </div>
      </div>
      
      <!-- 订单总计 -->
      <div class="order-summary">
        <div class="summary-card">
          <div class="summary-items">
            <div class="summary-item">
              <span>商品总价：</span>
              <span>{{ formatPrice(totalPrice) }}</span>
            </div>
            <div class="summary-item">
              <span>运费：</span>
              <span>{{ formatPrice(shippingFee) }}</span>
            </div>
            <div class="summary-item discount">
              <span>优惠：</span>
              <span>-{{ formatPrice(discount) }}</span>
            </div>
            <div class="summary-total">
              <span>应付金额：</span>
              <span class="total-price">{{ formatPrice(finalTotal) }}</span>
            </div>
          </div>
          
          <div class="submit-actions">
            <el-button size="large" @click="$router.back()">返回购物车</el-button>
            <el-button
              type="primary"
              size="large"
              :loading="submitting"
              @click="handleSubmitOrder"
            >
              提交订单
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'
import { formatPrice } from '@/utils'
import { CreditCard, ChatDotRound } from '@element-plus/icons-vue'

const router = useRouter()
const cartStore = useCartStore()

// 响应式数据
const selectedAddressId = ref(1)
const selectedAddress = ref(null)
const paymentMethod = ref('alipay')
const orderNote = ref('')
const submitting = ref(false)

// 模拟地址数据
const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '三里屯街道1号',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '陆家嘴金融中心',
    isDefault: false
  }
])

// 计算属性
const selectedItems = computed(() => cartStore.getSelectedItems())
const totalPrice = computed(() => cartStore.getSelectedTotalPrice())
const shippingFee = computed(() => totalPrice.value >= 99 ? 0 : 10)
const discount = computed(() => 0) // 暂时没有优惠
const finalTotal = computed(() => totalPrice.value + shippingFee.value - discount.value)

// 方法
const handleSubmitOrder = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  
  if (!paymentMethod.value) {
    ElMessage.warning('请选择支付方式')
    return
  }
  
  submitting.value = true
  
  try {
    // 模拟提交订单
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 清空选中的购物车商品
    cartStore.clearSelectedItems()
    
    ElMessage.success('订单提交成功')
    router.push('/orders')
  } catch (error) {
    ElMessage.error('订单提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // 检查是否有选中的商品
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请先选择要购买的商品')
    router.push('/cart')
    return
  }
  
  // 设置默认地址
  const defaultAddress = addresses.value.find(addr => addr.isDefault)
  if (defaultAddress) {
    selectedAddress.value = defaultAddress
    selectedAddressId.value = defaultAddress.id
  }
})
</script>

<style scoped lang="scss">
.checkout-page {
  padding: var(--spacing-lg) 0;
  min-height: calc(100vh - 200px);
}

.page-header {
  margin-bottom: var(--spacing-xl);
  
  .page-title {
    color: var(--color-text-title);
    font-size: var(--font-size-title);
    margin: 0;
  }
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-xl);
}

.section-title {
  color: var(--color-text-title);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--color-button);
}

// 地址部分
.address-section,
.products-section,
.payment-section,
.note-section {
  @include card-style;
  margin-bottom: var(--spacing-lg);
}

.address-list {
  .address-item {
    @include flex-between;
    padding: var(--spacing-lg);
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-md);
    cursor: pointer;
    transition: var(--transition-normal);
    
    &:hover,
    &.is-selected {
      border-color: var(--color-button);
      background-color: rgba(169, 195, 166, 0.05);
    }
    
    .address-info {
      flex: 1;
      
      .address-header {
        @include flex-center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        
        .name {
          font-weight: bold;
          color: var(--color-text-title);
        }
        
        .phone {
          color: var(--color-text-secondary);
        }
      }
      
      .address-detail {
        color: var(--color-text-primary);
      }
    }
  }
}

// 商品部分
.products-list {
  .product-item {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-md);
    
    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: var(--border-radius-small);
    }
    
    .product-info {
      flex: 1;
      
      .product-name {
        color: var(--color-text-title);
        margin-bottom: var(--spacing-sm);
      }
      
      .product-meta {
        @include flex-between;
        
        .price,
        .total {
          color: var(--color-button);
          font-weight: 500;
        }
        
        .quantity {
          color: var(--color-text-secondary);
        }
      }
    }
  }
}

// 支付方式
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  
  .payment-option {
    padding: var(--spacing-lg);
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    transition: var(--transition-normal);
    
    &:hover {
      border-color: var(--color-button);
    }
    
    .payment-info {
      @include flex-center;
      gap: var(--spacing-md);
    }
  }
}

// 订单总计
.order-summary {
  .summary-card {
    @include card-style;
    position: sticky;
    top: 100px;
    
    .summary-items {
      margin-bottom: var(--spacing-lg);
      
      .summary-item {
        @include flex-between;
        margin-bottom: var(--spacing-md);
        color: var(--color-text-secondary);
        
        &.discount {
          color: var(--color-success);
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
    
    .submit-actions {
      display: flex;
      gap: var(--spacing-md);
      
      .el-button {
        flex: 1;
        height: 48px;
      }
    }
  }
}

// 响应式
@include tablet {
  .checkout-content {
    grid-template-columns: 1fr;
  }
}

@include mobile {
  .address-item {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .product-item {
    flex-direction: column;
  }
  
  .submit-actions {
    flex-direction: column !important;
  }
}
</style>
