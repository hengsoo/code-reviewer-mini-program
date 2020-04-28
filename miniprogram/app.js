//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'code-reviewer',
        traceUser: true,
      })
    }

    this.globalData = {
      request_authorize_user_info_dialog : false
    }

    this.setOpenID()
  },

  setOpenID: function() {
    // Call cloud funtion getOpenID
    wx.cloud.callFunction({
      name: 'getOpenID',
      data: {},
      success: res => {
        console.log('user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[CLOUD] [getOpenID] FAILED: ', err)
      }
     })
  }

})
