<template>
  <div class="py-5 px-10">
    <div class="pb-2 flex">
      <div class="flex-1">
        <el-page-header
          content="Chỉnh sửa sản phẩm"
          @back="() => $router.back()"
        ></el-page-header>
      </div>
      <div>
        <el-button type="info" @click="$router.back()">Hủy</el-button>
        <el-button
          :loading="creating"
          icon="el-icon-finished"
          type="success"
          @click="updateProduct"
        >
          Lưu
        </el-button>
      </div>
    </div>
    <ProductForm ref="productForm" :form="form" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductForm from '~/components/Product/ProductForm.vue'
import _ from '~/utils/lodash'
import { buildQueryUrl, getErrorMessage } from '~/utils/request'

export default {
  components: { ProductForm },

  async asyncData({ params, store, $axios, error }) {
    const shopId = store.state.shop.currentShop.id

    const product = await $axios.$get(
      buildQueryUrl('/product/findone', {
        query: {
          _id: params.id,
          shop: shopId,
        },
      })
    )

    if (!product) {
      return error({ statusCode: 404, message: 'Sản phẩm không tồn tại' })
    }

    return {
      form: product,
    }
  },

  meta() {
    return {
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
    }
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
    async updateProduct() {
      this.creating = true
      try {
        const valid = await this.$refs.productForm.validate()
        const payload = _.cloneDeep(this.form)

        Object.assign(payload, {
          shop: this.currentShop.id,
          is_sale_off: !!payload.is_sale_off,
        })

        if (valid) {
          const response = await this.$axios.$put(
            '/product/' + payload.id,
            payload
          )
          if (response.id) {
            this.$message.success('Cập nhật sản phẩm thành công')
          }
        }
      } catch (error) {
        console.error(`updateProduct error`, error)
        this.$message.error(getErrorMessage(error))
      }
      this.creating = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
