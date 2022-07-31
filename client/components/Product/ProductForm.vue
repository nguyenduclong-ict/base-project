<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item label="Tên sản phẩm" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>

    <div class="flex gap-4">
      <el-form-item
        label-width="128px"
        label="Price (đ)"
        label-posisiton="left"
        class="left"
        prop="price"
      >
        <el-input-number
          v-model="form.price"
          class="left"
          :controls="false"
        ></el-input-number>
      </el-form-item>

      <el-form-item
        label-width="128px"
        label="Sale price (đ)"
        class="left"
        prop="sale_off_price"
      >
        <el-input-number
          v-model="form.sale_off_price"
          class="left"
          :controls="false"
        ></el-input-number>
      </el-form-item>
    </div>

    <el-form-item label="Mô tả sản phẩm">
      <el-input v-model="form.description" type="textarea"></el-input>
    </el-form-item>

    <el-form-item label="Danh mục sản phẩm">
      <SelectEntity
        v-model="form.categories"
        :multiple="true"
        class="w-full"
        placeholder="Chọn danh mục cho sản phẩm"
        :config="selectCategoriesConfig"
      />
    </el-form-item>

    <el-checkbox v-model="form.has_variants" class="mb-2">
      Sản phẩm có nhiều phiên bản
    </el-checkbox>

    <template v-if="form.has_variants">
      <div class="flex gap-2 mt-2">
        <div>Thuộc tính sản phẩm</div>
        <div class="flex-1 border-t border-gray-300 my-auto"></div>
        <div class="flex gap-2">
          <el-select v-model="selectedAttr" placeholder="Chọn thuộc tính">
            <el-option
              v-for="attr in attributes"
              :key="attr.id"
              :value="attr.id"
              :label="attr.name"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!selectedAttr"
            @click="addAttribute"
          >
            Thêm thuộc tính
          </el-button>
        </div>
      </div>

      <div v-if="form.variants.length" class="flex gap-2 mb-2">
        <div style="width: 200px" class="text-sm">Tên thuộc tính</div>
        <div class="text-sm">Giá trị</div>
      </div>
      <div v-else>
        <div class="text-gray-500 text-sm my-4">Chưa thêm thuộc tính nào</div>
      </div>

      <div
        v-for="attr in form.attributes"
        :key="attr.id"
        class="flex gap-2 mb-2"
      >
        <div style="width: 200px; flex: none">
          {{ attr.name }}
        </div>

        <el-select
          v-model="attr.values"
          multiple
          default-first-option
          filterable
          class="w-full"
          value-key="id"
          placeholder="Giá trị cho thuộc tính"
        >
          <el-option
            v-for="option in attr._values"
            :key="option.id"
            :value="option"
            :label="option.name"
          ></el-option>
        </el-select>

        <el-button
          icon="el-icon-delete"
          class="icon"
          type="danger"
          @click="removeAttribute(attr)"
        ></el-button>
      </div>

      <div class="flex gap-2 mt-4">
        <div>Các phiên bản</div>
        <div class="flex-1 border-t border-gray-300 my-auto"></div>
        <el-button icon="el-icon-plus" type="primary" @click="addVariant">
          Thêm phiên bản
        </el-button>
      </div>

      <div v-if="!form.variants.length">
        <div class="text-gray-500 text-sm my-4">
          Chưa có phiên bản sản phẩm nào
        </div>
      </div>
      <div v-else>
        <el-card
          v-for="(variant, index) in form.variants"
          :key="variant.id"
          class="mb-4"
        >
          <div class="flex justify-between mb-2">
            <div>{{ index + 1 }}. {{ generateVariantName(variant) }}</div>
            <el-button
              class="icon"
              type="danger"
              icon="el-icon-delete"
              @click="removeVariant(variant)"
            ></el-button>
          </div>
          <div
            v-for="item in variant.variant_values"
            :key="item.attribute.id"
            class="flex mb-2"
          >
            <span style="width: 200px; flex: none">
              {{ item.attribute.name }}
            </span>
            <el-select
              v-model="item.value"
              class="w-full"
              placeholder="Giá trị"
            >
              <el-option
                v-for="option in item.attribute.values"
                :key="option.id"
                :value="option.slug"
                :label="option.name"
              ></el-option>
            </el-select>
          </div>
        </el-card>
      </div>
    </template>

    <el-form-item label="Hình ảnh" class="line-height-0">
      <MediaSelect v-model="form.image" class="w-full" :multiple="false" />
    </el-form-item>

    <el-form-item
      :label="`Hình ảnh chi tiết (${form.images.length}/10)`"
      class="line-height-0"
    >
      <MediaSelect
        v-model="form.images"
        class="w-full"
        :limit="10"
        :multiple="true"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import SelectEntity from '../Common/SelectEntity.vue'
