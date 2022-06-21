import Vue from 'vue'

Vue.mixin({
  methods: {
    validateForm(form) {
      return new Promise((resolve) => {
        form.validate((valid) => {
          resolve(valid)
        })
      })
    },
  },
})
