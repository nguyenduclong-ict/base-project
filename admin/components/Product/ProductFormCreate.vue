<template>
  <el-form
    ref="form"
    class="product-form-create flex flex-col gap-4"
    :model="form"
    :rules="rules"
  >
    <div class="flex gap-4">
      <div class="flex gap-4 flex-col flex-2">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>Thông tin chung</span>
          </div>

          <el-form-item label="Tên sản phẩm" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="Mô tả sản phẩm">
            <div class="w-full inline-block">
              <Editor v-model="form.description" />
            </div>
          </el-form-item>
        </el-card>

        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>Giá sản phẩm</span>
          </div>
          <div class="flex gap-4 w-full flex-wrap flex-col">
            <div class="flex gap-4">
              <el-form-item
                label="Giá sản phẩm (đ)"
                class="flex-1 mb-0"
                prop="price"
              >
                <InputNumber v-model="form.price" />
              </el-form-item>

              <el-form-item
                class="flex-1 mb-0"
                label="Giá khuyến mãi (đ)"
                prop="sale_off_price"
              >
                <InputNumber v-model="form.sale_off_price" />
              </el-form-item>
            </div>

            <div class="flex gap-4">
              <el-form-item
                class="flex-1 mb-0"
                label="Giá bán lẻ (đ)"
                prop="retail_price"
              >
                <InputNumber v-model="form.retail_price" />
              </el-form-item>

              <el-form-item
                class="flex-1 mb-0"
                label="Giá bán buôn (đ)"
                prop="wholesale_price"
              >
                <InputNumber v-model="form.wholesale_price" />
              </el-form-item>
            </div>

            <div class="flex gap-4">
              <el-form-item
                class="flex-1 mb-0"
                label="Giá nhập hàng (đ)"
                prop="import_price"
              >
                <InputNumber v-model="form.import_price" />
              </el-form-item>
              <div class="flex-1"></div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>Ảnh sản phẩm</span>
          </div>
          <el-form-item label="Hình ảnh" class="line-height-0">
            <MediaSelect
              v-model="form.image"
              class="w-full"
              :multiple="false"
            />
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
        </el-card>
      </div>

      <div class="flex-1 gap-4">
        <el-card shadow="none">
          <div slot="header" class="clearfix">
            <span>Phân loại</span>
          </div>

          <el-form-item label="Danh mục sản phẩm">
            <SelectEntity
              v-model="form.categories"
              :multiple="true"
              class="mb-0 w-full"
              placeholder="Chọn danh mục cho sản phẩm"
              :config="selectCategoriesConfig"
            />
          </el-form-item>

          <el-form-item label="Tags">
            <SelectEntity
              v-model="form.tags"
              :multiple="true"
              class="mb-0 w-full"
              placeholder="Chọn danh mục cho sản phẩm"
              :config="selectCategoriesConfig"
            />
          </el-form-item>
        </el-card>
      </div>
    </div>

    <div class="w-full flex-col gap-4">
      <div class="flex w-full gap-4">
        <el-card shadow="never" class="flex-2">
          <div class="flex gap-2 items-center">
            <div>Thuộc tính sản phẩm</div>
            <el-switch v-model="form.has_variants"></el-switch>
          </div>
          <template v-if="form.has_variants">
            <el-divider class="small-divider"></el-divider>
            <div v-if="form.attributes.length" class="flex gap-2 mt-2 mb-2">
              <div style="width: 200px" class="text-base font-semibold">
                Tên thuộc tính
              </div>
              <div class="text-base font-semibold">Giá trị</div>
            </div>
            <div v-else>
              <div class="text-gray-500 text-sm my-4">
                Chưa thêm thuộc tính nào
              </div>
            </div>

            <div
              v-for="attr in form.attributes"
              :key="attr.id"
              class="flex gap-2 mb-2"
            >
              <el-input
                v-model="attr.name"
                placeholder="Tên thuộc tính"
                style="width: 200px; flex: none"
              ></el-input>

              <InputTag
                v-model="attr.values"
                placeholder="Gõ kí tự và nhấn Enter để thêm thuộc tính"
                @change="generateVariants()"
              />

              <el-button
                icon="el-icon-delete"
                class="icon"
                type="danger"
                @click="removeAttribute(attr)"
              ></el-button>
            </div>

            <el-button
              v-if="form.attributes.length < 3"
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="addAttribute"
            >
              Thêm thuộc tính
            </el-button>
          </template>
        </el-card>
        <div class="flex-1"></div>
      </div>

      <template v-if="form.has_variants">
        <el-card v-if="form.attributes.length" class="mt-4" shadow="never">
          <div slot="header" class="clearfix">
            <span>Các phiên bản</span>
          </div>
          <el-table :data="form.variants" class="w-full">
            <el-table-column label="Tên phiên bản" :min-width="200">
              <template #default="{ row }">
                <div class="flex">
                  <MediaSelect
                    v-model="row.image"
                    :trigger-size="36"
                    close-icon="small"
                  />
                  <div
                    class="ml-2 flex items-center"
                    style="word-break: break-word"
                  >
                    {{ row.name }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Mã SKU"></el-table-column>
            <el-table-column label="Barcode"></el-table-column>
            <el-table-column label="Giá"></el-table-column>
            <el-table-column label="Giá bán lẻ"></el-table-column>
            <el-table-column label="Giá bán buôn"></el-table-column>
            <el-table-column label="Giá nhập hàng"></el-table-column>
          </el-table>
        </el-card>
      </template>
    </div>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import SelectEntity from '../Common/SelectEntity.vue'
import Editor from '../Common/Editor/Editor.vue'
import InputTag from '../Common/InputTag.vue'
import InputNumber from '../Common/InputNumber.vue'
import MediaSelect from '~/components/Common/MediaSelect.vue'
import { getCombination, uniqueId } from '~/utils'

export default {
  components: { MediaSelect, SelectEntity, Editor, InputTag, InputNumber },

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
  },

  methods: {
    generateVariantName(variant) {
      return (
        this.form.name +
        ' - ' +
        variant.variant_values.map((item) => item.value).join(' - ')
      )
    },

    addAttribute() {
      const defaults = ['Kích thước', 'Màu sắc', 'Chất liệu']
      this.form.attributes.push({
        name: defaults[this.form.attributes.length],
        values: [],
      })
      this.generateVariants()
    },

    removeAttribute(attr) {
      const index = this.form.attributes.indexOf(attr)
      this.form.attributes.splice(index, 1)
      this.generateVariants()
    },

    generateVariants() {
      const attributes = this.form.attributes
      const values = attributes.map((e) => e.values).filter((e) => e.length)

      const combinations = getCombination(values)

      const variants = combinations.map((item) => {
        const key = item.sort((a, b) => a - b).join('-')

        const exists = this.form.variants.find((e) => e.key === key)

        if (exists) {
          Object.assign(exists, {
            variant_values: item.map((v, i) => ({
              attribute: attributes[i].name,
              value: v,
            })),
          })
          Object.assign(exists, { name: this.generateVariantName(exists) })
          return exists
        }

        const variant = {
          id: uniqueId(),
          key,
          image: '',
          price: 0,
          sale_off_price: 0,
          is_sale_off: false,
          variant_values: item.map((v, i) => ({
            attribute: attributes[i].name,
            value: v,
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

<style lang="scss">
.product-form-create {
  .column-image {
    .cell {
      display: flex;
    }
  }
}
</style>
