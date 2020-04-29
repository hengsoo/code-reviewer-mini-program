//index.js
const app = getApp()

Page({
  data: {
    menu : []
  },

  onLoad: function() {
    wx.redirectTo({
      url: '../code-view/code-view?file_id=ex2_抢劫啦.cpp_1587907657008_olBU54272sRsXbkwnGBzS2wSn4k4',
    })

    // this.getUserMenu()

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
    // Set latest file at top
    new_menu = new_menu.reverse()

    if (new_menu){
      this.setData({
        menu :  new_menu
      })
    }
  },

  addFile: function(){
    let input_file_content = ""
    let input_file_name = ""

    // Choose file
    wx.chooseMessageFile({
      count: 1,
      type: "file",
      success: res => {
        input_file_name = res.tempFiles[0].name
        // Read file 
        wx.getFileSystemManager().readFile({
          filePath: res.tempFiles[0].path,
          encoding:'utf-8',

          success: res => {
            console.log(res)
            input_file_content = res.data
            // Call cloud function addFile
            wx.cloud.callFunction({
              name: 'addFile',
              data: {
                file_name : input_file_name,
                file_content: input_file_content
              },
              success: res => {
                console.log(res)
                this.updateUserMenu(res.result.data.menu)
                console.log("Add file user menu updated")
              },
              fail: error => {
                console.error('Cloud addFile failed: ', error)
              }
            })
          },
          // Read file failed
          fali: error =>{
            console.error("Read file failed: ", error)
          }
        })
      },
      // Choose file failed
      fail: error =>{
        console.error("Choose file failed:", error)
      }
    })
  }

})
