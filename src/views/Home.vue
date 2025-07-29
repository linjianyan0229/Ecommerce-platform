<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <section class="hero-section">
      <el-carousel height="400px" indicator-position="outside">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.subtitle }}</p>
              <el-button type="primary" size="large" @click="$router.push(banner.link)">
                {{ banner.buttonText }}
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>
    
    <!-- 分类导航 -->
    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">商品分类</h2>
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            @click="$router.push(`/category/${category.id}`)"
          >
            <div class="category-image">
              <img :src="category.image" :alt="category.name" />
            </div>
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <p>{{ category.productCount }}+ 商品</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 热门商品 -->
    <section class="hot-products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">热门商品</h2>
          <el-button text @click="$router.push('/products')">查看更多 →</el-button>
        </div>
        <div class="products-grid">
          <ProductCard
            v-for="product in hotProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>
    
    <!-- 新品推荐 -->
    <section class="new-products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">新品推荐</h2>
          <el-button text @click="$router.push('/products?sort=new')">查看更多 →</el-button>
        </div>
        <div class="products-grid">
          <ProductCard
            v-for="product in newProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>
    
    <!-- 品牌故事 -->
    <section class="brand-story-section">
      <div class="container">
        <div class="story-content">
          <div class="story-text">
            <h2>自然生活，从这里开始</h2>
            <p>我们致力于为您提供最自然、最健康的生活方式。每一件商品都经过精心挑选，确保品质与环保并重。</p>
            <p>选择自然商城，就是选择了一种更加健康、可持续的生活方式。让我们一起为地球的未来贡献一份力量。</p>
            <el-button type="primary" size="large" @click="$router.push('/products')">
              探索更多
            </el-button>
          </div>
          <div class="story-image">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" alt="自然生活" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- 服务特色 -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">服务特色</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon size="48"><Van /></el-icon>
            </div>
            <h3>免费配送</h3>
            <p>满99元免费配送，快速到达</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon size="48"><CircleCheck /></el-icon>
            </div>
            <h3>品质保证</h3>
            <p>严格质检，品质有保障</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon size="48"><RefreshRight /></el-icon>
            </div>
            <h3>7天退换</h3>
            <p>7天无理由退换货</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <el-icon size="48"><Service /></el-icon>
            </div>
            <h3>24小时客服</h3>
            <p>专业客服，随时为您服务</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { mockProducts, mockCategories } from '@/utils/mock'
import { Van, CircleCheck, RefreshRight, Service } from '@element-plus/icons-vue'

// 响应式数据
const banners = ref([
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
    title: '自然生活，健康选择',
    subtitle: '精选有机商品，为您带来更健康的生活方式',
    buttonText: '立即购买',
    link: '/products'
  },
  {
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop',
    title: '环保材质，安心使用',
    subtitle: '所有商品均采用环保材质，让您用得安心',
    buttonText: '了解更多',
    link: '/category/home'
  },
  {
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1200&h=400&fit=crop',
    title: '新品上市，限时优惠',
    subtitle: '多款新品限时优惠，错过就要等下次了',
    buttonText: '查看新品',
    link: '/products?sort=new'
  }
])

const categories = ref(mockCategories)
const hotProducts = ref(mockProducts.slice(0, 4))
const newProducts = ref(mockProducts.slice(2, 6))

onMounted(() => {
  // 这里可以调用 API 获取数据
  console.log('首页加载完成')
})
</script>

<style scoped lang="scss">
.home-page {
  overflow-x: hidden;
}

// 轮播图部分
.hero-section {
  margin-bottom: var(--spacing-xxl);
  
  .banner-item {
    height: 400px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
    @include flex-center;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }
    
    .banner-content {
      position: relative;
      z-index: 1;
      text-align: center;
      color: white;
      max-width: 600px;
      padding: 0 var(--spacing-lg);
      
      h2 {
        font-size: var(--font-size-title);
        margin-bottom: var(--spacing-lg);
        font-weight: bold;
      }
      
      p {
        font-size: var(--font-size-lg);
        margin-bottom: var(--spacing-xl);
        line-height: var(--line-height-loose);
      }
    }
  }
}

// 通用部分样式
.section-title {
  color: var(--color-text-title);
  font-size: var(--font-size-xxl);
  font-weight: bold;
  text-align: center;
  margin-bottom: var(--spacing-xxl);
}

.section-header {
  @include flex-between;
  margin-bottom: var(--spacing-xxl);
  
  .section-title {
    margin-bottom: 0;
    text-align: left;
  }
}

// 分类导航
.categories-section {
  padding: var(--spacing-xxl) 0;
  background-color: var(--color-bg-light);
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--spacing-lg);
    
    .category-item {
      @include card-style;
      text-align: center;
      cursor: pointer;
      transition: var(--transition-normal);
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-medium);
      }
      
      .category-image {
        margin-bottom: var(--spacing-md);
        
        img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: var(--border-radius-small);
        }
      }
      
      .category-info {
        h3 {
          color: var(--color-text-title);
          margin-bottom: var(--spacing-xs);
        }
        
        p {
          color: var(--color-text-secondary);
          margin: 0;
        }
      }
    }
  }
}

// 商品网格
.hot-products-section,
.new-products-section {
  padding: var(--spacing-xxl) 0;
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
}

.new-products-section {
  background-color: var(--color-bg-light);
}

// 品牌故事
.brand-story-section {
  padding: var(--spacing-xxl) 0;
  
  .story-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xxl);
    align-items: center;
    
    .story-text {
      h2 {
        color: var(--color-text-title);
        font-size: var(--font-size-xxl);
        margin-bottom: var(--spacing-lg);
      }
      
      p {
        color: var(--color-text-secondary);
        line-height: var(--line-height-loose);
        margin-bottom: var(--spacing-lg);
      }
    }
    
    .story-image {
      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: var(--border-radius-medium);
      }
    }
  }
}

// 服务特色
.features-section {
  padding: var(--spacing-xxl) 0;
  background-color: var(--color-bg-light);
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-xl);
    
    .feature-item {
      text-align: center;
      
      .feature-icon {
        margin-bottom: var(--spacing-lg);
        color: var(--color-button);
      }
      
      h3 {
        color: var(--color-text-title);
        margin-bottom: var(--spacing-sm);
      }
      
      p {
        color: var(--color-text-secondary);
        margin: 0;
      }
    }
  }
}

// 响应式
@include tablet {
  .story-content {
    grid-template-columns: 1fr !important;
    gap: var(--spacing-lg) !important;
  }
  
  .categories-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@include mobile {
  .banner-item {
    height: 300px !important;
    
    .banner-content {
      h2 {
        font-size: var(--font-size-xl) !important;
      }
      
      p {
        font-size: var(--font-size-md) !important;
      }
    }
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .products-grid {
    grid-template-columns: 1fr !important;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
