const app = getApp()

Page({
  data: {
    file_id: null,
    file_name:"",
    code: [],
    reviews: [],
    username: "",
    user_avatar_url: "",
    show_input: false,
    line_number: 6
  },

  onLoad: function(options) {
    this.setData({
      file_id: options.file_id,
      file_name: options.file_name
    });

    wx.setNavigationBarTitle({
      title: this.data.file_name
    })

    this.displayCodeAndReviews();
  },

  onShow: function(){
    if (app.globalData.user_info != null){
      this.setData({
        username: app.globalData.user_info.nickName,
        user_avatar_url: app.globalData.user_info.avatarUrl
      });
    }
  },

  displayCodeAndReviews: function() {
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

      },

      // Get programFile failed
      fail: error =>{
        console.error('Cloud getProgramFile failed', error)
      }
    }) 
  },

  launchReviewInput(event){
    const line_number = event.currentTarget.id
    console.log("Long pressed line ", line_number)
    this.setData({
      show_input:true,
      line_number: line_number
    })
  },

  updateReviews(event){
    const new_reviews = event.detail.reviews
    this.setData({
      reviews: new_reviews
    })
  }
  
})
