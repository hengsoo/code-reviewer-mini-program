// guide.js
const app = getApp()

Page({
  data: {
    images: [
      "http://m.qpic.cn/psc?/V52JfBFy21diKU3aYeRE1uG3Wa1XUqDv/bqQfVz5yrrGYSXMvKr.cqSXzw5NBiKOYfXwtFeEdQP*4QKDnxsWRi2KIBtxSnFMEB6DNt9h55.PxVp3CEuAUHif.0nvWWRDfhTeLl1LMXCc!/b",
      "http://m.qpic.cn/psc?/V52JfBFy21diKU3aYeRE1uG3Wa1XUqDv/TmEUgtj9EK6.7V8ajmQrEJdVtnh*huv6yCD5n*Gj89OfYW67Kwgy0t02WPs5u3qe5Ddc38TNvt*OtI1Mr4ld67mfNsvQoRtVUZmQW4VKMpY!/b",
      "http://m.qpic.cn/psc?/V52JfBFy21diKU3aYeRE1uG3Wa1XUqDv/TmEUgtj9EK6.7V8ajmQrEJb2WX**0q4rfcXss9FGIXgH7ufiFXVJAZJEDt.kOkIix*4p4Fq8ok335kFkw7VFQ6NUIiwGL1L46jldrgvTvo0!/b",
      "http://m.qpic.cn/psc?/V52JfBFy21diKU3aYeRE1uG3Wa1XUqDv/TmEUgtj9EK6.7V8ajmQrEBr.X86Ch9tWDo2QJkvujLjMUd5y4tsXFK8qzhSv5ZGkRktseGa9SeP2Jny.Wi4GKdGjjCPgUH0vOVtkJl.OLZA!/b",
    ],
    // Default value will be false
    display_guide_on_launch: false,
  },

  // When page closes
  onUnload(){
     // Update user settings
     wx.cloud.callFunction({
      name: 'setUserSettings',
      data: {
        display_guide_on_launch: this.data.display_guide_on_launch
      },
    })
    // Update local settings
    app.globalData.user_settings.display_guide_on_launch = this.data.display_guide_on_launch;
  },

  onRedirectToHomePage() {
    wx.redirectTo({
      url: '../index/index',
    })
  },

  checkboxChange(event) {
    this.setData({
      display_guide_on_launch: !this.data.display_guide_on_launch,
    })
  },
})
