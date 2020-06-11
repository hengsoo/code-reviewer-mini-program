//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } 
    
    else {
      wx.cloud.init({
        env: 'code-reviewer',
        traceUser: true,
      })
    }

    this.globalData = {
      // user_info contains avatarUrl, city, country, gender, language, nickName, province
      user_info: null,
      openid: null,
      forbidden_file_extensions: ["aid","cda","mid","midi","mp3","mpa","ogg","wav","wma","wpl","7z",
      "arj","deb","pkg","rar","rpm","gz","z","zip","tar","bin","dmg","iso","toast","vcd","mdb","email",
      "eml","emlx","apk","exe","msi","ttf","fnt","fon","otf","ai","bmp","gif","ico","jpeg","jpg","png",
      "ps","psd","svg","tif","tiff","key","odp","pps","ppt","pptx","ods","xls","xlsm","xlsx","avi","mp4",
      "mov","mpg","wmv","mkv","flx","doc","docx","odt","pdf","rtf","wpd"]
    }
    
    this.setOpenID()
  },

  setOpenID: function() {
    // Call cloud funtion getOpenID
    wx.cloud.callFunction({
      name: 'getOpenID',
      data: {},
      success: res => {
        console.log('user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[CLOUD] [getOpenID] FAILED: ', err)
      }
     })
  }

})
