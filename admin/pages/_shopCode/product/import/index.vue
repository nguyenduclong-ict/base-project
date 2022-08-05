<template>
  <div class="page-content">
    <div class="flex mb-2">
      <div class="flex-1"></div>
      <div>
        <nuxt-link to="import/create">
          <el-button type="primary" icon="el-icon-document-add">
            Nhập hàng
          </el-button>
        </nuxt-link>
      </div>
    </div>

    <DataTable :config="config"></DataTable>
  </div>
</template>

<script>
import DataTable from '~/components/DataTable/DataTable.vue'
import { ShopMixin } from '~/mixins/shop'

export default {
  components: { DataTable },

  mixins: [ShopMixin],

  meta: {
    breadcrumb: [
      {
        path: '/{shopCode}/warehouse/import',
        name: 'Danh sách nhập hàng',
      },
    ],
  },

  data() {
    return {
      config: {
        endpoint: '/warehouse/import',
        columns: [
          { type: 'index', label: 'STT' },
          {
            label: 'Kho hàng',
            prop: 'warehouse.name',
          },
          { label: 'Số sản phẩm', prop: 'quantity' },
          { label: 'Tổng tiền', prop: 'price' },
          { label: 'Ngày nhập', prop: 'date' },
          { label: 'Trạng thái', prop: 'status' },
          { label: 'Người tạo', prop: 'created_by.name' },
        ],
      },
    }
  },

  created() {},

  methods: {
    demo() {},
  },
}
</script>

<style lang="scss" scoped></style>
