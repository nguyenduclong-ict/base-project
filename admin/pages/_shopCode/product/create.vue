<template>
  <div class="page-content">
    <div class="pb-2 flex">
      <div class="flex-1">
        <el-page-header
          content="Thêm sản phẩm"
          @back="() => $router.back()"
        ></el-page-header>
      </div>
      <div>
        <el-button type="info" @click="$router.back()">Hủy</el-button>
        <el-button
          :loading="creating"
          icon="el-icon-finished"
          type="success"
          @click="createProduct"
        >
          Lưu
        </el-button>
      </div>
    </div>
    <ProductFormCreate ref="productForm" :form="form" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductFormCreate from '~/components/Product/ProductFormCreate.vue'
import _ from '~/utils/lodash'
import { getErrorMessage } from '~/utils/request'

export default {
  components: { ProductFormCreate },

  meta: {
    sidebarKey: '/{shopCode}/product',
    breadcrumb: [
      {
        path: '/{shopCode}/product',
        name: 'Sản phẩm',
      },
      {
        path: '/{shopCode}/product/create',
        name: 'Thêm sản phẩm',
      },
    ],
  },

  data() {
    return {
      form: {
        name: '',
        slug: '',
        description: '',
        categories: [],
        image: '',
        images: [],
        attributes: [],
        variants: [],
        has_variants: false,
        price: 0,
        sale_off_price: 0,
        is_sale_off: false,
        shop: null,
      },
      creating: false,
    }
  },

  computed: {
    ...mapState('shop', ['currentShop']),
  },

  methods: {
    async createProduct() {
      this.creating = true
      try {
        const valid = await this.$refs.productForm.validate()
        const payload = _.cloneDeep(this.form)

        Object.assign(payload, {
          shop: this.currentShop.id,
          is_sale_off: !!payload.sale_off_price,
        })

        console.log(payload)

        // if (valid) {
        //   const response = await this.$axios.$post('/product', payload)
        //   if (response.id) {
        //     this.$message.success('Thêm sản phẩm thành công')
        //     this.$router.back()
        //   }
        // }
      } catch (error) {
        console.error(`createProduct error`, error)
        this.$message.error(getErrorMessage(error))
      }
      this.creating = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
