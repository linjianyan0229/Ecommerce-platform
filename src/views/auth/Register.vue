<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <!-- 头部 -->
        <div class="register-header">
          <div class="logo">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=60&h=60&fit=crop&crop=center" alt="自然商城" />
            <h1>自然商城</h1>
          </div>
          <p class="subtitle">创建您的账户，开启自然购物之旅</p>
        </div>
        
        <!-- 注册表单 -->
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form"
          @submit.prevent="handleRegister"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              size="large"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              size="large"
              prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              size="large"
              prefix-icon="Phone"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item prop="agreement">
            <el-checkbox v-model="registerForm.agreement">
              我已阅读并同意
              <el-link type="primary" @click="showTerms = true">《用户协议》</el-link>
              和
              <el-link type="primary" @click="showPrivacy = true">《隐私政策》</el-link>
            </el-checkbox>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="register-btn"
              :loading="loading"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        
        <!-- 底部 -->
        <div class="register-footer">
          <p>已有账户？ <router-link to="/login" class="login-link">立即登录</router-link></p>
        </div>
      </div>
    </div>
    
    <!-- 用户协议对话框 -->
    <el-dialog v-model="showTerms" title="用户协议" width="600px" class="terms-dialog">
      <div class="terms-content">
        <h3>1. 服务条款</h3>
        <p>欢迎使用自然商城服务。在使用我们的服务前，请仔细阅读本协议。</p>
        
        <h3>2. 用户责任</h3>
        <p>用户应当遵守法律法规，不得利用本服务从事违法活动。</p>
        
        <h3>3. 隐私保护</h3>
        <p>我们承诺保护用户隐私，不会泄露用户个人信息。</p>
        
        <h3>4. 服务变更</h3>
        <p>我们保留随时修改或终止服务的权利。</p>
      </div>
      
      <template #footer>
        <el-button @click="showTerms = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 隐私政策对话框 -->
    <el-dialog v-model="showPrivacy" title="隐私政策" width="600px" class="privacy-dialog">
      <div class="privacy-content">
        <h3>1. 信息收集</h3>
        <p>我们会收集您提供的个人信息，用于提供更好的服务。</p>
        
        <h3>2. 信息使用</h3>
        <p>您的信息仅用于服务提供，不会用于其他商业目的。</p>
        
        <h3>3. 信息保护</h3>
        <p>我们采用先进的安全技术保护您的个人信息。</p>
        
        <h3>4. 信息共享</h3>
        <p>除法律要求外，我们不会与第三方分享您的个人信息。</p>
      </div>
      
      <template #footer>
        <el-button @click="showPrivacy = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { isValidEmail, isValidPhone } from '@/utils'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const registerFormRef = ref()
const loading = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)

// 注册表单
const registerForm = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
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
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (!isValidPhone(value)) {
        callback(new Error('请输入正确的手机号格式'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, message: '密码必须包含大小写字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  agreement: [
    { validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error('请阅读并同意用户协议和隐私政策'))
      } else {
        callback()
      }
    }, trigger: 'change' }
  ]
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    // 模拟注册（实际项目中调用 API）
    const result = await simulateRegister(registerForm)
    
    if (result.success) {
      ElMessage.success('注册成功，欢迎加入自然商城！')
      router.push('/')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

// 模拟注册函数
const simulateRegister = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟注册成功
      const mockUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'user'
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
    }, 1500)
  })
}

// 页面挂载时检查是否已登录
onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-light) 100%);
  @include flex-center;
  padding: var(--spacing-lg);
}

.register-container {
  width: 100%;
  max-width: 450px;
}

.register-card {
  @include card-style;
  padding: var(--spacing-xxl);
}

.register-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
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

.register-form {
  .el-form-item {
    margin-bottom: var(--spacing-lg);
  }
  
  .register-btn {
    width: 100%;
    height: 48px;
    font-size: var(--font-size-md);
    font-weight: 500;
  }
}

.register-footer {
  text-align: center;
  margin-top: var(--spacing-xl);
  
  p {
    color: var(--color-text-secondary);
  }
  
  .login-link {
    color: var(--color-button);
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      color: var(--color-button-hover);
    }
  }
}

.terms-content,
.privacy-content {
  max-height: 400px;
  overflow-y: auto;
  
  h3 {
    color: var(--color-text-title);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  p {
    color: var(--color-text-secondary);
    line-height: var(--line-height-loose);
    margin-bottom: var(--spacing-md);
  }
}

// 响应式
@include mobile {
  .register-page {
    padding: var(--spacing-md);
  }
  
  .register-card {
    padding: var(--spacing-lg);
  }
  
  .register-header .logo h1 {
    font-size: var(--font-size-xl);
  }
}
</style>
