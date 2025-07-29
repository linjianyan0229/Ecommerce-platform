import request from './request'

// 获取分类列表（管理员）
export const getAdminCategories = (params) => {
  // 临时模拟数据，等后端实现后删除
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            list: [
              {
                id: 1,
                parent_id: 0,
                name: '生鲜食品',
                description: '新鲜健康的生鲜食品',
                image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop',
                level: 1,
                sort: 1,
                status: 'active',
                created_at: '2024-01-01 10:00:00',
                updated_at: '2024-01-01 10:00:00',
                children: [
                  {
                    id: 2,
                    parent_id: 1,
                    name: '水果',
                    description: '新鲜水果',
                    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=200&fit=crop',
                    level: 2,
                    sort: 1,
                    status: 'active',
                    created_at: '2024-01-01 10:05:00',
                    updated_at: '2024-01-01 10:05:00',
                    children: []
                  }
                ]
              },
              {
                id: 5,
                parent_id: 0,
                name: '日用百货',
                description: '日常生活用品',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
                level: 1,
                sort: 2,
                status: 'active',
                created_at: '2024-01-01 10:01:00',
                updated_at: '2024-01-01 10:01:00',
                children: []
              }
            ],
            total: 2
          }
        })
      }, 500)
    })
  }

  return request({
    url: '/admin/categories',
    method: 'get',
    params
  })
}

// 获取分类详情（管理员）
export const getAdminCategoryDetail = (id) => {
  return request({
    url: `/admin/categories/${id}`,
    method: 'get'
  })
}

// 创建分类
export const createCategory = (data) => {
  // 临时模拟响应
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: Date.now(),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        })
      }, 300)
    })
  }

  return request({
    url: '/admin/categories',
    method: 'post',
    data
  })
}

// 更新分类
export const updateCategory = (id, data) => {
  // 临时模拟响应
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id,
            ...data,
            updated_at: new Date().toISOString()
          }
        })
      }, 300)
    })
  }

  return request({
    url: `/admin/categories/${id}`,
    method: 'put',
    data
  })
}

// 删除分类
export const deleteCategory = (id) => {
  // 临时模拟响应
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: '删除成功' } })
      }, 300)
    })
  }

  return request({
    url: `/admin/categories/${id}`,
    method: 'delete'
  })
}

// 批量删除分类
export const batchDeleteCategories = (ids) => {
  // 临时模拟响应
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: '批量删除成功' } })
      }, 300)
    })
  }

  return request({
    url: '/admin/categories/batch-delete',
    method: 'post',
    data: { ids }
  })
}

// 更新分类状态
export const updateCategoryStatus = (id, status) => {
  // 临时模拟响应
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: '状态更新成功' } })
      }, 300)
    })
  }

  return request({
    url: `/admin/categories/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 更新分类排序
export const updateCategorySort = (id, sort) => {
  // 临时模拟响应
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { message: '排序更新成功' } })
      }, 300)
    })
  }

  return request({
    url: `/admin/categories/${id}/sort`,
    method: 'put',
    data: { sort }
  })
}

// 获取分类树形结构
export const getCategoryTree = () => {
  return request({
    url: '/admin/categories/tree',
    method: 'get'
  })
}

// 移动分类（调整父级分类）
export const moveCategory = (id, parentId) => {
  return request({
    url: `/admin/categories/${id}/move`,
    method: 'put',
    data: { parentId }
  })
}

// 上传分类图片
export const uploadCategoryImage = (file) => {
  // 临时模拟响应
  if (process.env.NODE_ENV === 'development') {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 创建一个临时的图片URL用于预览
        const imageUrl = URL.createObjectURL(file)
        resolve({
          data: {
            url: imageUrl,
            filename: `category_${Date.now()}.${file.name.split('.').pop()}`,
            originalName: file.name,
            size: file.size,
            mimeType: file.type
          }
        })
      }, 1000)
    })
  }

  const formData = new FormData()
  formData.append('image', file)

  return request({
    url: '/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
