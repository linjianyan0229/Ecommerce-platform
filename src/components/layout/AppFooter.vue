<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <!-- 公司信息 -->
        <div class="footer-section">
          <h3 class="section-title">自然商城</h3>
          <p class="section-desc">致力于为您提供自然、健康、优质的商品，让生活更美好。</p>
          <div class="social-links">
            <a href="#" class="social-link">
              <el-icon><Platform /></el-icon>
            </a>
            <a href="#" class="social-link">
              <el-icon><ChatDotRound /></el-icon>
            </a>
            <a href="#" class="social-link">
              <el-icon><Message /></el-icon>
            </a>
          </div>
        </div>
        
        <!-- 快速链接 -->
        <div class="footer-section">
          <h3 class="section-title">快速链接</h3>
          <ul class="link-list">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/products">商品中心</router-link></li>
            <li><router-link to="/category/electronics">数码电子</router-link></li>
            <li><router-link to="/category/clothing">服装配饰</router-link></li>
            <li><router-link to="/category/home">家居生活</router-link></li>
          </ul>
        </div>
        
        <!-- 客户服务 -->
        <div class="footer-section">
          <h3 class="section-title">客户服务</h3>
          <ul class="link-list">
            <li><a href="#">帮助中心</a></li>
            <li><a href="#">售后服务</a></li>
            <li><a href="#">配送说明</a></li>
            <li><a href="#">退换货政策</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>
        
        <!-- 联系方式 -->
        <div class="footer-section">
          <h3 class="section-title">联系我们</h3>
          <div class="contact-info">
            <div class="contact-item">
              <el-icon><Phone /></el-icon>
              <span>400-888-8888</span>
            </div>
            <div class="contact-item">
              <el-icon><Message /></el-icon>
              <span>service@natural-mall.com</span>
            </div>
            <div class="contact-item">
              <el-icon><Location /></el-icon>
              <span>北京市朝阳区自然大厦</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; 2024 自然商城. 保留所有权利.</p>
          <div class="links">
            <a href="#">隐私政策</a>
            <span class="divider">|</span>
            <a href="#">服务条款</a>
            <span class="divider">|</span>
            <a href="#">网站地图</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Platform, ChatDotRound, Message, Phone, Location } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.app-footer {
  background-color: var(--color-bg-card);
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-xxl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-xl);
  padding: var(--spacing-xxl) 0;
}

.footer-section {
  .section-title {
    color: var(--color-text-title);
    font-size: var(--font-size-lg);
    font-weight: bold;
    margin-bottom: var(--spacing-lg);
  }
  
  .section-desc {
    color: var(--color-text-secondary);
    line-height: var(--line-height-loose);
    margin-bottom: var(--spacing-lg);
  }
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
  
  .social-link {
    width: 40px;
    height: 40px;
    @include flex-center;
    background-color: var(--color-bg-hover);
    border-radius: 50%;
    color: var(--color-text-muted);
    transition: var(--transition-normal);
    
    &:hover {
      background-color: var(--color-button);
      color: white;
      transform: translateY(-2px);
    }
  }
}

.link-list {
  li {
    margin-bottom: var(--spacing-sm);
    
    a {
      color: var(--color-text-secondary);
      transition: var(--transition-normal);
      
      &:hover {
        color: var(--color-button);
      }
    }
  }
}

.contact-info {
  .contact-item {
    @include flex-center;
    justify-content: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    color: var(--color-text-secondary);
    
    .el-icon {
      color: var(--color-button);
    }
  }
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  
  .copyright {
    @include flex-between;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    
    .links {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
      
      a {
        color: var(--color-text-muted);
        transition: var(--transition-normal);
        
        &:hover {
          color: var(--color-button);
        }
      }
      
      .divider {
        color: var(--color-border);
      }
    }
  }
}

// 响应式
@include tablet {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }
}

@include mobile {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg) 0;
  }
  
  .footer-bottom .copyright {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
}
</style>
