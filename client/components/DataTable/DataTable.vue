<template>
  <div class="data-table">
    <el-table border class="data-table" :data="data" ref="table">
      <template v-for="col in columns">
        <slot v-if="col.type === 'slot'" :name="`column-${col.prop}`"></slot>
        <el-table-column
          v-else
          :key="col.key || col.prop"
          v-bind="col"
        ></el-table-column>
      </template>
    </el-table>

    <el-pagination
      class="mt-2"
      hide-on-single-page
      background
      layout="sizes, ->, prev, pager, next"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pager.pageSize"
      :page-count="pager.totalPages"
      :current-page="pager.page"
      :total="pager.total"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import * as qs from 'qs'
import pick from 'lodash/pick'
export default {
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      data: [],
      pager: {
        page: 1,
        pageSize: 20,
        totalPages: 1,
        total: 0,
        ...pick(this.config.payload, ['page', 'pageSize']),
      },
      fetching: false,
      loading: null,
    }
  },

  computed: {
    columns() {
      return this.config.columns || []
    },
  },

  watch: {
    dataSource: {
      immediate: true,
      handler(value) {
        this.data = [...value]
      },
    },
    fetching(value) {
      if (value && !this.loading) {
        this.loading = this.$loading({
          target: this.$el.querySelector('.el-table__body-wrapper'),
        })
      } else {
        this.loading && this.loading.close()
        this.loading = null
      }
    },
  },

  created() {
    this.config.payload = this.config.payload || {}
    this.fetchData()
  },

  methods: {
    async fetchData(overridePayload = {}) {
      if (!this.config.endpoint) return false

      this.fetching = true

      try {
        const { payload } = this.config

        const response = await this.$axios.$get(
          this.config.endpoint +
            qs.stringify(
              {
                ...payload,
                ...overridePayload,
                ...this.pager,
              },
              { encode: false, addQueryPrefix: true }
            )
        )

        const { data, ...pager } = response
        this.data = data
        this.pager = pager
        Object.assign(payload, pager)
      } catch (error) {
        console.log(`fetchData error`, error)
      }

      this.fetching = false
    },
    handlePageChange(page) {
      this.pager.page = page
      this.fetchData()
    },
    handleSizeChange(size) {
      const currentOffset = (this.pager.page - 1) * this.pager.pageSize
      this.pager.page = Math.max(1, Math.floor(currentOffset / size))
      this.pager.pageSize = size
      this.fetchData()
    },
  },
}
</script>

<style lang="scss">
.data-table {
  .el-table__header,
  .el-table__body {
    width: 100% !important;
  }
}
</style>
