const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },

  lifetimes: {
    attached: function() {
      console.log("banana")
      if (!app.globalData.user_info){
        this.setData({
          show: true
        })
      }
    },
  },
  
  methods: {
    close(e) {
      const { type } = e.currentTarget.dataset;

      if ( type === 'close') {
        this.setData({
          show: false
        }); // 关闭弹窗回调事件
        
        // Custom authorize getUserInfo Logic       
        // const app = getApp()
        // app.globalData.request_authorize_user_info_dialog = false
        this.triggerEvent('close');

        wx.getUserInfo({
          success: res => {
              console.log(res)
              console.log('user name: ', res)
              // this.data.userInfo = res.userInfo;
              // app.globalData.username = res.result.openid
          },
          fail: err => {
            console.error('[CLOUD] [getUserInfo] FAILED: ', err)
            this.setData({
              show: true
            })
          }
        })
      }
   }
  }
})
