// guide.js
const app = getApp();

Page({
  data: {
    images: [
      "../../images/guide/guide_1.jpg",
      "../../images/guide/guide_2.jpg",
      "../../images/guide/guide_3.jpg",
      "../../images/guide/guide_4.jpg",
    ],
    // Default value will be false
    display_guide_on_launch: false,
  },

  onUnload(){
     // Update user settings
     wx.cloud.callFunction({
      name: 'setUserSettings',
      data: {
        display_guide_on_launch: this.data.display_guide_on_launch
      },
    })
    // Update local settings
    app.globalData.settings.display_guide_on_launch = this.data.display_guide_on_launch;
  },

  onRedirectToHomePage() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  checkboxChange(event) {
    this.setData({
      display_guide_on_launch: !this.data.display_guide_on_launch,
    })
  },
})
