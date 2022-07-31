<template>
  <div class="p-5">
    <div class="flex mb-2">
      <div class="flex-1"></div>
      <div>
        <nuxt-link to="product/create">
          <el-button type="primary" icon="el-icon-document-add">
            Thêm sản phẩm
          </el-button>
        </nuxt-link>
      </div>
    </div>
    <DataTable :config="config" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DataTable from '~/components/DataTable/DataTable.vue'

export default {
  components: { DataTable },
  meta: {
    breadcrumb: [
      {
        path: '/{shopCode}/product',
        name: 'Danh sách sản phẩm',
      },
    ],
  },
  data() {
    return {
      category: '62b53ca9f0c394b24f9c6255',
      config: {
        endpoint: '/product',
        columns: [
          { type: 'index', label: 'STT' },
          {
            prop: 'name',
            label: 'Name',
          },
        ],
      },
      isShowCategoryTable: false,
    }
  },
  computed: {
    ...mapState('shop', ['currentShop']),
  },
}
</script>

<style lang="scss" scoped></style>
