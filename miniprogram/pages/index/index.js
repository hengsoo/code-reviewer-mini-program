//index.js
const app = getApp()

Page({
  data: {
    user_menu : []
  },

  onLoad: function() {
    setOpenID()
    getUserMenu()
  },

})

function setOpenID() {
  // Call cloud funtion getOpenID
  wx.cloud.callFunction({
    name: 'getOpenID',
    data: {},
    success: res => {
      console.log('[CLOUD] [getOpenID] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid
    },
    fail: err => {
      console.error('[CLOUD] [getOpenID] FAILED: ', err)
    }
  })
}

function getUserMenu(){
  // Call cloud funtion getOpenID
  wx.cloud.callFunction({
    name: 'getUserMenu',
    data: {},
    success: res => {
      console.log(res)
      // updateUserMenu(res.result.user_menu)
    },
    fail: err => {
      console.log('Get user menu FAILED: ', err)
    }
  })
}

function updateUserMenu(new_user_menu){
  if (new_user_menu){
    this.setData({
      user_menu :  new_user_menu
    })
  }
}