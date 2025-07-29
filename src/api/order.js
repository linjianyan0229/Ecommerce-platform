import request from './request'

// 创建订单
export const createOrder = (data) => {
  return request({
    url: '/orders',
    method: 'post',
    data
  })
}

// 获取订单列表
export const getOrders = (params) => {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

// 获取订单详情
export const getOrderDetail = (id) => {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

// 取消订单
export const cancelOrder = (id, reason) => {
  return request({
    url: `/orders/${id}/cancel`,
    method: 'put',
    data: { reason }
  })
}

// 确认收货
export const confirmOrder = (id) => {
  return request({
    url: `/orders/${id}/confirm`,
    method: 'put'
  })
}

// 申请退款
export const requestRefund = (id, data) => {
  return request({
    url: `/orders/${id}/refund`,
    method: 'post',
    data
  })
}

// 获取支付信息
export const getPaymentInfo = (orderId) => {
  return request({
    url: `/orders/${orderId}/payment`,
    method: 'get'
  })
}

// 支付订单
export const payOrder = (orderId, data) => {
  return request({
    url: `/orders/${orderId}/pay`,
    method: 'post',
    data
  })
}

// 获取物流信息
export const getShippingInfo = (orderId) => {
  return request({
    url: `/orders/${orderId}/shipping`,
    method: 'get'
  })
}

// 评价订单
export const reviewOrder = (orderId, data) => {
  return request({
    url: `/orders/${orderId}/review`,
    method: 'post',
    data
  })
}
