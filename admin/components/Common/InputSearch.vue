<template>
  <el-input
    v-model="value"
    :placeholder="placeholder"
    :prefix-icon="loading ? 'el-icon-loading' : 'el-icon-search'"
    @input="onInput"
  ></el-input>
</template>

<script>
import _ from '~/utils/lodash'
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Nhập để tìm kiếm',
    },
    loading: Boolean,
    debounce: {
      type: Number,
      default: 300,
    },
  },

  data() {
    return {
      value: '',
      onInput: null,
    }
  },

  created() {
    this.onInput = _.debounce(this._onInput, this.debounce)
  },

  methods: {
    _onInput(value) {
      this.$emit('search', value)
    },
  },
}
</script>

<style lang="scss" scoped></style>
