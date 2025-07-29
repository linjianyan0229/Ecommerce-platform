<template>
  <div class="order-detail-page">
    <div class="container">
      <div class="page-header">
        <el-button @click="$router.back()" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1 class="page-title">订单详情</h1>
      </div>
      
      <div v-if="order" class="order-detail">
        <!-- 订单状态 -->
        <div class="order-status-card">
          <div class="status-info">
            <el-icon size="48" :color="getStatusColor(order.status)">
              <component :is="getStatusIcon(order.status)" />
            </el-icon>
            <div class="status-text">
              <h2>{{ order.statusText }}</h2>
              <p>订单号：{{ order.id }}</p>
            </div>
          </div>
          <div class="status-time">
            <p>下单时间：{{ formatDate(order.createTime) }}</p>
          </div>
        </div>
        
        <!-- 收货地址 -->
        <div class="address-card">
          <h3>收货地址</h3>
          <div class="address-info">
            <div class="address-header">
              <span class="name">{{ order.address.name }}</span>
              <span class="phone">{{ order.address.phone }}</span>
            </div>
            <div class="address-detail">
              {{ order.address.province }} {{ order.address.city }} {{ order.address.district }} {{ order.address.detail }}
            </div>
          </div>
        </div>
        
        <!-- 商品信息 -->
        <div class="products-card">
          <h3>商品信息</h3>
          <div class="products-list">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="product-item"
              @click="$router.push(`/product/${item.id}`)"
            >
              <img :src="item.image" :alt="item.name" class="product-image" />
              <div class="product-info">
                <h4 class="product-name">{{ item.name }}</h4>
                <div class="product-meta">
                  <span class="price">{{ formatPrice(item.price) }}</span>
                  <span class="quantity">x{{ item.quantity }}</span>
                  <span class="total">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 订单金额 -->
        <div class="amount-card">
          <h3>订单金额</h3>
          <div class="amount-details">
            <div class="amount-item">
              <span>商品总价：</span>
              <span>{{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="amount-item">
              <span>运费：</span>
              <span>{{ formatPrice(order.shippingFee) }}</span>
            </div>
            <div class="amount-item discount">
              <span>优惠：</span>
              <span>-{{ formatPrice(order.discount) }}</span>
            </div>
            <div class="amount-total">
              <span>实付金额：</span>
              <span class="total-price">{{ formatPrice(order.totalAmount) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 订单操作 -->
        <div class="actions-card">
          <div class="action-buttons">
            <el-button
              v-if="order.status === 'pending'"
              type="primary"
              @click="handlePayOrder"
            >
              立即付款
            </el-button>
            <el-button
              v-if="order.status === 'pending'"
              @click="handleCancelOrder"
            >
              取消订单
            </el-button>
            <el-button
              v-if="order.status === 'shipped'"
              type="primary"
              @click="handleConfirmOrder"
            >
              确认收货
            </el-button>
            <el-button
              v-if="order.status === 'completed'"
              @click="handleReviewOrder"
            >
              评价商品
            </el-button>
            <el-button
              v-if="order.status === 'shipped' || order.status === 'completed'"
              @click="handleViewLogistics"
            >
              查看物流
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-else-if="loading" class="loading-state">
        <el-skeleton :rows="8" animated />
      </div>
      
      <!-- 错误状态 -->
      <div v-else class="error-state">
        <el-empty description="订单不存在或已被删除">
          <el-button type="primary" @click="$router.push('/orders')">
            返回订单列表
          </el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatPrice, formatDate } from '@/utils'
import { 
  ArrowLeft, 
  Clock, 
  Checked, 
  Truck, 
  CircleCheck, 
  CircleClose 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const order = ref(null)

// 模拟订单详情数据
const mockOrderDetail = {
  id: 'ORD20240101001',
  status: 'shipped',
  statusText: '已发货',
  createTime: '2024-01-01 10:30:00',
  subtotal: 477.00,
  shippingFee: 10.00,
  discount: 0.00,
  totalAmount: 487.00,
  address: {
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '三里屯街道1号'
  },
  items: [
    {
      id: 1,
      name: '自然有机棉T恤',
      price: 89.00,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'
    },
    {
      id: 4,
      name: '天然护肤套装',
      price: 299.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop'
    }
  ]
}

// 方法
const fetchOrderDetail = async (orderId) => {
  loading.value = true
  
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟获取订单详情
    if (orderId === 'ORD20240101001') {
      order.value = mockOrderDetail
    } else {
      order.value = null
    }
  } catch (error) {
    ElMessage.error('获取订单详情失败')
    order.value = null
  } finally {
    loading.value = false
  }
}

const getStatusIcon = (status) => {
  const iconMap = {
    pending: Clock,
    paid: Checked,
    shipped: Truck,
    completed: CircleCheck,
    cancelled: CircleClose
  }
  return iconMap[status] || Clock
}

const getStatusColor = (status) => {
  const colorMap = {
    pending: '#e6a23c',
    paid: '#409eff',
    shipped: '#67c23a',
    completed: '#67c23a',
    cancelled: '#f56c6c'
  }
  return colorMap[status] || '#909399'
}

const handlePayOrder = () => {
  ElMessage.info('跳转到支付页面...')
}

const handleCancelOrder = async () => {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('订单已取消')
    router.push('/orders')
  } catch (error) {
    // 用户取消
  }
}

const handleConfirmOrder = async () => {
  try {
    await ElMessageBox.confirm('确认已收到商品？', '提示', {
      confirmButtonText: '确认收货',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    ElMessage.success('确认收货成功')
    order.value.status = 'completed'
    order.value.statusText = '已完成'
  } catch (error) {
    // 用户取消
  }
}

const handleReviewOrder = () => {
  ElMessage.info('评价功能开发中...')
}

const handleViewLogistics = () => {
  ElMessage.info('物流查询功能开发中...')
}

onMounted(() => {
  const orderId = route.params.id
  if (orderId) {
    fetchOrderDetail(orderId)
  }
})
</script>

<style scoped lang="scss">
.order-detail-page {
  padding: var(--spacing-lg) 0;
  min-height: calc(100vh - 200px);
}

.page-header {
  @include flex-center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  
  .back-btn {
    flex-shrink: 0;
  }
  
  .page-title {
    color: var(--color-text-title);
    font-size: var(--font-size-title);
    margin: 0;
  }
}

.order-detail > div {
  @include card-style;
  margin-bottom: var(--spacing-lg);
  
  h3 {
    color: var(--color-text-title);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border);
  }
}

.order-status-card {
  @include flex-between;
  
  .status-info {
    @include flex-center;
    gap: var(--spacing-lg);
    
    .status-text {
      h2 {
        color: var(--color-text-title);
        margin-bottom: var(--spacing-xs);
      }
      
      p {
        color: var(--color-text-secondary);
        margin: 0;
      }
    }
  }
  
  .status-time {
    text-align: right;
    color: var(--color-text-secondary);
    
    p {
      margin: 0;
    }
  }
}

.address-info {
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

.products-list {
  .product-item {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-md);
    cursor: pointer;
    transition: var(--transition-normal);
    
    &:hover {
      border-color: var(--color-button);
      background-color: var(--color-bg-hover);
    }
    
    &:last-child {
      margin-bottom: 0;
    }
    
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

.amount-details {
  .amount-item {
    @include flex-between;
    margin-bottom: var(--spacing-md);
    color: var(--color-text-secondary);
    
    &.discount {
      color: var(--color-success);
    }
  }
  
  .amount-total {
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

.actions-card {
  .action-buttons {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    flex-wrap: wrap;
  }
}

.loading-state,
.error-state {
  @include card-style;
  text-align: center;
  padding: var(--spacing-xxl);
}

// 响应式
@include mobile {
  .page-header {
    flex-direction: column;
    text-align: center;
  }
  
  .order-status-card {
    flex-direction: column;
    gap: var(--spacing-lg);
    text-align: center;
  }
  
  .product-item {
    flex-direction: column !important;
    text-align: center;
    
    .product-image {
      align-self: center;
    }
  }
  
  .action-buttons {
    flex-direction: column !important;
  }
}
</style>
