<template>
  <el-select v-model="_value" @visible-change="(v) => v && fetchData()">
    <el-option
      v-for="(option, index) in data"
      :key="getOptionKey(option, index)"
      :label="getOptionLabel(option)"
      :value="getOptionValue(option)"
    ></el-option>
  </el-select>
</template>

<script>
import qs from 'qs'

export default {
  props: {
    value: { default: null },
    config: {
      type: Object,
      default: () => ({}),
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    this.data = [...this.dataSource]
    this.fetchSelectedOptions()
  },

  data() {
    return {
      data: [],
    }
  },

  computed: {
    _value: {
      get(v) {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      },
    },
  },

  methods: {
    async fetchSelectedOptions() {
      if (!this.config.endpoint) return []
      const selectedOptions = []
      if (this.value) {
        if (this.multiple && Array.isArray(this.value))
          selectedOptions.push(...this.multiple)
        else selectedOptions.push(this.value)
      }

      if (!selectedOptions.length) return []

      try {
        const queryString = qs.stringify(
          {
            ...this.config.payload,
            'query[id][$in]': selectedOptions,
          },
          { encode: false }
        )

        const response = await this.$axios.$get(
          this.config.endpoint + '?' + queryString
        )

        this.data.push(...response)
      } catch (error) {}
    },

    async fetchData() {
      console.log('fetchData')

      try {
        const queryString = qs.stringify(
          {
            ...this.config.payload,
          },
          { encode: false }
        )

        const response = await this.$axios.$get(
          this.config.endpoint + '?' + queryString
        )

        console.log(response)

        this.data.push(...response)
      } catch (error) {
        console.log('fetchData Error', error)
      }
    },

    getOptionKey(option, index) {
      return option?.id || option?.key || index
    },
    getOptionLabel(option) {
      if (typeof option === 'string') return option
      return option[this.config.labelKey || 'name']
    },
    getOptionValue(option) {
      if (typeof option === 'string') return option
      return option[this.config.valueKey || 'id']
    },
  },
}
</script>

<style lang="scss" scoped></style>
