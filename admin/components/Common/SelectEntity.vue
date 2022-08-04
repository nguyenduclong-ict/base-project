<template>
  <el-select
    v-model="_value"
    :placeholder="placeholder"
    filterable
    :multiple="multiple"
    :filter-method="handleFilter"
    @visible-change="(v) => v && fetchData()"
  >
    <el-option
      v-for="(option, index) in data"
      :key="getOptionKey(option, index)"
      :label="getOptionLabel(option)"
      :value="getOptionValue(option)"
    ></el-option>
  </el-select>
</template>

<script>
import _ from '~/utils/lodash'
import { buildQueryUrl } from '~/utils/request'

export default {
  props: {
    value: { type: null, default: null },
    placeholder: String,
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

  data() {
    return {
      data: [],
    }
  },

  computed: {
    _value: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      },
    },
  },

  created() {
    this.data = [...this.dataSource]
    this.fetchSelectedOptions()
    this.handleFilter = this.config?.endpoint
      ? _.debounce(this._handleFilter, 300)
      : null
  },

  methods: {
    async fetchSelectedOptions() {
      if (!this.config.endpoint) return []
      const selectedOptions = []
      if (this.value) {
        if (this.multiple && Array.isArray(this.value))
          selectedOptions.push(...this.value)
        else selectedOptions.push(this.value)
      }

      if (!selectedOptions.length) return []

      try {
        const response = await this.$axios.$get(
          buildQueryUrl(this.config.endpoint, {
            ...this.config.payload,
            'query[id][$in]': selectedOptions,
          })
        )

        this.data.push(...response)
      } catch (error) {}
    },

    async fetchData(overidePayload) {
      try {
        const response = await this.$axios.$get(
          buildQueryUrl(this.config.endpoint, {
            ...this.config.payload,
            ...overidePayload,
          })
        )

        this.data = response.data || response
      } catch (error) {
        console.log('fetchData Error', error)
      }
    },

    _handleFilter(query) {
      this.fetchData({ search: query })
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
