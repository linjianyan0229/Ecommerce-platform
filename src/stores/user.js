import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo, updateUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  
  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value.role === 'admin')
  
  // 登录
  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials)
      const { token: newToken, user } = response.data
      
      token.value = newToken
      userInfo.value = user
      
      // 保存到本地存储
      localStorage.setItem('token', newToken)
      localStorage.setItem('userInfo', JSON.stringify(user))
      localStorage.setItem('userRole', user.role)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '登录失败' 
      }
    }
  }
  
  // 注册
  const registerUser = async (userData) => {
    try {
      const response = await register(userData)
      const { token: newToken, user } = response.data
      
      token.value = newToken
      userInfo.value = user
      
      // 保存到本地存储
      localStorage.setItem('token', newToken)
      localStorage.setItem('userInfo', JSON.stringify(user))
      localStorage.setItem('userRole', user.role)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '注册失败' 
      }
    }
  }
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      userInfo.value = response.data
      localStorage.setItem('userInfo', JSON.stringify(response.data))
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取用户信息失败' 
      }
    }
  }
  
  // 更新用户信息
  const updateUser = async (data) => {
    try {
      const response = await updateUserInfo(data)
      userInfo.value = { ...userInfo.value, ...response.data }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '更新用户信息失败' 
      }
    }
  }
  
  // 退出登录
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('userRole')
  }
  
  // 初始化（用于页面刷新时恢复状态）
  const init = () => {
    const savedToken = localStorage.getItem('token')
    const savedUserInfo = localStorage.getItem('userInfo')
    
    if (savedToken) {
      token.value = savedToken
    }
    
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        logout()
      }
    }
  }
  
  return {
    // 状态
    token,
    userInfo,
    
    // 计算属性
    isLoggedIn,
    isAdmin,
    
    // 方法
    loginUser,
    registerUser,
    fetchUserInfo,
    updateUser,
    logout,
    init
  }
})
