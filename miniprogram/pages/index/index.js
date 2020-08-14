//index.js
Page({
  data: {
    is_guide: true,
    menu: [],
    recent_menu: [],
    show_more_action: false,
    current_menu_index: 0,
  },

  onLoad: function (e) {
    if (e.fromPage !== "guide") {
      /*wx.getStorage({
        key: 'isFirst',
        success(res){
          if (res.data){
            wx.navigateTo({
              url: '../guide/guide',
            })
          }
        },
        fail: error => {
          wx.navigateTo({
            url: '../guide/guide',
          })
        }
      });*/
      wx.cloud.callFunction({
        name: 'getUserSetting',
        data: {},
        success: res => {
          if (res.result.data.is_guide){
            wx.navigateTo({
              url: '../guide/guide',
            })
          }
        },
        fail: error => {
          console.log('cloud getUserSetting failed!')
        }
      })
    }
  },

  onShow: function () {
    this.getUserMenu()
  },

  getUserMenu: function () {
    // Call cloud funtion getOpenID
    wx.cloud.callFunction({
      name: 'getUserMenu',
      data: {},
      success: res => {
        this.updateUserMenu(res.result.data.menu)
        this.updateUserRecentMenu(res.result.data.recent_menu)
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

  updateUserRecentMenu: function(new_recent_menu) {
    new_recent_menu = new_recent_menu.reverse()
    
    if (new_recent_menu){
      this.setData({
        recent_menu: new_recent_menu
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

  onShareAppMessage: function (e) {
    if (e.from == 'button') {
      const current_menu_index = this.data.current_menu_index;
      return {
        title: '分享代码 ' + this.data.menu[current_menu_index].file_name,
        path: 'pages/code-view/code-view?file_id=' + this.data.menu[current_menu_index].file_id
         + '&file_name=' + this.data.menu[current_menu_index].file_name,
      }
    }
    else{
      // e.from == 'menu'
      return {
        title: '代码阅读器',
        path: 'pages/index/index',
      }
    }
  },

  // TODO: renameFile
  renameFile: function () {},

  deleteFile: function () {
    // Show loading
    wx.showLoading({ title: '文件删除中'})

    wx.cloud.callFunction({
      name: 'deleteFile',
      data: {
        file_id: this.data.menu[this.data.current_menu_index].file_id,
      },

      success: res => {
        console.log(res);
        this.updateUserMenu(res.result.data.menu);
        wx.hideLoading()
        this.showSuccessToast("删除成功")
      },

      fail: error => {
        this.showErrorToast("文件删除失败")
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
        // Filter file extension
        const file_extension = input_file_name.split(".").pop()
        // Check if file extension is forbidden
        if (app.globalData.forbidden_file_extensions.includes(file_extension)){
          this.showErrorToast("文件格式错误")
          throw Error('Invalid input file extension.')
        }

        // Show loading
        wx.showLoading({ title: '文件上传中'})
          
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
                wx.hideLoading()
                this.showSuccessToast("上传成功")
                console.log(res)
                this.updateUserMenu(res.result.data.menu)
                console.log("Add file user menu updated")
              },
              fail: error => {
                wx.hideLoading()
                this.showErrorToast("上传失败")
                console.error('Cloud addFile failed: ', error)
              }
            })
          },
          // Read file failed
          fali: error => {
            this.showErrorToast("文件阅读失败")
            console.error("Read file failed: ", error)
          }
        })
      },

      // Choose file failed
      fail: error => {
        console.error("Choose file failed:", error)
      }
    })
  },

  linkToGuide: function () {
    wx.navigateTo({
      url: '../guide/guide',
    })
  },

  showSuccessToast: function (title){
    wx.showToast({
      title: title,
      icon:'success',
      duration: 1500
    })
  },

  showErrorToast: function (title){
    wx.showToast({
      title: title,
      image: '../../images/index/icon_error.png',
      duration: 2000
    })
  }
  
})
