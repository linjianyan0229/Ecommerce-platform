/**
 * 日期格式化工具函数
 */

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式化模板，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化为日期（不包含时间）
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的日期字符串
 */
export const formatDateOnly = (date) => {
  return formatDate(date, 'YYYY-MM-DD')
}

/**
 * 格式化为时间（不包含日期）
 * @param {string|Date} date - 日期
 * @returns {string} 格式化后的时间字符串
 */
export const formatTimeOnly = (date) => {
  return formatDate(date, 'HH:mm:ss')
}

/**
 * 格式化为相对时间
 * @param {string|Date} date - 日期
 * @returns {string} 相对时间字符串
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day
  
  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return `${Math.floor(diff / year)}年前`
  }
}

/**
 * 获取日期范围
 * @param {string} type - 类型：today, yesterday, week, month, year
 * @returns {Array} [开始日期, 结束日期]
 */
export const getDateRange = (type) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (type) {
    case 'today':
      return [
        formatDateOnly(today),
        formatDateOnly(new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1))
      ]
    
    case 'yesterday':
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      return [
        formatDateOnly(yesterday),
        formatDateOnly(new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1))
      ]
    
    case 'week':
      const weekStart = new Date(today.getTime() - (today.getDay() || 7 - 1) * 24 * 60 * 60 * 1000)
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
      return [formatDateOnly(weekStart), formatDateOnly(weekEnd)]
    
    case 'month':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      return [formatDateOnly(monthStart), formatDateOnly(monthEnd)]
    
    case 'year':
      const yearStart = new Date(now.getFullYear(), 0, 1)
      const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
      return [formatDateOnly(yearStart), formatDateOnly(yearEnd)]
    
    default:
      return [formatDateOnly(today), formatDateOnly(today)]
  }
}

/**
 * 判断是否为有效日期
 * @param {any} date - 待检查的日期
 * @returns {boolean} 是否为有效日期
 */
export const isValidDate = (date) => {
  if (!date) return false
  const d = new Date(date)
  return !isNaN(d.getTime())
}

/**
 * 计算两个日期之间的天数差
 * @param {string|Date} startDate - 开始日期
 * @param {string|Date} endDate - 结束日期
 * @returns {number} 天数差
 */
export const getDaysDiff = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 0
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
