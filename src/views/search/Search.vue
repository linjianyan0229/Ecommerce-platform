<template>
  <div class="search-page">
    <div class="container">
      <!-- 搜索头部 -->
      <div class="search-header">
        <div class="search-info">
          <h1 class="search-title">
            搜索结果
            <span v-if="keyword" class="keyword">"{{ keyword }}"</span>
          </h1>
          <p class="search-count">找到 {{ total }} 个相关商品</p>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品..."
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon @click="handleSearch" class="search-icon">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>
      
      <!-- 筛选和排序 -->
      <div class="filter-section">
        <div class="filter-tags">
          <span class="filter-label">筛选：</span>
          <el-tag
            v-for="category in categories"
            :key="category.id"
            :type="filters.category === category.id ? 'primary' : 'info'"
            :effect="filters.category === category.id ? 'dark' : 'plain'"
            class="filter-tag"
            @click="handleCategoryFilter(category.id)"
          >
            {{ category.name }}
          </el-tag>
        </div>
        
        <div class="sort-options">
          <span class="sort-label">排序：</span>
          <el-radio-group v-model="sortBy" @change="handleSortChange">
            <el-radio-button value="default">默认</el-radio-button>
            <el-radio-button value="price-asc">价格↑</el-radio-button>
            <el-radio-button value="price-desc">价格↓</el-radio-button>
            <el-radio-button value="sales-desc">销量</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <!-- 搜索结果 -->
      <div v-loading="loading" class="search-results">
        <div v-if="products.length > 0" class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="!loading" class="empty-results">
          <el-empty description="没有找到相关商品">
            <div class="empty-suggestions">
              <p>建议您：</p>
              <ul>
                <li>检查输入的关键词是否正确</li>
                <li>尝试更换关键词</li>
                <li>使用更简单的词语</li>
              </ul>
              <el-button type="primary" @click="$router.push('/products')">
                浏览全部商品
              </el-button>
            </div>
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
      
      <!-- 搜索历史 -->
      <div v-if="searchHistory.length > 0" class="search-history">
        <h3>搜索历史</h3>
        <div class="history-tags">
          <el-tag
            v-for="(item, index) in searchHistory"
            :key="index"
            closable
            @click="handleHistorySearch(item)"
            @close="removeFromHistory(index)"
          >
            {{ item }}
          </el-tag>
          <el-button text @click="clearHistory">清空历史</el-button>
        </div>
      </div>
      
      <!-- 热门搜索 -->
      <div class="hot-searches">
        <h3>热门搜索</h3>
        <div class="hot-tags">
          <el-tag
            v-for="item in hotSearches"
            :key="item"
            type="success"
            effect="plain"
            @click="handleHotSearch(item)"
          >
            {{ item }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import { mockProducts, mockCategories } from '@/utils/mock'
import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const products = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const searchKeyword = ref('')
const sortBy = ref('default')
const categories = ref(mockCategories)

// 筛选条件
const filters = reactive({
  category: ''
})

// 搜索历史和热门搜索
const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
const hotSearches = ref(['有机', '环保', '天然', '健康', '竹纤维', '护肤'])

// 计算属性
const keyword = computed(() => route.query.q || '')

// 方法
const fetchSearchResults = async () => {
  loading.value = true
  
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredProducts = [...mockProducts]
    
    // 关键词搜索
    if (keyword.value) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
        product.description.toLowerCase().includes(keyword.value.toLowerCase()) ||
        (product.tags && product.tags.some(tag => 
          tag.toLowerCase().includes(keyword.value.toLowerCase())
        ))
      )
    }
    
    // 分类筛选
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category)
    }
    
    // 排序
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
    }
    
    total.value = filteredProducts.length
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    products.value = filteredProducts.slice(start, end)
    
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    // 添加到搜索历史
    addToHistory(searchKeyword.value.trim())
    
    // 跳转到搜索页面
    router.push({
      path: '/search',
      query: { q: searchKeyword.value.trim() }
    })
  }
}

