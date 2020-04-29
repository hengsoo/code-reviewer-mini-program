const app = getApp()

Page({
  data: {
    file_id: null,
    code: [],
    reviews: [],
    username: "",
    user_avatar_url: ""
  },

  onLoad: function(options) {
    this.setData({
      file_id: options.file_id
    });

    this.setCodeAndReviews();
  },

  onShow: function(){
    if (app.globalData.user_info != null){
      this.setData({
        username: app.globalData.user_info.nickName,
        user_avatar_url: app.globalData.user_info.avatarUrl
      });
    }
  },

  setCodeAndReviews: function() {
    console.log('Getting program file: ');
    console.log(this.data.file_id);

    wx.cloud.callFunction({
      name: 'getProgramFile',
      data:{
        file_id: this.data.file_id,
      },
      
      // Get programFile sucess
      success: res => {

        if( Object.keys(res.result).length === 0 ){
          console.log("Empty result")
          wx.redirectTo({
            url: '../index/index',
          })
        }

        const program_file_code = res.result.data.code;
        const program_file_reviews = res.result.data.reviews;

        this.setData({
          code: program_file_code,
          reviews: program_file_reviews
        })

        // console.log(this.data.reviews)
        // console.log(this.data.)
      },

      // Get programFile failed
      fail: error =>{
        console.error('Cloud getProgramFile failed', error)
      }
    }) 
  }

})
