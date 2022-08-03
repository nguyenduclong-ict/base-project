<template>
  <div class="data-table">
    <el-table ref="table" border class="data-table" :data="data">
      <template v-for="col in columns">
        <slot v-if="col.type === 'slot'" :name="`column-${col.prop}`"></slot>
        <el-table-column
          v-else-if="col.type === 'controls'"
          :key="col.key || col.prop || 'controls'"
          label="Thao tác"
          v-bind="getControlsColumnProps(col)"
        >
          <template slot-scope="{ row }">
            <el-button
              v-for="button in col.buttons"
              :key="button"
              v-bind="getButtonProps(button)"
              @click="handleControl(button, row)"
            ></el-button>
          </template>
        </el-table-column>
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
import pick from 'lodash/pick'
import { getMongoId } from '~/utils'
import { buildQueryUrl } from '~/utils/request'
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
          buildQueryUrl(this.config.endpoint, {
            ...payload,
            ...overridePayload,
            ...this.pager,
          })
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

    handleControl(button, row) {
      switch (button) {
        case 'delete':
          this.deleteRow(row)
          break

        default:
          this.$emit(button, row)
          break
      }
    },

    async deleteRow(row) {
      try {
        const agree = await this.showConfirm(
          'Bạn có chắc chắn muốn xóa dữ liệu?',
          'Chú ý',
          {
            confirmButtonText: 'Xóa',
            confirmButtonClass: 'el-button--danger',
            type: 'warning',
          }
        )

        if (agree) {
          const { deletedCount } = await this.$axios.$delete(
            buildQueryUrl(this.config.endpoint + '/' + row.id, {
              shop: getMongoId(row.shop),
            })
          )
          if (deletedCount > 0) {
            this.$message.success('Xóa thành công')
            this.fetchData()
          } else {
            throw new Error(`deletedCount = 0`)
          }
        }
      } catch (error) {
        console.error(`deleteRow error`, error)
        this.$message.error('Xóa không thành công')
      }
    },

    getButtonProps(button) {
      const props = {
        size: 'mini',
        class: 'icon',
      }
      switch (button) {
        case 'delete':
          Object.assign(props, {
            type: 'danger',
            icon: 'el-icon-delete',
          })
          break

        case 'edit':
          Object.assign(props, {
            type: 'primary',
            icon: 'el-icon-edit',
          })
          break

        default:
          break
      }
      return props
    },

    getControlsColumnProps(col) {
      return {
        width: Math.max(col.buttons && col.buttons.length * 34 + 20, 82),
        align: 'center',
        ...col,
      }
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
