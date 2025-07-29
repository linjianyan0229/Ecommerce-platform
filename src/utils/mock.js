// 模拟数据，用于开发阶段
export const mockProducts = [
  {
    id: 1,
    name: '自然有机棉T恤',
    price: 89.00,
    originalPrice: 129.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    category: 'clothing',
    categoryName: '服装配饰',
    description: '采用100%有机棉制作，柔软舒适，环保健康。',
    stock: 50,
    sales: 1234,
    rating: 4.8,
    reviews: 156,
    tags: ['有机', '环保', '舒适'],
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop'
    ]
  },
  {
    id: 2,
    name: '竹纤维餐具套装',
    price: 156.00,
    originalPrice: 198.00,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: 'home',
    categoryName: '家居生活',
    description: '天然竹纤维制作，可降解环保，健康无毒。',
    stock: 30,
    sales: 856,
    rating: 4.9,
    reviews: 89,
    tags: ['环保', '健康', '可降解'],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop'
    ]
  },
  {
    id: 3,
    name: '智能环保水杯',
    price: 268.00,
    originalPrice: 328.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'electronics',
    categoryName: '数码电子',
    description: '智能温度显示，保温保冷，食品级材质。',
    stock: 25,
    sales: 567,
    rating: 4.7,
    reviews: 78,
    tags: ['智能', '保温', '环保'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop'
    ]
  },
  {
    id: 4,
    name: '天然护肤套装',
    price: 299.00,
    originalPrice: 399.00,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    category: 'beauty',
    categoryName: '美妆护肤',
    description: '纯天然植物提取，温和不刺激，适合敏感肌肤。',
    stock: 40,
    sales: 2341,
    rating: 4.9,
    reviews: 234,
    tags: ['天然', '温和', '敏感肌'],
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop'
    ]
  },
  {
    id: 5,
    name: '有机茶叶礼盒',
    price: 188.00,
    originalPrice: 238.00,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop',
    category: 'food',
    categoryName: '食品饮料',
    description: '精选高山有机茶叶，香气浓郁，口感醇厚。',
    stock: 60,
    sales: 1567,
    rating: 4.8,
    reviews: 167,
    tags: ['有机', '高山', '礼盒'],
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop'
    ]
  },
  {
    id: 6,
    name: '瑜伽垫套装',
    price: 128.00,
    originalPrice: 168.00,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    category: 'sports',
    categoryName: '运动户外',
    description: '天然橡胶材质，防滑耐用，环保健康。',
    stock: 35,
    sales: 789,
    rating: 4.6,
    reviews: 98,
    tags: ['天然橡胶', '防滑', '环保'],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506629905607-c60f6c3e7db1?w=600&h=600&fit=crop'
    ]
  }
]

export const mockCategories = [
  {
    id: 'electronics',
    name: '数码电子',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop',
    description: '智能设备、数码配件等',
    productCount: 156
  },
  {
    id: 'clothing',
    name: '服装配饰',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
    description: '时尚服装、配饰用品等',
    productCount: 234
  },
  {
    id: 'home',
    name: '家居生活',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
    description: '家居用品、生活必需品等',
    productCount: 189
  },
  {
    id: 'beauty',
    name: '美妆护肤',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
    description: '护肤品、化妆品等',
    productCount: 167
  },
  {
    id: 'food',
    name: '食品饮料',
    image: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=300&h=200&fit=crop',
    description: '有机食品、健康饮品等',
    productCount: 145
  },
  {
    id: 'sports',
    name: '运动户外',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    description: '运动器材、户外用品等',
    productCount: 123
  }
]

export const mockUser = {
  id: 1,
  username: '自然用户',
  email: 'user@natural-mall.com',
  phone: '13800138000',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  role: 'user',
  addresses: [
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
  ]
}

export const mockOrders = [
  {
    id: 'ORD20240101001',
    status: 'pending',
    statusText: '待付款',
    createTime: '2024-01-01 10:30:00',
    totalAmount: 299.00,
    items: [
      {
        id: 1,
        name: '自然有机棉T恤',
        price: 89.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'
      },
      {
        id: 4,
        name: '天然护肤套装',
        price: 299.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop'
      }
    ]
  }
]
