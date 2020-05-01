const app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    // The reviewd line number
    line: {
      type: Number,
      value: 0,
    },
    // The reviewed code
    code:{
      type: String,
      value: ""
    }
  },

  data:{
    show : false,
    focus: false,
    review_type: "comment",
    review_content: "",
    textarea_cursor: -1,
    line: 0
  },

  attached: function() {
    this.setData({
      show: this.properties.show,
    })
  },

  // When values in data change
  observers: {
    'show': function(show) {
      // Keep review content if line number is same as previous
      if ( show == true ){
        if ( this.properties.line != this.data.line){
          this.setData({
            review_content: "",
           line: this.properties.line
          })
        }
      }
    }
  },

  methods: {
    close(event) {
      const { type } = event.currentTarget.dataset;
      if ( type === 'close') {
        this.setData({
          show: false
        });
      }
    },

    // When user inputs something
    onInputChanged(event) {
      console.log("Input changed")
      this.setData({
        review_content: event.detail.value,
        textarea_cursor: event.detail.cursor
      })
    },

    // When user changes review type
    typeButtonTap(event){
      const type = event.currentTarget.dataset.type
      // Default type be comment
      let new_type = 'comment'
      if (type != this.data.review_type){
        new_type = type
      }
      this.setData({
        review_type: new_type
      })
    },

    // TODO: solve finding current cursor position when there is no input
    //        (current wechat doesn't support this feature)
    // LIMITATIONS: new cursor position doesn't work in mobile when 'show' value doesn't change.
    assistButtonTap(event) {
      const assist_input = event.currentTarget.dataset.assistInput
      const assist_input_length = assist_input.length
      const new_review_content = 
        this.data.review_content.slice(0, this.data.textarea_cursor) 
        + assist_input + this.data.review_content.slice(this.data.textarea_cursor);

      // Set new cursor position
      let new_cursor_position = this.data.textarea_cursor
      // ; _ < >
      if ( assist_input_length == 1){
        new_cursor_position += 1
      }
      // {  } {  } [  ]
      else if ( assist_input_length == 4) {
        new_cursor_position += 2
      }

      this.setData({
        focus: true,
        textarea_cursor: new_cursor_position,
        review_content: new_review_content
      })
    },

    submitContent(event){
      const review_type = this.data.review_type
      const review_author_name = app.globalData.user_info.nickName
      const review_author_avatar_url = app.globalData.user_info.avatarUrl
      const line_number = this.data.line
      const review_content = this.data.review_content

      console.log("Submit review")
      wx.cloud.callFunction({
        name: 'addReview',
        data: {
          line: line_number,
          type: review_type,
          author_name: review_author_name,
          author_avatar_url: review_author_avatar_url,
          content: review_content
        },
        success: res => {
          console.log(res)
          
        },
        fail: error => {
          console.error('Add review FAILED: ', error)
        }
      })
    }

  }
});
