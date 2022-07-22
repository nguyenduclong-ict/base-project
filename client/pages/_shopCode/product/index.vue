<template>
  <div class="p-5">
    <div class="flex mb-2">
      <div class="flex-1">
        <SelectEntity
          v-model="category"
          :config="{
            endpoint: '/category/find',
            payload: { 'query[shop_id]': currentShop.id },
          }"
        />
      </div>
      <div class="">
        <el-button
          @click="isShowCategoryTable = true"
          type="warning"
          icon="el-icon-collection-tag"
        ></el-button>
        <nuxt-link to="product/create">
          <el-button type="primary" icon="el-icon-document-add">
            Thêm sản phẩm
          </el-button>
        </nuxt-link>
      </div>
    </div>
    <DataTable :config="config" />

    <el-dialog
      destroy-on-close
      title="Danh mục sản phẩm"
      :visible.sync="isShowCategoryTable"
    >
      <DataTable :config="categoryTableConfig" />
    </el-dialog>
  </div>
</template>

<script>
import DataTable from '~/components/DataTable/DataTable.vue'
import { mapState } from 'vuex'
import SelectEntity from '~/components/Common/SelectEntity.vue'

export default {
  components: { DataTable, SelectEntity },
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
      categoryTableConfig: {
        endpoint: '/category',
        payload: {
          'query[shop_id]': this.$store.state.shop.currentShop?.id,
        },
        columns: [
          { type: 'index', label: 'STT' },
          {
            prop: 'name',
            label: 'Name',
          },
        ],
      },
    }
  },
  computed: {
    ...mapState('shop', ['currentShop']),
  },
}
</script>

<style lang="scss" scoped></style>
