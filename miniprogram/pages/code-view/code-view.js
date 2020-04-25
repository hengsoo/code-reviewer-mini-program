const app = getApp()

Page({
  data: {
    file_id: null,
    code: []
  },
  onLoad: function(options) {
    this.setData({
      file_id: options.file_id
    });
    this.getCode();
  },
  getCode: function() {
    console.log('to cloud');
    console.log(this.data.file_id);
    wx.cloud.callFunction({
      name: 'getCode',
      data:{
        file_id: this.data.file_id,
      },
      success: res => {
        console.log(res)
        this.setData({
          code: res.result
        })
      },
      fail: error =>{
        console.error('Cloud getCode failed')
      }
    })
  }
})