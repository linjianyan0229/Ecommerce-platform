import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProducts, getProductDetail, getCategories, searchProducts } from '@/api/product'

export const useProductStore = defineStore('product', () => {
  // 状态
  const products = ref([])
  const categories = ref([])
  const currentProduct = ref(null)
  const loading = ref(false)
  const searchResults = ref([])
  const searchLoading = ref(false)
  
  // 获取商品列表
  const fetchProducts = async (params = {}) => {
    loading.value = true
    try {
      const response = await getProducts(params)
      products.value = response.data.items || response.data
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取商品列表失败' 
      }
    } finally {
      loading.value = false
    }
  }
  
  // 获取商品详情
  const fetchProductDetail = async (id) => {
    loading.value = true
    try {
      const response = await getProductDetail(id)
      currentProduct.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取商品详情失败' 
      }
    } finally {
      loading.value = false
    }
  }
  
  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      categories.value = response.data
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取分类列表失败' 
      }
    }
  }
  
  // 搜索商品
  const searchProductsByKeyword = async (keyword, params = {}) => {
    searchLoading.value = true
    try {
      const response = await searchProducts({ keyword, ...params })
      searchResults.value = response.data.items || response.data
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '搜索商品失败' 
      }
    } finally {
      searchLoading.value = false
    }
  }
  
  // 根据分类获取商品
  const fetchProductsByCategory = async (categoryId, params = {}) => {
    loading.value = true
    try {
      const response = await getProducts({ categoryId, ...params })
      products.value = response.data.items || response.data
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '获取分类商品失败' 
      }
    } finally {
      loading.value = false
    }
  }
  
  // 清空当前商品
  const clearCurrentProduct = () => {
    currentProduct.value = null
  }
  
  // 清空搜索结果
  const clearSearchResults = () => {
    searchResults.value = []
  }
  
  return {
    // 状态
    products,
    categories,
    currentProduct,
    loading,
    searchResults,
    searchLoading,
    
    // 方法
    fetchProducts,
    fetchProductDetail,
    fetchCategories,
    searchProductsByKeyword,
    fetchProductsByCategory,
    clearCurrentProduct,
    clearSearchResults
  }
})
