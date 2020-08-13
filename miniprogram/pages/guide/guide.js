// pages/guide/guide.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [
      "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2612260318,2568361145&fm=26&gp=0.jpg",
      "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=361062454,92445662&fm=26&gp=0.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1597311983159&di=596a263ec14d82ae7a2a15645bf9ac41&imgtype=0&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F56%2F35%2F16pic_5635353_b.jpg",
    ],
    isFirst: false,

    img: "http://img.kaiyanapp.com/7ff70fb62f596267ea863e1acb4fa484.jpeg",
  },

  onBtnSkip() {
    wx.setStorage({
      key: 'isFirst',
      data: this.data.isFirst,
    })
    wx.navigateTo({
      url: '../index/index?fromPage=guide',
    })
  },

  checkboxChange(e) {
    if (this.data.isFirst){
      this.setData({
        isFirst: false
      })
    }
    else{
      this.setData({
        isFirst: true
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})