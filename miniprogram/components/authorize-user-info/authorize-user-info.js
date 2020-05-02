const app = getApp()

Component({

  // Need this option to display properly
  options: {
    addGlobalClass: true
  },

  // show_dialog controls the visibility of the dialog
  data: {
    show_dialog: false
  },

  // Get userInfo when component is attached
  lifetimes: {
    attached: function() {
      if (app.globalData.user_info == null){
        this.getUserInfo()
      }
    }
  },
  
  // Component's methods
  methods: {

    getUserInfo: function(){
      wx.getUserInfo({
        success: res => {
          console.log("getUserInfo success")
          // Add userInfo to global data
          app.globalData.user_info = res.userInfo
        },
        fail: error =>{
          console.error("getUserInfo failed: ", error)
          // Call dialog to request user allow authentication
          this.setData({
            show_dialog: true
          })
        }
      })
    },

    close(event) {
      const { type } = event.currentTarget.dataset;
      if ( type === 'close') {
        // Set dialog to hidden
        this.setData({
          show_dialog: false
        });
        // Get user info 
        this.getUserInfo()
      }
    }
  }
  
})
