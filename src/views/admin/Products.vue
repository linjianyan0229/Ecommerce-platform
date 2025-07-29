<template>
  <div class="admin-products-page">
    <div class="page-header">
      <h1>商品管理</h1>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加商品
      </el-button>
    </div>
    
    <!-- 搜索和筛选 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品名称..."
        style="width: 300px"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      
      <el-select v-model="categoryFilter" placeholder="选择分类" clearable style="width: 200px">
        <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
        />
      </el-select>
    </div>
    
    <!-- 商品表格 -->
    <div class="table-section">
      <el-table :data="products" v-loading="loading" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <img :src="row.image" :alt="row.name" class="product-image" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="200" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            {{ formatPrice(row.price) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="sales" label="销量" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.stock > 0 ? 'success' : 'danger'">
              {{ row.stock > 0 ? '有库存' : '缺货' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text @click="editProduct(row)">编辑</el-button>
            <el-button text @click="viewProduct(row.id)">查看</el-button>
            <el-button text type="danger" @click="deleteProduct(row.id)">删除</el-button>
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
    
    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingProduct ? '编辑商品' : '添加商品'"
      width="600px"
    >
      <el-form ref="productFormRef" :model="productForm" :rules="productRules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="productForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="productForm.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="库存数量" prop="stock">
          <el-input-number v-model="productForm.stock" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="productForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入商品描述"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatPrice } from '@/utils'
import { mockProducts, mockCategories } from '@/utils/mock'
import { Plus, Search } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const products = ref([])
const categories = ref(mockCategories)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')
const categoryFilter = ref('')
const showAddDialog = ref(false)
const editingProduct = ref(null)
const productFormRef = ref()

// 商品表单
const productForm = reactive({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: ''
})

// 表单验证规则
const productRules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入库存数量', trigger: 'blur' }
  ]
}

// 方法
const fetchProducts = async () => {
  loading.value = true
  
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredProducts = [...mockProducts]
    
    // 搜索过滤
    if (searchKeyword.value) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }
    
    // 分类过滤
    if (categoryFilter.value) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === categoryFilter.value
      )
    }
    
    total.value = filteredProducts.length
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    products.value = filteredProducts.slice(start, end)
    
  } catch (error) {
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchProducts()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProducts()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchProducts()
}

const editProduct = (product) => {
  editingProduct.value = product
  Object.assign(productForm, {
    name: product.name,
    category: product.category,
    price: product.price,
    stock: product.stock,
    description: product.description
  })
  showAddDialog.value = true
}

const viewProduct = (productId) => {
  router.push(`/product/${productId}`)
}

const deleteProduct = async (productId) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('商品删除成功')
    fetchProducts()
  } catch (error) {
    // 用户取消
  }
}

const saveProduct = async () => {
  try {
    await productFormRef.value.validate()
    
    // 模拟保存
    ElMessage.success(editingProduct.value ? '商品更新成功' : '商品添加成功')
    showAddDialog.value = false
    resetForm()
    fetchProducts()
  } catch (error) {
    // 验证失败
  }
}

const resetForm = () => {
  editingProduct.value = null
  Object.assign(productForm, {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: ''
  })
  if (productFormRef.value) {
    productFormRef.value.clearValidate()
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped lang="scss">
.admin-products-page {
  .page-header {
    @include flex-between;
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
    
    .product-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: var(--border-radius-small);
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
  
  .page-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>
