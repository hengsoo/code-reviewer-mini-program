const app = getApp()

Page({
  data: {
    file_id: null,
    file_name:"",
    code: [],
    reviews: [],
    username: "",
    user_avatar_url: "",
    show_review_input: false,
    review_input_line_number: 0,
    review_id : "",
    show_action_sheet: true,
    action_sheet_review_line_number: 0,
    action_sheet_review_index: 0
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
      show_review_input:true,
      review_input_line_number: line_number
    })
  },

  updateReviews(event){
    console.log(event)
    const new_reviews = event.detail.reviews
    this.setData({
      reviews: new_reviews
    })
  },
  
  launchReviewActionSheet(event){
    const line_number = event.currentTarget.dataset.reviewLine
    const review_index =  event.currentTarget.dataset.reviewIndex
    const review_author_openid = event.currentTarget.dataset.reviewAuthorOpenid
    const review_id = event.currentTarget.dataset.reviewId

    // Check if user is review's author
    if ( review_author_openid === app.globalData.openid){
      this.setData({
        show_action_sheet: true,
        action_sheet_review_line_number: line_number,
        action_sheet_review_index: review_index,
        review_id: review_id
      })
    }
  },

  actionSheetTap(event){
    const review_index =  this.data.action_sheet_review_index
    const review_line_number = this.data.action_sheet_review_line_number
    const review_id =  this.data.review_id
    const value = event.detail.value

    if ( value == 'delete' ) {
      console.log("delete", review_line_number,review_index)
      // Call delete reivew cloud function
      wx.cloud.callFunction({
        name: 'deleteReview',
        data:{
          review_id: review_id,
          file_id: this.data.file_id,
          line_number: review_line_number,
          index: review_index
        },
        
        // Delete success
        success: res => {
          console.log(res)
          this.triggerEvent('updateReviews', {
            reviews: res.result
          })
        },
        // Delete fail
        fail: error => {
          console.error("Delete review failed: ", error)
        }
      })

    }
  }

})
