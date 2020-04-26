const app = getApp()

Page({
  data: {
    file_id: null,
    code: [],
    reviews: []
  },

  onLoad: function(options) {
    this.setData({
      file_id: options.file_id
    });
    this.setCodeAndReviews();
  },

  setCodeAndReviews: function() {
    console.log('Getting program file: ');
    console.log(this.data.file_id);

    wx.cloud.callFunction({
      name: 'getProgramFile',
      data:{
        file_id: this.data.file_id,
      },

      success: res => {
        console.log(res)
        var program_file_code = res.result.data.code;
        this.setData({
          code: program_file_code
        })
      },

      fail: error =>{
        console.error('Cloud getProgramFile failed', error)
      }
    })
    
  }
})