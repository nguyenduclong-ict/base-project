<template>
  <div class="py-5 px-10">
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
    <DataTable :config="config" @edit="editProduct">
      <el-table-column slot="column-image" :width="72">
        <template slot-scope="{ row }">
          <el-image
            v-if="row.image"
            style="width: 48px; height: 48px"
            fit="cover"
            :src="row.image.url"
            :preview-src-list="[row.image.url]"
          ></el-image>
        </template>
      </el-table-column>
    </DataTable>
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
      config: {
        endpoint: '/product',
        payload: {
          query: {
            shop: this.$store.state.shop.currentShop.id,
          },
        },
        columns: [
          { type: 'index', label: 'STT' },
          {
            label: 'Tên sản phẩm',
            prop: 'name',
          },
          { type: 'slot', prop: 'image' },
          { label: 'Giá', prop: 'price' },
          { type: 'controls', buttons: ['edit'] },
        ],
      },
    }
  },
  computed: {
    ...mapState('shop', ['currentShop']),
  },

  methods: {
    editProduct(product) {
      this.$router.push(`/${this.currentShop.code}/product/${product.id}`)
    },
  },
}
</script>

<style lang="scss" scoped></style>
