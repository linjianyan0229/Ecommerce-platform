<template>
  <div class="admin-categories-page">
    <div class="page-header">
      <h1>分类管理</h1>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>
    
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索分类名称"
        style="width: 300px"
        @input="handleSearch"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select v-model="statusFilter" placeholder="状态" clearable style="width: 120px">
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>
      
      <el-select v-model="levelFilter" placeholder="层级" clearable style="width: 120px">
        <el-option label="一级分类" value="1" />
        <el-option label="二级分类" value="2" />
        <el-option label="三级分类" value="3" />
      </el-select>
      
      <el-button @click="resetFilters">重置</el-button>
    </div>
    
    <!-- 批量操作 -->
    <div class="batch-actions" v-if="selectedCategories.length > 0">
      <span>已选择 {{ selectedCategories.length }} 项</span>
      <el-button type="danger" @click="batchDelete">批量删除</el-button>
    </div>
    
    <!-- 分类表格 -->
    <div class="table-section">
      <el-table
        :data="categories"
        v-loading="loading"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        default-expand-all
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column label="分类图片" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row && row.image"
              :src="row.image"
              :alt="row.name || '分类图片'"
              style="width: 60px; height: 60px; border-radius: 4px;"
              fit="cover"
              :preview-src-list="[row.image]"
            />
            <div v-else class="no-image">无图片</div>
          </template>
        </el-table-column>
        
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="{ row }">
            <div class="category-name">
              <span>{{ row?.name || '未命名' }}</span>
              <el-tag v-if="(row?.level || 1) === 1" type="primary" size="small">一级</el-tag>
              <el-tag v-else-if="(row?.level || 1) === 2" type="success" size="small">二级</el-tag>
              <el-tag v-else type="info" size="small">三级</el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        
        <el-table-column prop="sort" label="排序" width="100">
          <template #default="{ row }">
            <el-input-number
              v-if="row"
              v-model="row.sort"
              :min="0"
              :max="9999"
              size="small"
              @change="updateSort(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-if="row"
              v-model="row.status"
              active-value="active"
              inactive-value="inactive"
              @change="updateStatus(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ row?.created_at ? formatDate(row.created_at) : '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row" type="primary" size="small" @click="editCategory(row)">
              编辑
            </el-button>
            <el-button
              v-if="row && (row.level || 1) < 3"
              type="success"
              size="small"
              @click="addSubCategory(row)"
            >
              添加子分类
            </el-button>
            <el-button v-if="row" type="danger" size="small" @click="deleteCategory(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 创建/编辑分类对话框 -->
    <CategoryDialog
      v-model="dialogVisible"
      :category="currentCategory"
      :parent-categories="parentCategories"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { 
  getAdminCategories, 
  deleteCategory as deleteCategoryApi,
  batchDeleteCategories,
  updateCategoryStatus,
  updateCategorySort
} from '@/api/category'
import CategoryDialog from '@/components/admin/CategoryDialog.vue'
import { formatDate } from '@/utils/date'

// 响应式数据
const loading = ref(false)
const categories = ref([])
const selectedCategories = ref([])
const searchKeyword = ref('')
const statusFilter = ref('')
const levelFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const currentCategory = ref(null)

// 计算属性
const parentCategories = computed(() => {
  // 获取可作为父分类的分类（一级和二级分类）
  const getParentOptions = (categories, level = 1) => {
    const options = []
    if (!categories || !Array.isArray(categories)) {
      return options
    }
    categories.forEach(category => {
      if (level < 3 && category) {
        options.push({
          value: category.id,
          label: category.name,
          level: category.level || level
        })
        if (category.children && Array.isArray(category.children) && category.children.length > 0) {
          options.push(...getParentOptions(category.children, level + 1))
        }
      }
    })
    return options
  }
  return getParentOptions(categories.value)
})

// 方法
const fetchCategories = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value,
      status: statusFilter.value,
      level: levelFilter.value
    }

    const response = await getAdminCategories(params)
    categories.value = response?.data?.list || []
    total.value = response?.data?.total || 0
  } catch (error) {
    ElMessage.error('获取分类列表失败')
    console.error('获取分类列表失败:', error)
    categories.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchCategories()
}

const resetFilters = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  levelFilter.value = ''
  currentPage.value = 1
  fetchCategories()
}

const handleSelectionChange = (selection) => {
  selectedCategories.value = selection
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchCategories()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchCategories()
}

const showCreateDialog = () => {
  currentCategory.value = null
  dialogVisible.value = true
}

const editCategory = (category) => {
  currentCategory.value = { ...category }
  dialogVisible.value = true
}

const addSubCategory = (parentCategory) => {
  currentCategory.value = {
    parent_id: parentCategory.id,
    level: parentCategory.level + 1
  }
  dialogVisible.value = true
}

const updateStatus = async (category) => {
  if (!category || !category.id) return

  try {
    await updateCategoryStatus(category.id, category.status)
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败')
    // 恢复原状态
    category.status = category.status === 'active' ? 'inactive' : 'active'
  }
}

const updateSort = async (category) => {
  if (!category || !category.id) return

  try {
    await updateCategorySort(category.id, category.sort)
    ElMessage.success('排序更新成功')
  } catch (error) {
    ElMessage.error('排序更新失败')
    fetchCategories() // 重新获取数据恢复原值
  }
}

const deleteCategory = async (category) => {
  if (!category || !category.id) return

  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${category.name || '未命名'}"吗？删除后不可恢复！`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteCategoryApi(category.id)
    ElMessage.success('删除成功')
    fetchCategories()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedCategories.value.length} 个分类吗？删除后不可恢复！`,
      '确认批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const ids = selectedCategories.value.filter(item => item && item.id).map(item => item.id)
    await batchDeleteCategories(ids)
    ElMessage.success('批量删除成功')
    selectedCategories.value = []
    fetchCategories()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const handleDialogSuccess = () => {
  dialogVisible.value = false
  fetchCategories()
}

// 生命周期
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped lang="scss">
.admin-categories-page {
  .page-header {
    @include flex-between;
    margin-bottom: var(--spacing-lg);
    
    h1 {
      margin: 0;
      color: var(--color-text-title);
    }
  }
  
  .search-section {
    @include flex-center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--color-bg-card);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
  }
  
  .batch-actions {
    @include flex-between;
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--color-bg-hover);
    border-radius: var(--border-radius);
    
    span {
      color: var(--color-text-secondary);
    }
  }
  
  .table-section {
    background-color: var(--color-bg-card);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border);
    overflow: hidden;
    
    .no-image {
      @include flex-center;
      width: 60px;
      height: 60px;
      background-color: var(--color-bg-primary);
      border-radius: 4px;
      color: var(--color-text-placeholder);
      font-size: var(--font-size-sm);
    }
    
    .category-name {
      @include flex-center;
      gap: var(--spacing-sm);
      justify-content: flex-start;
    }
  }
  
  .pagination-wrapper {
    padding: var(--spacing-lg);
    text-align: center;
    border-top: 1px solid var(--color-border);
  }
}
</style>
