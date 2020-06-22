// components/search-input/search-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden:{
      type:Boolean,
      value:true,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    string_to_search: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    searchNext(e){
      this.triggerEvent("stringChange",this.data.string_to_search);
    },
    onInputChange(e){
      this.setData({
        string_to_search: e.detail.value,
      })
    }
  }
})