import MediaSelect from '~/components/Common/MediaSelect.vue'
import { uniqueId } from '~/utils'
import { buildQueryUrl } from '~/utils/request'

export default {
  components: { MediaSelect, SelectEntity },

  props: {
    form: {
      type: Object,
    },
  },

  meta: {
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
      attributes: [],
      selectedAttr: null,
      rules: {
        name: {
          required: true,
          message: 'Tên sản phẩm không được bỏ trống',
        },
        price: {
          required: true,
          message: 'Giá sản phẩm không được bỏ trống',
        },
      },
    }
  },

  computed: {
    ...mapState('shop', ['currentShop']),
    selectCategoriesConfig() {
      return {
        endpoint: '/category/find',
        payload: {
          query: {
            shop: this.currentShop.id,
          },
        },
      }
    },
  },

  watch: {
    'form.sale_of_price'(value) {
      this.form.is_sale_of = !!value
    },
  },

  created() {
    this.form.shop = this.currentShop.id
    this.fetchAttributes()
  },

  methods: {
    async fetchAttributes() {
      this.attributes = await this.$axios.$get(
        buildQueryUrl('/attribute/find', {
          query: {
            shop: this.currentShop.id,
          },
          limit: 1000,
        })
      )
    },

    generateVariantName(variant) {
      return (
        this.form.name +
        ' ' +
        variant.variant_values.map((item) => item.value).join(', ')
      )
    },

    addAttribute() {
      const attribute = this.attributes.find((e) => e.id === this.selectedAttr)

      if (
        attribute &&
        !this.form.attributes.find((e) => e.id === attribute.id)
      ) {
        const item = {
          ...attribute,
          _values: attribute.values,
          values: [...attribute.values],
        }
        this.form.attributes.push(item)
        this.mapAttributeToVariants(item)
        this.selectedAttr = null
      }
    },

    removeAttribute(attr) {
      const index = this.form.attributes.indexOf(attr)
      this.form.attributes.splice(index, 1)
      this.mapAttributeToVariants(null, attr)
    },

    mapAttributeToVariants(add, remove) {
      this.form.variants.forEach((variant) => {
        if (add) {
          const index = variant.variant_values.findIndex(
            (e) => e.attribute.id === add.id
          )
          if (index < 0) {
            variant.variant_values.push({
              attribute: add,
              slug: add.slug,
              value: null,
            })
          }
        }

        if (remove) {
          const index = variant.variant_values.findIndex(
            (e) => e.attribute.id === remove.id
          )
          if (index >= 0) {
            variant.variant_values.splice(index, 1)
          }
        }
      })
    },

    addVariant() {
      this.form.variants.push({
        id: uniqueId(),
        variant_values: this.form.attributes.map((attr) => ({
          attribute: attr,
          slug: attr.slug,
          value: null,
        })),
      })
    },

    removeVariant(variant) {
      const index = this.form.variants.findIndex((e) => e.id === variant.id)
      if (index >= 0) {
        this.form.variants.splice(index, 1)
      }
    },

    validate() {
      return this.validateForm(this.$refs.form)
    },
  },
}
</script>
