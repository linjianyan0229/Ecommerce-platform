<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="8" animated />
      </div>

      <!-- 商品详情 -->
      <div v-else-if="product" class="product-detail">
        <!-- 商品图片 -->
        <div class="product-images">
          <div class="main-image">
            <img :src="currentImage" :alt="product.name" />
          </div>
          <div class="image-thumbnails">
            <div
              v-for="(image, index) in product.images"
              :key="index"
              class="thumbnail"
              :class="{ active: currentImage === image }"
              @click="currentImage = image"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" />
            </div>
          </div>
        </div>
        
        <!-- 商品信息 -->
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-desc">{{ product.description }}</p>
          
          <!-- 评分和销量 -->
          <div v-if="product" class="product-meta">
            <div class="rating">
              <el-rate
                v-model="product.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              />
              <span class="reviews">({{ product.reviews }}评价)</span>
            </div>
            <div class="sales">已售 {{ product.sales }}</div>
          </div>
          
          <!-- 价格 -->
          <div class="product-price">
            <span class="current-price">{{ formatPrice(product.price) }}</span>
            <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span v-if="discountPercent > 0" class="discount">
              省{{ formatPrice(product.originalPrice - product.price) }}
            </span>
          </div>
          
          <!-- 标签 -->
          <div class="product-tags">
            <el-tag
              v-for="tag in product.tags"
              :key="tag"
              type="success"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
          
          <!-- 购买选项 -->
          <div class="purchase-options">
            <div class="quantity-selector">
              <span class="label">数量：</span>
              <el-input-number
                v-model="quantity"
                :min="1"
                :max="product.stock"
                size="large"
              />
              <span class="stock">库存：{{ product.stock }}件</span>
            </div>
            
            <div class="action-buttons">
              <el-button
                size="large"
                :disabled="product.stock === 0"
                @click="handleAddToCart"
              >
                <el-icon><ShoppingCart /></el-icon>
                加入购物车
              </el-button>
              <el-button
                type="primary"
                size="large"
                :disabled="product.stock === 0"
                @click="handleBuyNow"
              >
                立即购买
              </el-button>
              <el-button
                class="favorite-btn"
                :class="{ 'is-favorite': isFavorite }"
                @click="handleFavorite"
              >
                <el-icon><Star /></el-icon>
                {{ isFavorite ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 商品详情标签页 -->
      <div class="product-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="detail">
            <div class="detail-content">
              <h3>商品介绍</h3>
              <p>{{ product?.description }}</p>
              <p>这是一款精心挑选的自然商品，采用环保材质制作，确保品质与健康并重。</p>
              
              <h3>产品特点</h3>
              <ul>
                <li>100%天然材质，安全无害</li>
                <li>环保可持续，保护地球</li>
                <li>精工细作，品质保证</li>
                <li>设计简约，实用美观</li>
              </ul>
              
              <h3>使用说明</h3>
              <p>请按照产品说明书正确使用，如有疑问请联系客服。</p>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="商品评价" name="reviews">
            <div class="reviews-content">
              <div v-if="product" class="reviews-summary">
                <div class="rating-overview">
                  <div class="rating-score">{{ product?.rating }}</div>
                  <el-rate
                    :model-value="product.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                  />
                  <div class="rating-count">{{ product?.reviews }}人评价</div>
                </div>
              </div>
              
              <div class="reviews-list">
                <div v-for="review in mockReviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <div class="user-info">
                      <img :src="review.avatar" :alt="review.username" class="user-avatar" />
                      <span class="username">{{ review.username }}</span>
                    </div>
                    <div class="review-meta">
                      <el-rate v-model="review.rating" disabled size="small" />
                      <span class="review-time">{{ formatDate(review.time) }}</span>
                    </div>
                  </div>
                  <div class="review-content">{{ review.content }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 推荐商品 -->
      <div class="recommend-section">
        <h2 class="section-title">相关推荐</h2>
        <div class="recommend-products">
          <ProductCard
            v-for="product in recommendProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ElMessage } from 'element-plus'
import { formatPrice, formatDate } from '@/utils'
import { mockProducts } from '@/utils/mock'
import ProductCard from '@/components/product/ProductCard.vue'
import { ShoppingCart, Star } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 响应式数据
const product = ref(null)
const loading = ref(true)
const currentImage = ref('')
const quantity = ref(1)
const isFavorite = ref(false)
const activeTab = ref('detail')
const recommendProducts = ref(mockProducts.slice(0, 4))

// 模拟评价数据
const mockReviews = ref([
  {
    id: 1,
    username: '自然爱好者',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    rating: 5,
    time: '2024-01-01 10:30:00',
    content: '质量很好，材质很舒服，值得推荐！'
  },
  {
    id: 2,
    username: '环保达人',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    rating: 4,
    time: '2024-01-02 14:20:00',
    content: '包装很环保，商品质量不错，会继续支持。'
  }
])

// 计算属性
const discountPercent = computed(() => {
  if (product.value?.originalPrice && product.value.originalPrice > product.value.price) {
    return Math.round((1 - product.value.price / product.value.originalPrice) * 100)
  }
  return 0
})

// 方法
const fetchProductDetail = async (id) => {
  try {
    loading.value = true
    // 模拟 API 调用
    const foundProduct = mockProducts.find(p => p.id === parseInt(id))
    if (foundProduct) {
      product.value = foundProduct
      currentImage.value = foundProduct.images?.[0] || foundProduct.image
    } else {
      ElMessage.error('商品不存在')
      router.push('/products')
    }
  } catch (error) {
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

const handleAddToCart = () => {
  cartStore.addToCart(product.value, quantity.value)
  ElMessage.success(`已添加 ${quantity.value} 件商品到购物车`)
}

const handleBuyNow = () => {
  cartStore.addToCart(product.value, quantity.value)
  router.push('/cart')
}

const handleFavorite = () => {
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '已添加到收藏' : '已取消收藏')
}

onMounted(() => {
  const productId = route.params.id
  if (productId) {
    fetchProductDetail(productId)
  }
})
</script>

<style scoped lang="scss">
.product-detail-page {
  padding: var(--spacing-lg) 0;
  min-height: calc(100vh - 200px);
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xxl);
  margin-bottom: var(--spacing-xxl);
}

.product-images {
  .main-image {
    margin-bottom: var(--spacing-lg);
    
    img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      border-radius: var(--border-radius-medium);
    }
  }
  
  .image-thumbnails {
    display: flex;
    gap: var(--spacing-sm);
    
    .thumbnail {
      width: 80px;
      height: 80px;
      cursor: pointer;
      border: 2px solid transparent;
      border-radius: var(--border-radius-small);
      overflow: hidden;
      transition: var(--transition-normal);
      
      &:hover,
      &.active {
        border-color: var(--color-button);
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.product-info {
  .product-name {
    color: var(--color-text-title);
    font-size: var(--font-size-xxl);
    margin-bottom: var(--spacing-md);
  }
  
  .product-desc {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    line-height: var(--line-height-loose);
    margin-bottom: var(--spacing-lg);
  }
  
  .product-meta {
    @include flex-between;
    margin-bottom: var(--spacing-lg);
    
    .rating {
      @include flex-center;
      gap: var(--spacing-sm);
      
      .reviews {
        color: var(--color-text-muted);
      }
    }
    
    .sales {
      color: var(--color-text-muted);
    }
  }
  
  .product-price {
    margin-bottom: var(--spacing-lg);
    
    .current-price {
      color: var(--color-button);
      font-size: 32px;
      font-weight: bold;
    }
    
    .original-price {
      color: var(--color-text-muted);
      font-size: var(--font-size-lg);
      text-decoration: line-through;
      margin-left: var(--spacing-md);
    }
    
    .discount {
      color: var(--color-danger);
      font-size: var(--font-size-md);
      margin-left: var(--spacing-md);
    }
  }
  
  .product-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
    margin-bottom: var(--spacing-xl);
  }
  
  .purchase-options {
    .quantity-selector {
      @include flex-center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
      
      .label {
        color: var(--color-text-primary);
        font-weight: 500;
      }
      
      .stock {
        color: var(--color-text-muted);
      }
    }
    
    .action-buttons {
      display: flex;
      gap: var(--spacing-md);
      
      .el-button {
        flex: 1;
        height: 48px;
      }
      
      .favorite-btn {
        &.is-favorite {
          color: var(--color-danger);
          border-color: var(--color-danger);
        }
      }
    }
  }
}

.product-tabs {
  @include card-style;
  margin-bottom: var(--spacing-xxl);
  
  .detail-content {
    h3 {
      color: var(--color-text-title);
      margin: var(--spacing-lg) 0 var(--spacing-md);
    }
    
    p {
      color: var(--color-text-secondary);
      line-height: var(--line-height-loose);
      margin-bottom: var(--spacing-md);
    }
    
    ul {
      color: var(--color-text-secondary);
      
      li {
        margin-bottom: var(--spacing-sm);
        line-height: var(--line-height-loose);
      }
    }
  }
  
  .reviews-content {
    .reviews-summary {
      text-align: center;
      padding: var(--spacing-xl);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--spacing-lg);
      
      .rating-score {
        font-size: 48px;
        font-weight: bold;
        color: var(--color-button);
        margin-bottom: var(--spacing-sm);
      }
      
      .rating-count {
        color: var(--color-text-secondary);
        margin-top: var(--spacing-sm);
      }
    }
    
    .reviews-list {
      .review-item {
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-border);
        
        &:last-child {
          border-bottom: none;
        }
        
        .review-header {
          @include flex-between;
          margin-bottom: var(--spacing-md);
          
          .user-info {
            @include flex-center;
            gap: var(--spacing-sm);
            
            .user-avatar {
              width: 40px;
              height: 40px;
              border-radius: 50%;
            }
            
            .username {
              color: var(--color-text-title);
              font-weight: 500;
            }
          }
          
          .review-meta {
            @include flex-center;
            gap: var(--spacing-sm);
            
            .review-time {
              color: var(--color-text-muted);
              font-size: var(--font-size-sm);
            }
          }
        }
        
        .review-content {
          color: var(--color-text-secondary);
          line-height: var(--line-height-loose);
        }
      }
    }
  }
}

.recommend-section {
  .section-title {
    color: var(--color-text-title);
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }
  
  .recommend-products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }
}

// 响应式
@include tablet {
  .product-detail {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .recommend-products {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@include mobile {
  .product-info {
    .product-name {
      font-size: var(--font-size-xl);
    }
    
    .product-price .current-price {
      font-size: 24px;
    }
    
    .quantity-selector {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: var(--spacing-sm) !important;
    }
    
    .action-buttons {
      flex-direction: column !important;
    }
  }
  
  .recommend-products {
    grid-template-columns: 1fr !important;
  }
}
</style>
