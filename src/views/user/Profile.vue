<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <h1 class="page-title">个人中心</h1>
        <p class="page-desc">管理您的个人信息和账户设置</p>
      </div>
      
      <div class="profile-content">
        <!-- 侧边栏 -->
        <div class="profile-sidebar">
          <div class="user-card">
            <div class="user-avatar">
              <img :src="userInfo.avatar || defaultAvatar" :alt="userInfo.username" />
              <div class="avatar-upload" @click="handleAvatarUpload">
                <el-icon><Camera /></el-icon>
              </div>
            </div>
            <div class="user-info">
              <h3>{{ userInfo.username }}</h3>
              <p>{{ userInfo.email }}</p>
            </div>
          </div>
          
          <el-menu
            :default-active="activeTab"
            class="profile-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="info">
              <el-icon><User /></el-icon>
              <span>基本信息</span>
            </el-menu-item>
            <el-menu-item index="security">
              <el-icon><Lock /></el-icon>
              <span>安全设置</span>
            </el-menu-item>
            <el-menu-item index="address">
              <el-icon><Location /></el-icon>
              <span>收货地址</span>
            </el-menu-item>
            <el-menu-item index="orders">
              <el-icon><Document /></el-icon>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="favorites">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
          </el-menu>
        </div>
        
        <!-- 主要内容 -->
        <div class="profile-main">
          <!-- 基本信息 -->
          <div v-show="activeTab === 'info'" class="tab-content">
            <div class="content-header">
              <h2>基本信息</h2>
              <el-button type="primary" @click="editMode = !editMode">
                {{ editMode ? '取消编辑' : '编辑信息' }}
              </el-button>
            </div>
            
            <el-form
              ref="infoFormRef"
              :model="infoForm"
              :rules="infoRules"
              label-width="100px"
              class="info-form"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="infoForm.username"
                  :disabled="!editMode"
                  placeholder="请输入用户名"
                />
              </el-form-item>
              
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="infoForm.email"
                  disabled
                  placeholder="邮箱不可修改"
                />
              </el-form-item>
              
              <el-form-item label="手机号" prop="phone">
                <el-input
                  v-model="infoForm.phone"
                  :disabled="!editMode"
                  placeholder="请输入手机号"
                />
              </el-form-item>
              
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="infoForm.gender" :disabled="!editMode">
                  <el-radio value="male">男</el-radio>
                  <el-radio value="female">女</el-radio>
                  <el-radio value="other">其他</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="生日" prop="birthday">
                <el-date-picker
                  v-model="infoForm.birthday"
                  type="date"
                  placeholder="请选择生日"
                  :disabled="!editMode"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item v-if="editMode">
                <el-button type="primary" @click="handleSaveInfo" :loading="saveLoading">
                  保存
                </el-button>
                <el-button @click="handleCancelEdit">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 安全设置 -->
          <div v-show="activeTab === 'security'" class="tab-content">
            <div class="content-header">
              <h2>安全设置</h2>
            </div>
            
            <div class="security-items">
              <div class="security-item">
                <div class="item-info">
                  <h3>登录密码</h3>
                  <p>定期更换密码，保护账户安全</p>
                </div>
                <el-button @click="showChangePassword = true">修改密码</el-button>
              </div>
              
              <div class="security-item">
                <div class="item-info">
                  <h3>手机绑定</h3>
                  <p>已绑定手机：{{ userInfo.phone || '未绑定' }}</p>
                </div>
                <el-button>{{ userInfo.phone ? '更换手机' : '绑定手机' }}</el-button>
              </div>
              
              <div class="security-item">
                <div class="item-info">
                  <h3>邮箱验证</h3>
                  <p>邮箱已验证：{{ userInfo.email }}</p>
                </div>
                <el-button disabled>已验证</el-button>
              </div>
            </div>
          </div>
          
          <!-- 收货地址 -->
          <div v-show="activeTab === 'address'" class="tab-content">
            <div class="content-header">
              <h2>收货地址</h2>
              <el-button type="primary" @click="showAddAddress = true">
                <el-icon><Plus /></el-icon>
                添加地址
              </el-button>
            </div>
            
            <div class="address-list">
              <div
                v-for="address in addresses"
                :key="address.id"
                class="address-item"
                :class="{ 'is-default': address.isDefault }"
              >
                <div class="address-info">
                  <div class="address-header">
                    <span class="name">{{ address.name }}</span>
                    <span class="phone">{{ address.phone }}</span>
                    <el-tag v-if="address.isDefault" type="success" size="small">默认</el-tag>
                  </div>
                  <div class="address-detail">
                    {{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}
                  </div>
                </div>
                <div class="address-actions">
                  <el-button text @click="handleEditAddress(address)">编辑</el-button>
                  <el-button text @click="handleDeleteAddress(address.id)">删除</el-button>
                  <el-button v-if="!address.isDefault" text @click="handleSetDefault(address.id)">
                    设为默认
                  </el-button>
                </div>
              </div>
              
              <div v-if="addresses.length === 0" class="empty-address">
                <el-empty description="暂无收货地址" />
              </div>
            </div>
          </div>
          
          <!-- 我的订单 -->
          <div v-show="activeTab === 'orders'" class="tab-content">
            <div class="content-header">
              <h2>我的订单</h2>
              <el-button @click="$router.push('/orders')">查看全部</el-button>
            </div>
            
            <div class="order-summary">
              <div class="summary-item">
                <div class="summary-number">5</div>
                <div class="summary-label">待付款</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">3</div>
                <div class="summary-label">待发货</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">2</div>
                <div class="summary-label">待收货</div>
              </div>
              <div class="summary-item">
                <div class="summary-number">15</div>
                <div class="summary-label">已完成</div>
              </div>
            </div>
          </div>
          
          <!-- 我的收藏 -->
          <div v-show="activeTab === 'favorites'" class="tab-content">
            <div class="content-header">
              <h2>我的收藏</h2>
            </div>
            
            <div class="favorites-grid">
              <div
                v-for="product in favoriteProducts"
                :key="product.id"
                class="favorite-item"
                @click="$router.push(`/product/${product.id}`)"
              >
                <img :src="product.image" :alt="product.name" />
                <div class="product-info">
                  <h4>{{ product.name }}</h4>
                  <p class="price">{{ formatPrice(product.price) }}</p>
                </div>
                <el-button
                  class="remove-btn"
                  text
                  @click.stop="handleRemoveFavorite(product.id)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
              
              <div v-if="favoriteProducts.length === 0" class="empty-favorites">
                <el-empty description="暂无收藏商品" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 修改密码对话框 -->
    <el-dialog v-model="showChangePassword" title="修改密码" width="400px">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showChangePassword = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">确认</el-button>
      </template>
    </el-dialog>
    
    <!-- 隐藏的文件上传 -->
    <input
      ref="avatarInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleAvatarChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatPrice } from '@/utils'
import {
  User, Lock, Location, Document, Star, Camera, Plus, Close
} from '@element-plus/icons-vue'

const userStore = useUserStore()

// 响应式数据
const activeTab = ref('info')
const editMode = ref(false)
const saveLoading = ref(false)
const showChangePassword = ref(false)
const showAddAddress = ref(false)
const infoFormRef = ref()
const passwordFormRef = ref()
const avatarInputRef = ref()

// 计算属性
const userInfo = computed(() => userStore.userInfo)

// 默认头像
const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'

// 基本信息表单
const infoForm = reactive({
  username: '',
  email: '',
  phone: '',
  gender: '',
  birthday: null
})

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 模拟地址数据
const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '三里屯街道1号',
    isDefault: true
  }
])