const handleCategoryFilter = (categoryId) => {
  filters.category = filters.category === categoryId ? '' : categoryId
  currentPage.value = 1
  fetchSearchResults()
}

const handleSortChange = () => {
  currentPage.value = 1
  fetchSearchResults()
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchSearchResults()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleHistorySearch = (keyword) => {
  searchKeyword.value = keyword
  handleSearch()
}

const handleHotSearch = (keyword) => {
  searchKeyword.value = keyword
  handleSearch()
}

const addToHistory = (keyword) => {
  const history = [...searchHistory.value]
  const index = history.indexOf(keyword)
  
  if (index > -1) {
    history.splice(index, 1)
  }
  
  history.unshift(keyword)
  
  // 限制历史记录数量
  if (history.length > 10) {
    history.pop()
  }
  
  searchHistory.value = history
  localStorage.setItem('searchHistory', JSON.stringify(history))
}

const removeFromHistory = (index) => {
  searchHistory.value.splice(index, 1)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// 监听路由变化
watch(() => route.query.q, (newKeyword) => {
  if (newKeyword) {
    searchKeyword.value = newKeyword
    currentPage.value = 1
    fetchSearchResults()
  }
}, { immediate: true })

onMounted(() => {
  searchKeyword.value = keyword.value
  fetchSearchResults()
})
</script>

<style scoped lang="scss">
.search-page {
  padding: var(--spacing-lg) 0;
  min-height: calc(100vh - 200px);
}

.search-header {
  margin-bottom: var(--spacing-xl);
  
  .search-info {
    margin-bottom: var(--spacing-lg);
    
    .search-title {
      color: var(--color-text-title);
      font-size: var(--font-size-title);
      margin-bottom: var(--spacing-sm);
      
      .keyword {
        color: var(--color-button);
      }
    }
    
    .search-count {
      color: var(--color-text-secondary);
      margin: 0;
    }
  }
  
  .search-box {
    max-width: 600px;
    
    .search-icon {
      cursor: pointer;
      color: var(--color-text-muted);
      
      &:hover {
        color: var(--color-button);
      }
    }
  }
}

.filter-section {
  @include card-style;
  margin-bottom: var(--spacing-xl);
  
  .filter-tags,
  .sort-options {
    @include flex-center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .filter-label,
    .sort-label {
      color: var(--color-text-primary);
      font-weight: 500;
      white-space: nowrap;
    }
    
    .filter-tag {
      cursor: pointer;
      transition: var(--transition-normal);
    }
  }
}

.search-results {
  margin-bottom: var(--spacing-xl);
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .empty-results {
    text-align: center;
    padding: var(--spacing-xxl);
    
    .empty-suggestions {
      margin-top: var(--spacing-lg);
      
      p {
        color: var(--color-text-primary);
        font-weight: 500;
        margin-bottom: var(--spacing-md);
      }
      
      ul {
        color: var(--color-text-secondary);
        text-align: left;
        display: inline-block;
        margin-bottom: var(--spacing-lg);
        
        li {
          margin-bottom: var(--spacing-sm);
        }
      }
    }
  }
}

.pagination {
  @include flex-center;
  margin-bottom: var(--spacing-xl);
}

.search-history,
.hot-searches {
  @include card-style;
  margin-bottom: var(--spacing-lg);
  
  h3 {
    color: var(--color-text-title);
    margin-bottom: var(--spacing-md);
  }
  
  .history-tags,
  .hot-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    
    .el-tag {
      cursor: pointer;
      transition: var(--transition-normal);
      
      &:hover {
        transform: translateY(-1px);
      }
    }
  }
}

// 响应式
@include tablet {
  .filter-section {
    .filter-tags,
    .sort-options {
      flex-wrap: wrap;
    }
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@include mobile {
  .search-header {
    .search-title {
      font-size: var(--font-size-xl);
    }
  }
  
  .filter-section {
    .filter-tags,
    .sort-options {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  
  .products-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
