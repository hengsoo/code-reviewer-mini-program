//index.js
const app = getApp()

Page({
  data: {
  },

  onLoad: function() {
    setOpenID();
  },

})

function setOpenID() {
  // Call cloud funtion getOpenID
  wx.cloud.callFunction({
    name: 'getOpenID',
    data: {},
    success: res => {
      console.log('[云函数] [getOpenID] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid
    },
    fail: err => {
      console.error('[云函数] [getOpenID] 调用失败', err)
    }
  })
}