// 模拟收藏商品数据
const favoriteProducts = ref([
  {
    id: 1,
    name: '自然有机棉T恤',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop'
  },
  {
    id: 2,
    name: '竹纤维餐具套装',
    price: 156.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop'
  }
])

// 表单验证规则
const infoRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}

// 方法
const handleMenuSelect = (index) => {
  activeTab.value = index
}

const handleAvatarUpload = () => {
  avatarInputRef.value?.click()
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 这里应该上传到服务器，现在只是模拟
    ElMessage.success('头像上传成功')
  }
}

const handleSaveInfo = async () => {
  try {
    await infoFormRef.value.validate()
    saveLoading.value = true
    
    // 模拟保存
    setTimeout(() => {
      ElMessage.success('信息保存成功')
      editMode.value = false
      saveLoading.value = false
    }, 1000)
  } catch (error) {
    saveLoading.value = false
  }
}

const handleCancelEdit = () => {
  editMode.value = false
  // 重置表单
  Object.assign(infoForm, {
    username: userInfo.value.username,
    email: userInfo.value.email,
    phone: userInfo.value.phone,
    gender: userInfo.value.gender || '',
    birthday: userInfo.value.birthday || null
  })
}

const handleChangePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    ElMessage.success('密码修改成功')
    showChangePassword.value = false
    // 重置表单
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  } catch (error) {
    // 验证失败
  }
}

const handleEditAddress = (address) => {
  ElMessage.info('编辑地址功能开发中...')
}

