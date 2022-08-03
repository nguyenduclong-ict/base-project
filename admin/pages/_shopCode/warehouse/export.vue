<template>
  <div class="py-5 px-10">
    <div class="flex mb-2">
      <div class="flex-1"></div>
      <div>
        <nuxt-link to="product/create">
          <el-button type="primary" icon="el-icon-document-add">
            Xuất hàng
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
        path: '/{shopCode}/warehouse/export',
        name: 'Danh sách xuất hàng',
      },
    ],
  },

  data() {
    return {
      config: {
        endpoint: '/export',
        columns: [
          { type: 'index', label: 'STT' },
          {
            label: 'Kho hàng',
            prop: 'warehouse.name',
          },
          { type: 'slot', prop: 'image' },
          { label: 'Giá', prop: 'price' },
        ],
      },
    }
  },

  created() {
    console.log(this.currentShop)
  },

  methods: {
    demo() {},
  },
}
</script>

<style lang="scss" scoped></style>
