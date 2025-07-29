<template>
  <div class="admin-users-page">
    <div class="page-header">
      <h1>用户管理</h1>
    </div>
    
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名或邮箱"
        style="width: 300px"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select v-model="roleFilter" placeholder="用户角色" clearable style="width: 150px">
        <el-option label="普通用户" value="user" />
        <el-option label="管理员" value="admin" />
      </el-select>
    </div>
    
    <!-- 用户表格 -->
    <div class="table-section">
      <el-table :data="users" v-loading="loading" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <img :src="row.avatar" :alt="row.username" class="user-avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text @click="viewUser(row.id)">查看</el-button>
            <el-button text @click="editUser(row)">编辑</el-button>
            <el-button
              text
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="toggleUserStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
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
    
    <!-- 编辑用户对话框 -->
    <el-dialog v-model="showEditDialog" title="编辑用户" width="500px">
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" style="width: 100%">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils'
import { Search } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const users = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')
const roleFilter = ref('')
const showEditDialog = ref(false)
const userFormRef = ref()

// 用户表单
const userForm = reactive({
  id: null,
  username: '',
  email: '',
  phone: '',
  role: 'user'
})

// 表单验证规则
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    username: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    role: 'user',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    createTime: '2024-01-01 10:30:00'
  },
  {
    id: 2,
    username: '李四',
    email: 'lisi@example.com',
    phone: '13900139000',
    role: 'user',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    createTime: '2024-01-02 14:20:00'
  },
  {
    id: 3,
    username: '管理员',
    email: 'admin@example.com',
    phone: '13700137000',
    role: 'admin',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    createTime: '2024-01-01 09:00:00'
  }
]

// 方法
const fetchUsers = async () => {
  loading.value = true
  
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredUsers = [...mockUsers]
    
    // 搜索过滤
    if (searchKeyword.value) {
      filteredUsers = filteredUsers.filter(user =>
        user.username.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }
    
    // 角色过滤
    if (roleFilter.value) {
      filteredUsers = filteredUsers.filter(user => user.role === roleFilter.value)
    }
    
    total.value = filteredUsers.length
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    users.value = filteredUsers.slice(start, end)
    
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchUsers()
}

const viewUser = (userId) => {
  ElMessage.info('查看用户详情功能开发中...')
}

const editUser = (user) => {
  Object.assign(userForm, {
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.role
  })
  showEditDialog.value = true
}

const saveUser = async () => {
  try {
    await userFormRef.value.validate()
    
    // 模拟保存
    ElMessage.success('用户信息更新成功')
    showEditDialog.value = false
    fetchUsers()
  } catch (error) {
    // 验证失败
  }
}

const toggleUserStatus = async (user) => {
  const action = user.status === 'active' ? '禁用' : '启用'
  
  try {
    await ElMessageBox.confirm(`确定要${action}用户 ${user.username} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    user.status = user.status === 'active' ? 'disabled' : 'active'
    ElMessage.success(`用户${action}成功`)
  } catch (error) {
    // 用户取消
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped lang="scss">
.admin-users-page {
  .page-header {
    margin-bottom: var(--spacing-xl);
    
    h1 {
      color: var(--color-text-title);
      margin: 0;
    }
  }
  
  .search-section {
    @include card-style;
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }
  
  .table-section {
    @include card-style;
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .pagination {
      @include flex-center;
      margin-top: var(--spacing-lg);
    }
  }
}

// 响应式
@include mobile {
  .search-section {
    flex-direction: column;
  }
}
</style>
