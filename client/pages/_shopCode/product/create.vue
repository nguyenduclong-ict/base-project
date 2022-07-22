<template>
  <div class="p-5">
    <div class="pb-2 flex">
      <div class="flex-1"></div>
      <div>
        <el-button type="info" @click="$router.back()">Hủy</el-button>
        <el-button icon="el-icon-check" type="success">Lưu</el-button>
      </div>
    </div>
    <el-form :model="form">
      <el-form-item label="Tên sản phẩm">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="Mô tả sản phẩm">
        <el-input v-model="form.description"></el-input>
      </el-form-item>

      <el-form-item label="Hình ảnh"></el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      form: {
        name: '',
        slug: '',
        description: '',
        image: '',
        images: [],
        attributes: [],
        variants: [],
        has_variants: false,
        price: 0,
        sale_off_price: 0,
        is_sale_off: 0,
        shop: null,
      },
    }
  },

  computed: {
    ...mapState('shop', ['currentShop']),
  },

  created() {
    this.form.shop = this.currentShop.id
  },
}
</script>

<style lang="scss" scoped></style>
