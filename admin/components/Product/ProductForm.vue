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
      <div class="w-full inline-block">
        <Editor v-model="form.description" />
      </div>
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
        <el-input
          v-model="attr.name"
          style="width: 200px; flex: none"
        ></el-input>

        <el-select
          v-model="attr.values"
          multiple
          default-first-option
          filterable
          class="w-full"
          value-key="slug"
          placeholder="Giá trị cho thuộc tính"
          @change="generateVariants()"
        >
          <el-option
            v-for="option in attr._values"
            :key="option.id"
            :value="option"
            :label="option.value"
          ></el-option>
        </el-select>

        <el-button
          icon="el-icon-delete"
          class="icon"
          type="danger"
          @click="removeAttribute(attr)"
        ></el-button>
      </div>

      <div class="flex gap-2 mt-4 mb-2">
        <div>Các phiên bản</div>
      </div>

      <div v-if="!form.variants.length">
        <div class="text-gray-500 text-sm my-4">
          Chưa có phiên bản sản phẩm nào
        </div>
      </div>
      <div v-else>
        <el-table :data="form.variants" class="w-full">
          <el-table-column type="index"></el-table-column>
          <el-table-column :width="80">
            <template #default="{ row }">
              <MediaSelect v-model="row.image" :trigger-size="32" />
            </template>
          </el-table-column>

          <el-table-column prop="name"></el-table-column>
        </el-table>
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
import Editor from '../Common/Editor/Editor.vue'
import MediaSelect from '~/components/Common/MediaSelect.vue'
import { getCombination, uniqueId } from '~/utils'
import { buildQueryUrl } from '~/utils/request'

export default {
  components: { MediaSelect, SelectEntity, Editor },

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
        ' - ' +
        variant.variant_values.map((item) => item.value).join(' - ')
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
        // this.mapAttributeToVariants(item)
        this.selectedAttr = null
        this.generateVariants()
      }
    },

    removeAttribute(attr) {
      const index = this.form.attributes.indexOf(attr)
      this.form.attributes.splice(index, 1)
      // this.mapAttributeToVariants(null, attr)
      this.generateVariants()
    },

    generateVariants() {
      const attributes = this.form.attributes
      const values = attributes.map((e) => e.values)

      const combinations = getCombination(values)

      const variants = combinations.map((item) => {
        const variant = {
          id: uniqueId(),
          image: '',
          price: 0,
          sale_off_price: 0,
          is_sale_off: false,
          variant_values: item.map((v, i) => ({
            attribute: attributes[i],
            slug: attributes[i].slug,
            value: v.value,
          })),
        }
        variant.name = this.generateVariantName(variant)
        return variant
      })

      this.form.variants = variants
    },

    validate() {
      return this.validateForm(this.$refs.form)
    },
  },
}
</script>
