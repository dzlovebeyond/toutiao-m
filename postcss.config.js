module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 1rem基准值为37.5px，即以375宽度的屏为基准，屏幕分右10等份
      propList: ['*'] // 表示对所有属性都进行转换
    }
  }
}
