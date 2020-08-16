// TODO: remove item from usermenu and recent menu if file doesn't exixts

const app = getApp()

Page({
  data: {
    //Announcement Bar
    show_announcement: true,
    // Program file data
    file_id: null,
    file_openid: '',
    file_name: "",
    language: "",
    code: [],
    reviews: [],
    // User info
    username: "",
    user_avatar_url: "",
    // Review input data
    show_review_input: false,
    review_input_line_number: 0,
    // Review actionsheet data
    show_review_action_sheet: false,
    review_action_sheet_review_id : "",
    // Authorize getUserInfo
    show_login_button : false
  },

  onLoad: function(options) {
    this.setData({
      file_id: options.file_id,
      file_name: options.file_name
    });

    wx.setNavigationBarTitle({
      title: this.data.file_name
    })

    // Update user recent menu after displaying code
    this.displayCodeAndReviews().then(result=>{
      this.updataUserRecentMenu()
    })
  },

  onShow: function(){
    if (app.globalData.user_info != null){
      this.setData({
        username: app.globalData.user_info.nickName,
        user_avatar_url: app.globalData.user_info.avatarUrl
      });
    }
  },

  closeAnnouncement: function(){
    this.setData({
      show_announcement: false
    })
  },

  displayCodeAndReviews: function() {
    return new Promise( (resolve, reject) => {
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
          
          const program_file_openid = res.result.data._openid
          const program_file_code = res.result.data.code
          const program_file_reviews = res.result.data.reviews
          const program_language = res.result.data.language

          this.setData({
            file_openid: program_file_openid,
            language: program_language,
            code: program_file_code,
            reviews: program_file_reviews,
          })
          return resolve()
        },
        // Get programFile failed
        fail: error =>{
          return reject('[CLOUD] [getProgramFile] FAILED:', error)
        }
      }) 
    })
    
  },

  updataUserRecentMenu: function() {
    if (this.data.file_openid != app.globalData.openid){
      wx.cloud.callFunction({
        name: 'updateUserRecentMenu',
        data:{
          file_id: this.data.file_id,
          file_name: this.data.file_name,
          file_openid: this.data.file_openid,
          language: this.data.language,
        },
        fail: error => {
          console.error('[CLOUD] [updateUserRecentMenu] FAILED:', error)
        }
      })
      
    }
  },

  launchReviewInput(event){

    // Get user info if it is null
    if (app.globalData.user_info == null){
      console.log("Review requires user login.")
      this.getUserInfo()
          // Show review input if success
          .then( result => {
            this.showReviewInput(event)
          })
          // Hide review input if user is not logged in
          .catch( error => {
            return null
          })
    }
    // Else just show the review input
    else {
      this.showReviewInput(event)
    }
  },

  showReviewInput(event){
    const line_number = event.currentTarget.id
    this.setData({
      show_review_input:true,
      review_input_line_number: line_number
    })
  },

  updateReviews(event){
    const new_reviews = event.detail.reviews
    this.setData({
      reviews: new_reviews
    })
  },
  
  launchReviewActionSheet(event){
    const review_author_openid = event.currentTarget.dataset.reviewAuthorOpenid
    const review_id = event.currentTarget.dataset.reviewId
    const file_author_openid = this.data.file_openid

    // Check if user is review's author or file owner
    if ( review_author_openid === app.globalData.openid || 
         file_author_openid === app.globalData.openid){
      this.setData({
        show_review_action_sheet: true,
        action_sheet_review_id: review_id
      })
    }
  },

  reviewActionSheetTap(event){
    const file_id = this.data.file_id
    const review_id =  this.data.action_sheet_review_id
    const value = event.detail.value

    if ( value == 'delete' ) {

      // Call delete reivew cloud function
      wx.cloud.callFunction({
        name: 'deleteReview',
        data:{
          review_id: review_id,
          file_id: file_id
        },
        
        // Delete success
        success: res => {
          const updated_review = {
            detail: { reviews: res.result }
          }
          this.updateReviews(updated_review)
          this.setData({
            show_review_action_sheet: false,
            review_action_sheet_review_id: ""
          })
        },
        // Delete fail
        fail: error => {
          console.error("[CLOUD] [deleteReview] FAILED:", error)
        }
      })

    }
  },

  onShareAppMessage: function (event) {
    return {
      title: '分享代码 ' + this.data.file_name,
      path: 'pages/code-view/code-view?file_id=' + this.data.file_id
      + '&file_name=' + this.data.file_name,
    }
  },

  getUserInfo: function(event) {
    return new Promise( (resolve, reject) => {
      // Get user info
      wx.getUserInfo({
        success: res => {
          console.log("getUserInfo success")
          // Add userInfo to global data
          app.globalData.user_info = res.userInfo
          return resolve()
        },
        fail: error =>{
          console.error("[LOCAL] [getUserInfo] FAILED:", error)
          this.setData({
            show_login_button: true
          })
          return reject()
        }
      })

    })
  },

})
