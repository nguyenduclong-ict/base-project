import Vue from 'vue'
import numeral from 'numeral'
import Avatar from '@/components/Common/Avatar.vue'
import _ from '~/utils/lodash'

Vue.mixin({
  filters: {
    money(value, unit = "đ") {
      return value && (numeral(value).format('0,0.[0]') + ' ' + unit)
    }
  },

  data() {
    const data = { u: _ }
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
