//index.js
const app = getApp();

Page({
  data: {
    is_guide: true,
    menu: [],
    recent_menu: [],
    show_more_action: false,
    selected_menu_index: 0,
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
      },
      fail: error => {
        console.error('[CLOUD] [getUserMenu] FAILED:', error)
      }
    })
  },

  // Refresh local menu
  updateUserMenu: function (new_menu) {
    // Sort files by latest
    new_menu = new_menu.reverse()

    if (new_menu) {
      this.setData({
        menu: new_menu
      })
    }
  },

  // Refresh local recent menu
  updateUserRecentMenu: function (new_recent_menu) {
    // Sort files by latest
    new_recent_menu = new_recent_menu.reverse()

    if (new_recent_menu) {
      this.setData({
        recent_menu: new_recent_menu
      })
    }
  },

  // When more action menu is launched
  moreAction: function (event) {
    this.setData({
      show_more_action: true,
      selected_menu_index: event.currentTarget.dataset.operation,
    })
  },

  cancelMoreAction: function () {
    this.setData({
      show_more_action: false,
    })
  },

  onShareAppMessage: function (event) {
    // If item is shared via action menu of file
    if (event.from == 'button') {
      const selected_menu_index = this.data.selected_menu_index;
      return {
        title: '分享代码 ' + this.data.menu[selected_menu_index].file_name,
        path: 'pages/code-view/code-view?file_id=' + this.data.menu[selected_menu_index].file_id +
          '&file_name=' + this.data.menu[selected_menu_index].file_name,
      }
    }
    // Share App
    else {
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
    wx.showLoading({
      title: '文件删除中'
    })

    wx.cloud.callFunction({
      name: 'deleteFile',
      data: {
        file_id: this.data.menu[this.data.selected_menu_index].file_id,
      },

      success: res => {
        this.updateUserMenu(res.result.data.menu)
        wx.hideLoading()
        this.showSuccessToast("删除成功")
      },

      fail: error => {
        this.showErrorToast("文件删除失败")
        console.error('[CLOUD] [deleteFile] FAILED:', error)
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
        if (app.globalData.forbidden_file_extensions.includes(file_extension)) {
          this.showErrorToast("文件格式错误")
          throw Error('Invalid input file extension.')
        }

        // Show loading
        wx.showLoading({
          title: '文件上传中'
        })

        // Read file 
        wx.getFileSystemManager().readFile({
          filePath: res.tempFiles[0].path,
          encoding: 'utf-8',

          success: res => {
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
                this.updateUserMenu(res.result.data.menu)
              },
              fail: error => {
                wx.hideLoading()
                this.showErrorToast("上传失败")
                console.error('[CLOUD] [addFile] FAILED: ', error)
              }
            })
          },
          // Read file failed
          fali: error => {
            this.showErrorToast("文件阅读失败")
            console.error('[LOCAL] [readFile] FAILED: ', error)
          }
        })
      },

      // Choose file failed
      fail: error => {
        console.error("[LOCAL] [chooseFile] FAILED: ", error)
      }
    })
  },

  redirectToGuide: function () {
    wx.redirectTo({
      url: '../guide/guide',
    })
  },

  showSuccessToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 1500
    })
  },

  showErrorToast: function (title) {
    wx.showToast({
      title: title,
      image: '../../images/index/icon_error.png',
      duration: 2000
    })
  }

})
