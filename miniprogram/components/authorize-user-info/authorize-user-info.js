const app = getApp()

Component({

  // Need this option to display properly
  options: {
    addGlobalClass: true
  },

  // show_dialog controls the visibility of the dialog
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },

  // Component's methods
  methods: {
    close(event) {
      const { type } = event.currentTarget.dataset;
      if ( type === 'close' || type === 'tap') {
        // Set dialog to hidden
        this.setData({
          show: false
        });
      }
    }
  }
  
})
