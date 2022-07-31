import Vue from 'vue'
import Avatar from '@/components/Common/Avatar.vue'
import _ from '~/utils/lodash'

Vue.mixin({
  data() {
    const data = { _ }
    return data
  },

  methods: {
    validateForm(form) {
      return new Promise((resolve) => {
        form.validate((valid) => {
          resolve(valid)
        })
      })
    },
    showConfirm(...args) {
      return new Promise(resolve => {
        this.$confirm(...args).then(() => resolve(true)).catch(() => resolve(false))
      })
    }
  },
})

// register global components
Vue.component('Avatar', Avatar)
