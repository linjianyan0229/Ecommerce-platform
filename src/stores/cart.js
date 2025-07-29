import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 状态
  const items = ref(JSON.parse(localStorage.getItem('cartItems') || '[]'))
  
  // 计算属性
  const totalCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })
  
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })
  
  const isEmpty = computed(() => items.value.length === 0)
  
  // 保存到本地存储
  const saveToStorage = () => {
    localStorage.setItem('cartItems', JSON.stringify(items.value))
  }
  
  // 添加商品到购物车
  const addToCart = (product, quantity = 1) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        selected: true
      })
    }
    
    saveToStorage()
  }
  
  // 更新商品数量
  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }
  
  // 从购物车移除商品
  const removeFromCart = (productId) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  // 切换商品选中状态
  const toggleItemSelection = (productId) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      item.selected = !item.selected
      saveToStorage()
    }
  }
  
  // 全选/取消全选
  const toggleAllSelection = (selected) => {
    items.value.forEach(item => {
      item.selected = selected
    })
    saveToStorage()
  }
  
  // 获取选中的商品
  const getSelectedItems = () => {
    return items.value.filter(item => item.selected)
  }
  
  // 获取选中商品的总价
  const getSelectedTotalPrice = () => {
    return items.value
      .filter(item => item.selected)
      .reduce((total, item) => total + (item.price * item.quantity), 0)
  }
  
  // 获取选中商品的数量
  const getSelectedCount = () => {
    return items.value
      .filter(item => item.selected)
      .reduce((total, item) => total + item.quantity, 0)
  }
  
  // 清空购物车
  const clearCart = () => {
    items.value = []
    saveToStorage()
  }
  
  // 清空选中的商品（用于结算后）
  const clearSelectedItems = () => {
    items.value = items.value.filter(item => !item.selected)
    saveToStorage()
  }
  
  // 检查商品是否在购物车中
  const isInCart = (productId) => {
    return items.value.some(item => item.id === productId)
  }
  
  // 获取商品在购物车中的数量
  const getItemQuantity = (productId) => {
    const item = items.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }
  
  // 初始化（从本地存储恢复数据）
  const init = () => {
    const savedItems = localStorage.getItem('cartItems')
    if (savedItems) {
      try {
        items.value = JSON.parse(savedItems)
      } catch (error) {
        console.error('解析购物车数据失败:', error)
        items.value = []
      }
    }
  }
  
  return {
    // 状态
    items,
    
    // 计算属性
    totalCount,
    totalPrice,
    isEmpty,
    
    // 方法
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleItemSelection,
    toggleAllSelection,
    getSelectedItems,
    getSelectedTotalPrice,
    getSelectedCount,
    clearCart,
    clearSelectedItems,
    isInCart,
    getItemQuantity,
    init
  }
})
