//index.js
const app = getApp()

Page({
  mixins: [require('../../mixin/themeChanged')],
  data: {
    menu: [],
    show_more_action: false,
    current_menu_index: 0,
  },

  onLoad: function() {
    this.getUserMenu()
  },

  getUserMenu: function () {
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

  updateUserMenu: function (new_menu) {
    // Set latest file at top
    new_menu = new_menu.reverse()

    if (new_menu) {
      this.setData({
        menu: new_menu
      })
    }
  },

  moreAction: function (e) {
    this.setData({
      show_more_action: true,
      current_menu_index: e.currentTarget.dataset.operation,
    })
  },

  cancelActionSheet: function () {
    this.setData({
      show_more_action: false,
    })
  },

  onShareAppMessage: function () {
    const current_menu_index = this.data.current_menu_index;
    return {
      title: '分享代码 ' + this.data.menu[current_menu_index].file_name,
      path: 'pages/code-view/code-view?file_id=' + this.data.menu[index].file_id,
    }
  },

  reName: function () {

  },

  delete: function () {
    console.log(this.data.menu)
    wx.cloud.callFunction({
      name: 'deleteFile',
      data: {
        file_id: this.data.menu[this.data.current_menu_index].file_id,
      },
      success: res => {
        console.log(res);
        this.getUserMenu();
      },
      fail: error => {
        console.log('Cloud deleteFile failed', error)
      },
    })
  },
  
  addFile: function () {
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
          encoding: 'utf-8',

          success: res => {
            console.log(res)
            input_file_content = res.data
            // Call cloud function addFile
            wx.cloud.callFunction({
              name: 'addFile',
              data: {
                file_name: input_file_name,
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
          fali: error => {
            console.error("Read file failed: ", error)
          }
        })
      },
      // Choose file failed
      fail: error => {
        console.error("Choose file failed:", error)
      }
    })
  }
})
