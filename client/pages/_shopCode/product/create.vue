<template>
  <div class="p-5">
    <div class="pb-2 flex">
      <div class="flex-1"></div>
      <div>
        <el-button type="info" @click="$router.back()">Hủy</el-button>
        <el-button icon="el-icon-finished" type="success">Lưu</el-button>
      </div>
    </div>
    <el-form :model="form">
      <el-form-item label="Tên sản phẩm">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="Giá sản phẩm">
        <el-input-number
          v-model="form.price"
          class="left"
          :controls="false"
        ></el-input-number>
      </el-form-item>

      <el-checkbox v-model="form.is_sale_off">Sản phẩm giảm giá</el-checkbox>

      <el-form-item v-if="form.is_sale_off" label="Giá bán khi giảm giá">
        <el-input-number
          v-model="form.sale_off_price"
          class="left"
          :controls="false"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="Mô tả sản phẩm">
        <el-input v-model="form.description" type="textarea"></el-input>
      </el-form-item>

      <el-checkbox
        v-model="form.has_variants"
        class="mb-2"
        @change="onChangeHasVariants"
      >
        Sản phẩm có nhiều phiên bản
      </el-checkbox>

      <template v-if="form.has_variants">
        <div class="flex gap-2 mt-2">
          <div>Thuộc tính sản phẩm</div>
          <div class="flex-1 border-t border-gray-300 my-auto"></div>
        </div>
        <div class="flex gap-2 mb-2">
          <div style="width: 200px" class="text-sm">Tên thuộc tính</div>
          <div class="text-sm">Giá trị</div>
        </div>
        <div
          v-for="attr in form.attributes"
          :key="attr.id"
          class="flex gap-2 mb-2"
        >
          <el-input
            v-model="attr.name"
            style="width: 200px"
            class="flex-none"
            placeholder="Tên thuộc tính"
          ></el-input>

          <el-select
            v-model="attr.values"
            multiple
            allow-create
            default-first-option
            filterable
            class="w-full"
            placeholder="Giá trị cho thuộc tính"
          ></el-select>

          <el-button
            icon="el-icon-delete"
            class="icon"
            type="danger"
            @click="removeAttribute(attr)"
          ></el-button>
        </div>

        <el-button type="primary" icon="el-icon-plus" @click="addAttribute">
          Thêm thuộc tính
        </el-button>

        <div class="flex gap-2 mt-4">
          <div>Các phiên bản</div>
          <div class="flex-1 border-t border-gray-300 my-auto"></div>
        </div>

        <div v-if="!form.variants.length">
          <div class="text-gray-500 text-sm my-4">
            Chưa có phiên bản sản phẩm nào
          </div>
          <el-button icon="el-icon-plus" @click="addVariant">
            Thêm phiên bản
          </el-button>
        </div>
      </template>

      <el-form-item label="Hình ảnh" class="line-height-0">
        <MediaSelect v-model="form.image" class="w-full" :multiple="false" />
      </el-form-item>

      <el-form-item label="Hình ảnh chi tiết" class="line-height-0">
        <MediaSelect v-model="form.images" class="w-full" :multiple="true" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MediaSelect from '~/components/Common/MediaSelect.vue'
import { uniqueId } from '~/utils'
export default {
  components: { MediaSelect },
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
      attributeItem: {
        name: '',
        values: [],
      },
    }
  },

  computed: {
    ...mapState('shop', ['currentShop']),
  },

  created() {
    this.form.shop = this.currentShop.id
  },

  methods: {
    onChangeHasVariants(value) {
      if (value && !this.form.attributes.length) {
        this.form.attributes.push({
          id: uniqueId(),
          name: '',
          value: [],
        })
      } else if (!value) {
        this.form.attributes = this.form.attributes.filter((e) => e.name)
      }
    },

    addAttribute() {
      this.form.attributes.push({
        id: uniqueId(),
        name: '',
        value: [],
      })
    },

    removeAttribute(attr) {
      const index = this.form.attributes.indexOf(attr)
      this.form.attributes.splice(index, 1)
    },

    addVariant() {},
  },
}
</script>

<style lang="scss" scoped></style>
