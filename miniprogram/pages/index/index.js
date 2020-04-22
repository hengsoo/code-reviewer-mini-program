//index.js
const app = getApp()

Page({
  data: {
    menu : []
  },

  onLoad: function() {
    this.setOpenID()
    this.getUserMenu()
  },
  
  setOpenID: function() {
    // Call cloud funtion getOpenID
    wx.cloud.callFunction({
      name: 'getOpenID',
      data: {},
      success: res => {
        console.log('user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[CLOUD] [getOpenID] FAILED: ', err)
      }
    })
  },

  getUserMenu: function(){
    // Call cloud funtion getOpenID
    wx.cloud.callFunction({
      name: 'getUserMenu',
      data: {},
      success: res => {
        this.updateUserMenu(res.result.data.menu)
        console.log("user menu updated")
      },
      fail: error => {
        console.log('Get user menu FAILED: ', error)
      }
    })
  },

  updateUserMenu: function(new_menu){
    console.log(new_menu)
    if (new_menu){
      this.setData({
        menu :  new_menu
      })
    }
  }
  
})
