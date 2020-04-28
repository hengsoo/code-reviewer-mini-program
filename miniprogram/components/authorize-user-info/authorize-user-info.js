const app = getApp()

Component({
  options: {
    addGlobalClass: true
  },

  data: {
    show_dialog: false
  },

  lifetimes: {
    attached: function() {
      console.log("BABABA")
      this.getUserInfo()
    }
  },
  
  methods: {
    getUserInfo: function(){
      wx.getUserInfo({
        success: res => {
          console.log("getUserInfo success")
          app.globalData.user_info = res.userInfo
        },
        fail: error =>{
          console.error("getUserInfo failed: ", error)
          this.setData({
            show_dialog: true
          })
        }
      })
    },

    close(event) {
      const { type } = event.currentTarget.dataset;
      if ( type === 'close') {
        this.setData({
          show_dialog: false
        });
        this.getUserInfo()
      }
    }
  }
  
})
