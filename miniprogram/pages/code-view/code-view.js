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
      name: 'getProgramFile',
      data:{
        file_id: this.data.file_id,
      },
      success: res => {
        console.log(res.result)
        var new_code = res.result.data.code;
        let len = new_code.length
        /*for (let j = 0; j < len; j++) {
          new_code[j] = new_code[j].replace(/\s+/g,"&npsp;");
        }*/
        this.setData({
          code: new_code
        })
        console.log(this.data.code)
      },
      fail: error =>{
        console.error('Cloud getProgramFile failed')
      }
    })
  }
})