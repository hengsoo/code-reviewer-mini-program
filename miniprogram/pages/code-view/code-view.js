const app = getApp()

Page({
  data: {
    file_id: null,
    code: []
  },
  onLoad: function(options) {
    console.log('called');
    this.setData({
      file_id: options.file_id
    })
    console.log(this.data.file_id)
    this.getCode()
  },
  getCode: function() {
    wx.cloud.callFunction({
      name: 'getCode',
      data:{
        file_id: this.data.file_id,
      },
      success: res => {
        console.log(res)
        /*this.setData({
          code: res.result
        })*/
      }
    })
  }
})