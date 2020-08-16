// pages/guide/guide.js
Page({

  /**
   * page's initial data
   */
  data: {
    imgs: [
      "../../images/guide/guide_1.jpg",
      "../../images/guide/guide_2.jpg",
      "../../images/guide/guide_3.jpg",
      "../../images/guide/guide_4.jpg",
    ],
    display_guide_on_launch: false,

    img: "http://img.kaiyanapp.com/7ff70fb62f596267ea863e1acb4fa484.jpeg",
  },

  onBtnSkip() {
    wx.cloud.callFunction({
      name: 'setUserSettings',
      data: { display_guide_on_launch: this.data.display_guide_on_launch },
    })
    wx.navigateTo({
      url: '../index/index?fromPage=guide',
    })
  },

  checkboxChange(event) {
    if (this.data.display_guide_on_launch){
      this.setData({
        display_guide_on_launch: false
      })
    }
    else{
      this.setData({
        display_guide_on_launch: true
      })
    }
  },
})
