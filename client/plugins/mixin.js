import Vue from 'vue'
import Avatar from '@/components/Common/Avatar.vue'

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

// register global components
Vue.component('Avatar', Avatar)
