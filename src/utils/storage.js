// 封装本地存储操作模块

// 存储数据
export const setItem = (key, value) => {
  // 如果是数组或对象类型的数据，就转成JSON字符串再存储到本地存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取数据
export const getItem = key => {
  const data = window.localStorage.getItem(key)
  // 尝试将读取到的数据还原成对象或数组，如果转换失败说明不是对象或数组，直接返回数据即可
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 删除数据
export const removeItem = key => {
  window.localStorage.removeItem(key)
}
