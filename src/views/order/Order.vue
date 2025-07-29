<template>
  <div class="order-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">我的订单</h1>
      </div>
      
      <!-- 订单状态筛选 -->
      <div class="order-tabs">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="全部订单" name="all" />
          <el-tab-pane label="待付款" name="pending" />
          <el-tab-pane label="待发货" name="paid" />
          <el-tab-pane label="待收货" name="shipped" />
          <el-tab-pane label="已完成" name="completed" />
          <el-tab-pane label="已取消" name="cancelled" />
        </el-tabs>
      </div>
      
      <!-- 订单列表 -->
      <div v-loading="loading" class="order-list">
        <div
          v-for="order in orders"
          :key="order.id"
          class="order-item"
        >
          <!-- 订单头部 -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">订单号：{{ order.id }}</span>
              <span class="order-time">{{ formatDate(order.createTime) }}</span>
            </div>
            <div class="order-status">
              <el-tag :type="getStatusType(order.status)">
                {{ order.statusText }}
              </el-tag>
            </div>
          </div>
          
          <!-- 订单商品 -->
          <div class="order-products">
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
                </div>
              </div>
            </div>
          </div>
          
          <!-- 订单底部 -->
          <div class="order-footer">
            <div class="order-total">
              <span>共 {{ order.items.length }} 件商品，合计：</span>
              <span class="total-price">{{ formatPrice(order.totalAmount) }}</span>
            </div>
            
            <div class="order-actions">
              <el-button
                v-if="order.status === 'pending'"
                @click="handlePayOrder(order)"
              >
                立即付款
              </el-button>
              <el-button
                v-if="order.status === 'pending'"
                @click="handleCancelOrder(order.id)"
              >
                取消订单
              </el-button>
              <el-button
                v-if="order.status === 'shipped'"
                type="primary"
                @click="handleConfirmOrder(order.id)"
              >
                确认收货
              </el-button>
              <el-button
                v-if="order.status === 'completed'"
                @click="handleReviewOrder(order.id)"
              >
                评价
              </el-button>
              <el-button @click="$router.push(`/order/${order.id}`)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="!loading && orders.length === 0" class="empty-orders">
          <el-empty description="暂无订单">
            <el-button type="primary" @click="$router.push('/products')">
              去购物
            </el-button>
          </el-empty>
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="total > 0" class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatPrice, formatDate } from '@/utils'

const router = useRouter()

// 响应式数据
const activeTab = ref('all')
const loading = ref(false)
const orders = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟订单数据
const mockOrders = [
  {
    id: 'ORD20240101001',
    status: 'pending',
    statusText: '待付款',
    createTime: '2024-01-01 10:30:00',
    totalAmount: 299.00,
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
  },
  {
    id: 'ORD20240102002',
    status: 'shipped',
    statusText: '待收货',
    createTime: '2024-01-02 14:20:00',
    totalAmount: 156.00,
    items: [
      {
        id: 2,
        name: '竹纤维餐具套装',
        price: 156.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
      }
    ]
  },
  {
    id: 'ORD20240103003',
    status: 'completed',
    statusText: '已完成',
    createTime: '2024-01-03 09:15:00',
    totalAmount: 268.00,
    items: [
      {
        id: 3,
        name: '智能环保水杯',
        price: 268.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop'
      }
    ]
  }
]

// 方法
const fetchOrders = async () => {
  loading.value = true
  
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredOrders = [...mockOrders]
    
    // 根据状态筛选
    if (activeTab.value !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === activeTab.value)
    }
    
    total.value = filteredOrders.length
    orders.value = filteredOrders
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

const handleTabChange = (tabName) => {
  activeTab.value = tabName
  currentPage.value = 1
  fetchOrders()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchOrders()
}

const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

const handlePayOrder = (order) => {
  ElMessage.info('跳转到支付页面...')
  // 这里应该跳转到支付页面
}

const handleCancelOrder = async (orderId) => {
  try {
    await ElMessageBox.confirm('确定要取消这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('订单已取消')
    fetchOrders()
  } catch (error) {
    // 用户取消
  }
}

const handleConfirmOrder = async (orderId) => {
  try {
    await ElMessageBox.confirm('确认已收到商品？', '提示', {
      confirmButtonText: '确认收货',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    ElMessage.success('确认收货成功')
    fetchOrders()
  } catch (error) {
    // 用户取消
  }
}

const handleReviewOrder = (orderId) => {
  ElMessage.info('评价功能开发中...')
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped lang="scss">
.order-page {
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

.order-tabs {
  margin-bottom: var(--spacing-xl);
  
  :deep(.el-tabs__nav-wrap) {
    background-color: var(--color-bg-card);
    border-radius: var(--border-radius-medium);
    padding: var(--spacing-sm);
  }
}

.order-list {
  .order-item {
    @include card-style;
    margin-bottom: var(--spacing-lg);
    
    .order-header {
      @include flex-between;
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--spacing-md);
      
      .order-info {
        display: flex;
        gap: var(--spacing-lg);
        
        .order-id {
          color: var(--color-text-title);
          font-weight: 500;
        }
        
        .order-time {
          color: var(--color-text-secondary);
        }
      }
    }
    
    .order-products {
      margin-bottom: var(--spacing-md);
      
      .product-item {
        display: flex;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        border-radius: var(--border-radius-small);
        cursor: pointer;
        transition: var(--transition-normal);
        
        &:hover {
          background-color: var(--color-bg-hover);
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
            
            .price {
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
    
    .order-footer {
      @include flex-between;
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--color-border);
      
      .order-total {
        color: var(--color-text-primary);
        
        .total-price {
          color: var(--color-button);
          font-size: var(--font-size-lg);
          font-weight: bold;
          margin-left: var(--spacing-sm);
        }
      }
      
      .order-actions {
        display: flex;
        gap: var(--spacing-sm);
      }
    }
  }
}

.empty-orders {
  text-align: center;
  padding: var(--spacing-xxl);
}

.pagination {
  @include flex-center;
  margin-top: var(--spacing-xl);
}

// 响应式
@include mobile {
  .order-header {
    flex-direction: column !important;
    gap: var(--spacing-md);
  }
  
  .order-footer {
    flex-direction: column !important;
    gap: var(--spacing-md);
    text-align: center;
    
    .order-actions {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
  
  .product-item {
    flex-direction: column !important;
    text-align: center;
    
    .product-image {
      align-self: center;
    }
  }
}
</style>
