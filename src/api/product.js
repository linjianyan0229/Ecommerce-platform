import request from './request'

// 获取商品列表
export const getProducts = (params) => {
  return request({
    url: '/products',
    method: 'get',
    params
  })
}

// 获取商品详情
export const getProductDetail = (id) => {
  return request({
    url: `/products/${id}`,
    method: 'get'
  })
}

// 搜索商品
export const searchProducts = (params) => {
  return request({
    url: '/products/search',
    method: 'get',
    params
  })
}

// 获取商品分类
export const getCategories = () => {
  return request({
    url: '/categories',
    method: 'get'
  })
}

// 获取分类详情
export const getCategoryDetail = (id) => {
  return request({
    url: `/categories/${id}`,
    method: 'get'
  })
}

// 获取热门商品
export const getHotProducts = (params) => {
  return request({
    url: '/products/hot',
    method: 'get',
    params
  })
}

// 获取推荐商品
export const getRecommendProducts = (params) => {
  return request({
    url: '/products/recommend',
    method: 'get',
    params
  })
}

// 获取新品
export const getNewProducts = (params) => {
  return request({
    url: '/products/new',
    method: 'get',
    params
  })
}

// 获取商品评价
export const getProductReviews = (id, params) => {
  return request({
    url: `/products/${id}/reviews`,
    method: 'get',
    params
  })
}

// 添加商品评价
export const addProductReview = (id, data) => {
  return request({
    url: `/products/${id}/reviews`,
    method: 'post',
    data
  })
}

// 收藏商品
export const favoriteProduct = (id) => {
  return request({
    url: `/products/${id}/favorite`,
    method: 'post'
  })
}

// 取消收藏商品
export const unfavoriteProduct = (id) => {
  return request({
    url: `/products/${id}/favorite`,
    method: 'delete'
  })
}

// 获取收藏商品列表
export const getFavoriteProducts = (params) => {
  return request({
    url: '/user/favorites',
    method: 'get',
    params
  })
}
