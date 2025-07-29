<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1>数据概览</h1>
      <p>欢迎回来，{{ userInfo.username }}！</p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="32" color="#67c23a"><Goods /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">1,234</div>
          <div class="stat-label">商品总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="32" color="#409eff"><Document /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">567</div>
          <div class="stat-label">订单总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="32" color="#e6a23c"><User /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">890</div>
          <div class="stat-label">用户总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <el-icon size="32" color="#f56c6c"><Money /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">¥12,345</div>
          <div class="stat-label">今日销售额</div>
        </div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-card">
        <h3>销售趋势</h3>
        <div class="chart-placeholder">
          <el-empty description="图表功能开发中..." />
        </div>
      </div>
      
      <div class="chart-card">
        <h3>商品分类占比</h3>
        <div class="chart-placeholder">
          <el-empty description="图表功能开发中..." />
        </div>
      </div>
    </div>
    
    <!-- 最新订单 -->
    <div class="recent-orders">
      <div class="section-header">
        <h3>最新订单</h3>
        <el-button text @click="$router.push('/admin/orders')">查看全部</el-button>
      </div>
      
      <el-table :data="recentOrders" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="150" />
        <el-table-column prop="customerName" label="客户" width="120" />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            {{ formatPrice(row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button text @click="viewOrder(row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { formatPrice, formatDate } from '@/utils'
import { Goods, Document, User, Money } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const userInfo = computed(() => userStore.userInfo)

// 模拟最新订单数据
const recentOrders = ref([
  {
    id: 'ORD20240101001',
    customerName: '张三',
    amount: 299.00,
    status: 'pending',
    statusText: '待付款',
    createTime: '2024-01-01 10:30:00'
  },
  {
    id: 'ORD20240102002',
    customerName: '李四',
    amount: 156.00,
    status: 'shipped',
    statusText: '已发货',
    createTime: '2024-01-02 14:20:00'
  },
  {
    id: 'ORD20240103003',
    customerName: '王五',
    amount: 268.00,
    status: 'completed',
    statusText: '已完成',
    createTime: '2024-01-03 09:15:00'
  }
])

// 方法
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

const viewOrder = (orderId) => {
  router.push(`/order/${orderId}`)
}
</script>

<style scoped lang="scss">
.dashboard-page {
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    h1 {
      color: var(--color-text-title);
      margin-bottom: var(--spacing-sm);
    }
    
    p {
      color: var(--color-text-secondary);
      margin: 0;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  .stat-card {
    @include card-style;
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    
    .stat-icon {
      width: 60px;
      height: 60px;
      @include flex-center;
      background-color: var(--color-bg-light);
      border-radius: 50%;
    }
    
    .stat-info {
      .stat-value {
        font-size: var(--font-size-xxl);
        font-weight: bold;
        color: var(--color-text-title);
        margin-bottom: var(--spacing-xs);
      }
      
      .stat-label {
        color: var(--color-text-secondary);
      }
    }
  }
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  .chart-card {
    @include card-style;
    
    h3 {
      color: var(--color-text-title);
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-sm);
      border-bottom: 1px solid var(--color-border);
    }
    
    .chart-placeholder {
      height: 300px;
      @include flex-center;
    }
  }
}

.recent-orders {
  @include card-style;
  
  .section-header {
    @include flex-between;
    margin-bottom: var(--spacing-lg);
    
    h3 {
      color: var(--color-text-title);
      margin: 0;
    }
  }
}

// 响应式
@include mobile {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
