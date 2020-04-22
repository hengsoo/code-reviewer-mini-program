//index.js
const app = getApp()

Page({
  data: {
    menu : []
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
      updateUserMenu(res.result.menu)
    },
    fail: err => {
      console.log('Get user menu FAILED: ', err)
    }
  })
}

function updateUserMenu(new_menu){
  if (new_menu){
    this.setData({
      menu :  new_menu
    })
  }
}