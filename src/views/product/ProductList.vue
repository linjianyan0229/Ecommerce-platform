<template>
  <div class="product-list-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <h1 class="page-title">全部商品</h1>
      </div>
      
      <!-- 筛选和排序 -->
      <div class="filter-bar">
        <div class="filter-left">
          <!-- 分类筛选 -->
          <el-select
            v-model="filters.category"
            placeholder="选择分类"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
          
          <!-- 价格筛选 -->
          <el-select
            v-model="filters.priceRange"
            placeholder="价格区间"
            clearable
            @change="handleFilterChange"
          >
            <el-option label="0-50元" value="0-50" />
            <el-option label="50-100元" value="50-100" />
            <el-option label="100-200元" value="100-200" />
            <el-option label="200-500元" value="200-500" />
            <el-option label="500元以上" value="500+" />
          </el-select>
          
          <!-- 标签筛选 -->
          <el-select
            v-model="filters.tags"
            placeholder="商品标签"
            multiple
            clearable
            @change="handleFilterChange"
          >
            <el-option label="有机" value="有机" />
            <el-option label="环保" value="环保" />
            <el-option label="天然" value="天然" />
            <el-option label="健康" value="健康" />
            <el-option label="可降解" value="可降解" />
          </el-select>
        </div>
        
        <div class="filter-right">
          <!-- 排序 -->
          <el-select
            v-model="sortBy"
            placeholder="排序方式"
            @change="handleSortChange"
          >
            <el-option label="默认排序" value="default" />
            <el-option label="价格从低到高" value="price-asc" />
            <el-option label="价格从高到低" value="price-desc" />
            <el-option label="销量从高到低" value="sales-desc" />
            <el-option label="评分从高到低" value="rating-desc" />
            <el-option label="最新上架" value="new" />
          </el-select>
          
          <!-- 视图切换 -->
          <div class="view-toggle">
            <el-button-group>
              <el-button
                :type="viewMode === 'grid' ? 'primary' : 'default'"
                @click="viewMode = 'grid'"
              >
                <el-icon><Grid /></el-icon>
              </el-button>
              <el-button
                :type="viewMode === 'list' ? 'primary' : 'default'"
                @click="viewMode = 'list'"
              >
                <el-icon><List /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>
      
      <!-- 商品列表 -->
      <div class="products-section">
        <!-- 结果统计 -->
        <div class="results-info">
          <span>共找到 {{ total }} 件商品</span>
          <el-button v-if="hasActiveFilters" text @click="clearFilters">
            清除筛选条件
          </el-button>
        </div>
        
        <!-- 商品网格/列表 -->
        <div class="products-container">
          <!-- 骨架屏加载状态 -->
          <SkeletonProductList v-if="loading" :count="pageSize" />

          <!-- 商品内容 -->
          <template v-else>
            <div
              v-if="viewMode === 'grid'"
              class="products-grid"
            >
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
                @favorite="handleFavorite"
                @quick-view="handleQuickView"
              />
            </div>

            <div
              v-else
              class="products-list"
            >
              <ProductListItem
                v-for="product in products"
                :key="product.id"
                :product="product"
                @favorite="handleFavorite"
              />
            </div>

            <!-- 空状态 -->
            <div v-if="products.length === 0" class="empty-state">
              <el-empty description="没有找到相关商品">
                <el-button type="primary" @click="clearFilters">
                  清除筛选条件
                </el-button>
              </el-empty>
            </div>
          </template>
        </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 48, 96]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    
    <!-- 快速查看对话框 -->
    <ProductQuickView
      v-model="showQuickView"
      :product="selectedProduct"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductListItem from '@/components/product/ProductListItem.vue'
import ProductQuickView from '@/components/product/ProductQuickView.vue'
import SkeletonProductList from '@/components/common/SkeletonProductList.vue'
import { mockProducts, mockCategories } from '@/utils/mock'
import { Grid, List } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const products = ref([])
const categories = ref(mockCategories)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const viewMode = ref('grid')
const sortBy = ref('default')
const showQuickView = ref(false)
const selectedProduct = ref(null)

// 筛选条件
const filters = reactive({
  category: '',
  priceRange: '',
  tags: []
})

// 计算属性
const hasActiveFilters = computed(() => {
  return filters.category || filters.priceRange || filters.tags.length > 0
})

// 方法
const fetchProducts = async () => {
  loading.value = true
  
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredProducts = [...mockProducts]
    
    // 应用筛选条件
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category)
    }
    
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(v => v.replace('+', ''))
      filteredProducts = filteredProducts.filter(p => {
        if (max === '') return p.price >= parseInt(min)
        return p.price >= parseInt(min) && p.price <= parseInt(max)
      })
    }
    
    if (filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        p.tags && p.tags.some(tag => filters.tags.includes(tag))
      )
    }
    
    // 应用排序
    switch (sortBy.value) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'sales-desc':
        filteredProducts.sort((a, b) => b.sales - a.sales)
        break
      case 'rating-desc':
        filteredProducts.sort((a, b) => b.rating - a.rating)
        break
      case 'new':
        filteredProducts.sort((a, b) => b.id - a.id)
        break
    }
    
    total.value = filteredProducts.length
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    products.value = filteredProducts.slice(start, end)
    
  } catch (error) {
    console.error('获取商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchProducts()
}

const handleSortChange = () => {
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
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  filters.category = ''
  filters.priceRange = ''
  filters.tags = []
  sortBy.value = 'default'
  currentPage.value = 1
  fetchProducts()
}

const handleFavorite = (productId, isFavorite) => {
  console.log('收藏商品:', productId, isFavorite)
}

const handleQuickView = (product) => {
  selectedProduct.value = product
  showQuickView.value = true
}

// 监听路由变化
watch(() => route.query, (newQuery) => {
  if (newQuery.category) {
    filters.category = newQuery.category
  }
  if (newQuery.sort) {
    sortBy.value = newQuery.sort
  }
  fetchProducts()
}, { immediate: true })

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped lang="scss">
.product-list-page {
  padding: var(--spacing-lg) 0;
  min-height: calc(100vh - 200px);
}

.page-header {
  margin-bottom: var(--spacing-xl);
  
  .breadcrumb {
    margin-bottom: var(--spacing-md);
  }
  
  .page-title {
    color: var(--color-text-title);
    font-size: var(--font-size-title);
    margin: 0;
  }
}

.filter-bar {
  @include flex-between;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-card);
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-light);
  
  .filter-left {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }
  
  .filter-right {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }
}

.products-section {
  .results-info {
    @include flex-between;
    margin-bottom: var(--spacing-lg);
    color: var(--color-text-secondary);
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }
  
  .products-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }
  
  .empty-state {
    text-align: center;
    padding: var(--spacing-xxl);
  }
}

.pagination {
  @include flex-center;
  margin-top: var(--spacing-xl);
}

// 响应式
@include tablet {
  .filter-bar {
    flex-direction: column;
    gap: var(--spacing-lg);
    
    .filter-left,
    .filter-right {
      width: 100%;
      justify-content: space-between;
    }
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@include mobile {
  .filter-bar {
    .filter-left,
    .filter-right {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
  
  .products-grid {
    grid-template-columns: 1fr !important;
  }
  
  .results-info {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }
}
</style>
