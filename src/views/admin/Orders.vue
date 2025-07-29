<template>
  <div class="admin-orders-page">
    <div class="page-header">
      <h1>订单管理</h1>
    </div>
    
    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-select v-model="statusFilter" placeholder="订单状态" clearable style="width: 150px">
        <el-option label="待付款" value="pending" />
        <el-option label="已付款" value="paid" />
        <el-option label="已发货" value="shipped" />
        <el-option label="已完成" value="completed" />
        <el-option label="已取消" value="cancelled" />
      </el-select>
      
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 240px"
      />
      
      <el-input
        v-model="searchKeyword"
        placeholder="搜索订单号或客户名称"
        style="width: 250px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    
    <!-- 订单表格 -->
    <div class="table-section">
      <el-table :data="orders" v-loading="loading" style="width: 100%">
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
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text @click="viewOrder(row.id)">查看</el-button>
            <el-button
              v-if="row.status === 'paid'"
              text
              type="primary"
              @click="shipOrder(row.id)"
            >
              发货
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              text
              type="danger"
              @click="cancelOrder(row.id)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
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
import { Search } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const orders = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const statusFilter = ref('')
const dateRange = ref([])
const searchKeyword = ref('')

// 模拟订单数据
const mockOrders = [
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
    status: 'paid',
    statusText: '已付款',
    createTime: '2024-01-02 14:20:00'
  },
  {
    id: 'ORD20240103003',
    customerName: '王五',
    amount: 268.00,
    status: 'shipped',
    statusText: '已发货',
    createTime: '2024-01-03 09:15:00'
  },
  {
    id: 'ORD20240104004',
    customerName: '赵六',
    amount: 188.00,
    status: 'completed',
    statusText: '已完成',
    createTime: '2024-01-04 16:45:00'
  }
]

// 方法
const fetchOrders = async () => {
  loading.value = true
  
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredOrders = [...mockOrders]
    
    // 状态筛选
    if (statusFilter.value) {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter.value)
    }
    
    // 搜索筛选
    if (searchKeyword.value) {
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }
    
    total.value = filteredOrders.length
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    orders.value = filteredOrders.slice(start, end)
    
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchOrders()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchOrders()
}

const handleCurrentChange = (page) => {
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

const viewOrder = (orderId) => {
  router.push(`/order/${orderId}`)
}

const shipOrder = async (orderId) => {
  try {
    await ElMessageBox.confirm('确定要发货吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    ElMessage.success('订单已发货')
    fetchOrders()
  } catch (error) {
    // 用户取消
  }
}

const cancelOrder = async (orderId) => {
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

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped lang="scss">
.admin-orders-page {
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    h1 {
      color: var(--color-text-title);
      margin: 0;
    }
  }
  
  .filter-section {
    @include card-style;
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
  }
  
  .table-section {
    @include card-style;
    
    .pagination {
      @include flex-center;
      margin-top: var(--spacing-lg);
    }
  }
}

// 响应式
@include mobile {
  .filter-section {
    flex-direction: column;
  }
}
</style>
