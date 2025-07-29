<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-image">
          <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" alt="页面未找到" />
        </div>
        
        <div class="error-info">
          <h1 class="error-code">404</h1>
          <h2 class="error-title">页面未找到</h2>
          <p class="error-desc">抱歉，您访问的页面不存在或已被移除。</p>
          
          <div class="error-actions">
            <el-button type="primary" size="large" @click="goHome">
              <el-icon><House /></el-icon>
              返回首页
            </el-button>
            <el-button size="large" @click="goBack">
              <el-icon><ArrowLeft /></el-icon>
              返回上页
            </el-button>
          </div>
          
          <div class="suggestions">
            <h3>您可以尝试：</h3>
            <ul>
              <li>检查网址是否正确</li>
              <li>返回首页重新导航</li>
              <li>使用搜索功能查找商品</li>
              <li>联系客服获取帮助</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { House, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.not-found-page {
  min-height: calc(100vh - 200px);
  @include flex-center;
  padding: var(--spacing-xl) 0;
}

.not-found-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xxl);
  align-items: center;
  max-width: 800px;
}

.error-image {
  text-align: center;
  
  img {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: var(--border-radius-medium);
  }
}

.error-info {
  .error-code {
    font-size: 120px;
    font-weight: bold;
    color: var(--color-button);
    margin: 0;
    line-height: 1;
  }
  
  .error-title {
    color: var(--color-text-title);
    font-size: var(--font-size-xxl);
    margin: var(--spacing-md) 0;
  }
  
  .error-desc {
    color: var(--color-text-secondary);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xl);
    line-height: var(--line-height-loose);
  }
  
  .error-actions {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }
  
  .suggestions {
    h3 {
      color: var(--color-text-title);
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
}

@include mobile {
  .not-found-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .error-info {
    .error-code {
      font-size: 80px;
    }
    
    .error-actions {
      flex-direction: column;
    }
    
    .suggestions {
      text-align: left;
    }
  }
}
</style>