const handleDeleteAddress = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    addresses.value = addresses.value.filter(addr => addr.id !== id)
    ElMessage.success('地址删除成功')
  } catch (error) {
    // 用户取消
  }
}

const handleSetDefault = (id) => {
  addresses.value.forEach(addr => {
    addr.isDefault = addr.id === id
  })
  ElMessage.success('默认地址设置成功')
}

const handleRemoveFavorite = (id) => {
  favoriteProducts.value = favoriteProducts.value.filter(product => product.id !== id)
  ElMessage.success('已取消收藏')
}

// 初始化数据
onMounted(() => {
  Object.assign(infoForm, {
    username: userInfo.value.username,
    email: userInfo.value.email,
    phone: userInfo.value.phone,
    gender: userInfo.value.gender || '',
    birthday: userInfo.value.birthday || null
  })
})
</script>

<style scoped lang="scss">
.profile-page {
  padding: var(--spacing-xl) 0;
  min-height: calc(100vh - 200px);
}

.profile-header {
  text-align: center;
  margin-bottom: var(--spacing-xxl);
  
  .page-title {
    color: var(--color-text-title);
    font-size: var(--font-size-title);
    margin-bottom: var(--spacing-sm);
  }
  
  .page-desc {
    color: var(--color-text-secondary);
    margin: 0;
  }
}

.profile-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-xl);
}

.profile-sidebar {
  .user-card {
    @include card-style;
    text-align: center;
    margin-bottom: var(--spacing-lg);
    
    .user-avatar {
      position: relative;
      display: inline-block;
      margin-bottom: var(--spacing-md);
      
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      
      .avatar-upload {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 24px;
        height: 24px;
        @include flex-center;
        background-color: var(--color-button);
        color: white;
        border-radius: 50%;
        cursor: pointer;
        
        &:hover {
          background-color: var(--color-button-hover);
        }
      }
    }
    
    .user-info {
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
  
  .profile-menu {
    border: none;
    background-color: transparent;
    
    .el-menu-item {
      border-radius: var(--border-radius-medium);
      margin-bottom: var(--spacing-xs);
      
      &:hover,
      &.is-active {
        background-color: var(--color-bg-hover);
        color: var(--color-button);
      }
    }
  }
}

.profile-main {
  .tab-content {
    @include card-style;
    min-height: 500px;
  }
  
  .content-header {
    @include flex-between;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    
    h2 {
      color: var(--color-text-title);
      margin: 0;
    }
  }
}

.info-form {
  max-width: 500px;
}

.security-items {
  .security-item {
    @include flex-between;
    padding: var(--spacing-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-md);
    
    .item-info {
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

.address-list {
  .address-item {
    @include flex-between;
    padding: var(--spacing-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    margin-bottom: var(--spacing-md);
    
    &.is-default {
      border-color: var(--color-button);
      background-color: rgba(169, 195, 166, 0.05);
    }
    
    .address-info {
      flex: 1;
      
      .address-header {
        @include flex-center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        
        .name {
          font-weight: bold;
          color: var(--color-text-title);
        }
        
        .phone {
          color: var(--color-text-secondary);
        }
      }
      
      .address-detail {
        color: var(--color-text-primary);
      }
    }
    
    .address-actions {
      display: flex;
      gap: var(--spacing-sm);
    }
  }
}

.order-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  
  .summary-item {
    text-align: center;
    padding: var(--spacing-lg);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-medium);
    
    .summary-number {
      font-size: var(--font-size-xxl);
      font-weight: bold;
      color: var(--color-button);
      margin-bottom: var(--spacing-sm);
    }
    
    .summary-label {
      color: var(--color-text-secondary);
    }
  }
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  
  .favorite-item {
    position: relative;
    @include card-style;
    padding: var(--spacing-md);
    cursor: pointer;
    transition: var(--transition-normal);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-medium);
    }
    
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: var(--border-radius-small);
      margin-bottom: var(--spacing-md);
    }
    
    .product-info {
      h4 {
        color: var(--color-text-title);
        margin-bottom: var(--spacing-xs);
        @include text-ellipsis;
      }
      
      .price {
        color: var(--color-button);
        font-weight: bold;
        margin: 0;
      }
    }
    
    .remove-btn {
      position: absolute;
      top: var(--spacing-sm);
      right: var(--spacing-sm);
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      padding: 0;
    }
  }
}

// 响应式
@include tablet {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .order-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include mobile {
  .profile-page {
    padding: var(--spacing-lg) 0;
  }
  
  .order-summary {
    grid-template-columns: 1fr;
  }
  
  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
