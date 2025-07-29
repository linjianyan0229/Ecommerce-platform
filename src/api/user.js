import request from './request'

// 用户登录
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

// 用户注册
export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export const updateUserInfo = (data) => {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// 修改密码
export const changePassword = (data) => {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

// 上传头像
export const uploadAvatar = (file) => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  return request({
    url: '/user/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取用户地址列表
export const getUserAddresses = () => {
  return request({
    url: '/user/addresses',
    method: 'get'
  })
}

// 添加用户地址
export const addUserAddress = (data) => {
  return request({
    url: '/user/addresses',
    method: 'post',
    data
  })
}

// 更新用户地址
export const updateUserAddress = (id, data) => {
  return request({
    url: `/user/addresses/${id}`,
    method: 'put',
    data
  })
}

// 删除用户地址
export const deleteUserAddress = (id) => {
  return request({
    url: `/user/addresses/${id}`,
    method: 'delete'
  })
}

// 设置默认地址
export const setDefaultAddress = (id) => {
  return request({
    url: `/user/addresses/${id}/default`,
    method: 'put'
  })
}
