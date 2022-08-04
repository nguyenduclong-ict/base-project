import numeral from 'numeral'
import Vue from 'vue'
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


