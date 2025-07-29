<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- 头部 -->
        <div class="login-header">
          <div class="logo">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=60&h=60&fit=crop&crop=center" alt="自然商城" />
            <h1>自然商城</h1>
          </div>
          <p class="subtitle">欢迎回来，请登录您的账户</p>
        </div>
        
        <!-- 登录表单 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="请输入邮箱"
              size="large"
              prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item>
            <div class="form-options">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <el-link type="primary" @click="showForgotPassword = true">忘记密码？</el-link>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <!-- 底部 -->
        <div class="login-footer">
          <p>还没有账户？ <router-link to="/register" class="register-link">立即注册</router-link></p>
          
          <!-- 第三方登录 -->
          <div class="social-login">
            <div class="divider">
              <span>或者使用以下方式登录</span>
            </div>
            <div class="social-buttons">
              <el-button class="social-btn" @click="handleSocialLogin('wechat')">
                <el-icon><ChatDotRound /></el-icon>
                微信
              </el-button>
              <el-button class="social-btn" @click="handleSocialLogin('qq')">
                <el-icon><User /></el-icon>
                QQ
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 忘记密码对话框 -->
    <el-dialog
      v-model="showForgotPassword"
      title="找回密码"
      width="400px"
      :before-close="handleCloseForgotPassword"
    >
      <el-form ref="forgotFormRef" :model="forgotForm" :rules="forgotRules">
        <el-form-item prop="email">
          <el-input
            v-model="forgotForm.email"
            placeholder="请输入注册邮箱"
            prefix-icon="Message"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showForgotPassword = false">取消</el-button>
        <el-button type="primary" :loading="forgotLoading" @click="handleForgotPassword">
          发送重置邮件
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { ChatDotRound, User } from '@element-plus/icons-vue'
import { isValidEmail } from '@/utils'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const loginFormRef = ref()
const forgotFormRef = ref()
const loading = ref(false)
const forgotLoading = ref(false)
const showForgotPassword = ref(false)

// 登录表单
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

// 忘记密码表单
const forgotForm = reactive({
  email: ''
})

// 表单验证规则
const loginRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (!isValidEmail(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const forgotRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (!isValidEmail(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    // 模拟登录（实际项目中调用 API）
    const result = await simulateLogin(loginForm)
    
    if (result.success) {
      ElMessage.success('登录成功')
      
      // 跳转到原来的页面或首页
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

// 模拟登录函数
const simulateLogin = async (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟登录成功
      const mockUser = {
        id: 1,
        username: '自然用户',
        email: credentials.email,
        phone: '13800138000',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: credentials.email === 'admin@natural-mall.com' ? 'admin' : 'user'
      }
      
      const token = 'mock-jwt-token-' + Date.now()
      
      // 保存到 store
      userStore.token = token
      userStore.userInfo = mockUser
      
      // 保存到本地存储
      localStorage.setItem('token', token)
      localStorage.setItem('userInfo', JSON.stringify(mockUser))
      localStorage.setItem('userRole', mockUser.role)
      
      resolve({ success: true })
    }, 1000)
  })
}

// 处理第三方登录
const handleSocialLogin = (platform) => {
  ElMessage.info(`${platform === 'wechat' ? '微信' : 'QQ'}登录功能开发中...`)
}

// 处理忘记密码
const handleForgotPassword = async () => {
  if (!forgotFormRef.value) return
  
  try {
    await forgotFormRef.value.validate()
    forgotLoading.value = true
    
    // 模拟发送重置邮件
    setTimeout(() => {
      ElMessage.success('重置密码邮件已发送，请查收邮箱')
      showForgotPassword.value = false
      forgotLoading.value = false
    }, 1000)
  } catch (error) {
    forgotLoading.value = false
  }
}

// 关闭忘记密码对话框
const handleCloseForgotPassword = () => {
  forgotForm.email = ''
  if (forgotFormRef.value) {
    forgotFormRef.value.clearValidate()
  }
}

// 页面挂载时检查是否已登录
onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-light) 100%);
  @include flex-center;
  padding: var(--spacing-lg);
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  @include card-style;
  padding: var(--spacing-xxl);
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
  
  .logo {
    @include flex-center;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    
    h1 {
      color: var(--color-text-title);
      font-size: var(--font-size-xxl);
      font-weight: bold;
      margin: 0;
    }
  }
  
  .subtitle {
    color: var(--color-text-secondary);
    margin: 0;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: var(--spacing-lg);
  }
  
  .form-options {
    @include flex-between;
    width: 100%;
  }
  
  .login-btn {
    width: 100%;
    height: 48px;
    font-size: var(--font-size-md);
    font-weight: 500;
  }
}

.login-footer {
  text-align: center;
  margin-top: var(--spacing-xl);
  
  p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }
  
  .register-link {
    color: var(--color-button);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      color: var(--color-button-hover);
    }
  }
}

.social-login {
  .divider {
    position: relative;
    margin: var(--spacing-xl) 0;
    text-align: center;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: var(--color-border);
    }
    
    span {
      background-color: var(--color-bg-card);
      color: var(--color-text-muted);
      padding: 0 var(--spacing-md);
      font-size: var(--font-size-sm);
    }
  }
  
  .social-buttons {
    display: flex;
    gap: var(--spacing-md);
    
    .social-btn {
      flex: 1;
      height: 40px;
      border: 1px solid var(--color-border);
      background-color: var(--color-bg-card);
      color: var(--color-text-primary);
      
      &:hover {
        border-color: var(--color-button);
        color: var(--color-button);
      }
      
      .el-icon {
        margin-right: var(--spacing-xs);
      }
    }
  }
}

// 响应式
@include mobile {
  .login-page {
    padding: var(--spacing-md);
  }
  
  .login-card {
    padding: var(--spacing-lg);
  }
  
  .login-header .logo h1 {
    font-size: var(--font-size-xl);
  }
}
</style>
