<template>
  <div class="page-content">
    <div class="pb-2 flex">
      <div class="flex-1">
        <el-page-header
          content="Tạo đơn nhập hàng"
          @back="() => $router.back()"
        ></el-page-header>
      </div>
      <div>
        <el-button type="info" @click="$router.back()">Hủy</el-button>
        <el-button
          :loading="creating"
          icon="el-icon-finished"
          type="success"
          @click="createImport"
        >
          Lưu
        </el-button>
      </div>
    </div>

    <el-form :model="form" :rules="rules">
      <el-form-item label="Kho hàng" prop="warehouse">
        <SelectEntity
          v-model="form.warehouse"
          placeholder="Chọn kho hàng"
          :config="selectWarehouseConfig"
        />
      </el-form-item>

      <el-form-item label="Ngày nhập hàng" prop="date">
        <el-date-picker
          v-model="form.date"
          placeholder="Chọn ngày nhập hàng"
          format="DD/MM/yyyy"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="Danh sách sản phẩm cần nhập" prop="warehouse">
        <el-autocomplete
          v-model="searchProductText"
          prefix-icon="el-icon-search"
          class="w-full"
          :fetch-suggestions="searchProduct"
          placeholder="Tìm kiếm sản phẩm"
          @select="handleSelectProduct"
        >
          <template #default="{ item }">
            <div class="flex justify-center items-center">
              <el-image
                fit="contain"
                class="my-2 bg-slate-200"
                style="width: 48px; height: 48px"
                :src="u.get(item, 'image.url')"
              ></el-image>
              <div class="ml-2 flex-1 h-full">
                <div class="text-gray-800 font-medium leading-normal">
                  {{ item.name }}
                </div>
                <div class="leading-normal">{{ item.price | money }}</div>
              </div>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SelectEntity from '~/components/Common/SelectEntity.vue'
import { ShopMixin } from '~/mixins/shop'
import { buildQueryUrl } from '~/utils/request'
export default {
  components: { SelectEntity },
  mixins: [ShopMixin],
  meta: {
    breadcrumb: [
      {
        path: '/{shopCode}/warehouse/import',
        name: 'Danh sách nhập hàng',
      },
      {
        path: '/{shopCode}/warehouse/import/create',
        name: 'Thêm mới',
      },
    ],
  },

  data() {
    return {
      selectWarehouseConfig: {
        endpoint: '/warehouse',
      },
      searchProductText: '',
      creating: false,
      rules: {},
      form: {
        warehouse: null,
        items: [],
        date: new Date(),
        shop: null,
        status: 0,
      },
    }
  },

  methods: {
    createImport() {},

    async searchProduct(queryString, cb) {
      const products = await this.$axios.$get(
        buildQueryUrl('/product/find', {
          query: {
            shop: this.currentShop.id,
          },
          search: queryString,
          limit: 100,
        })
      )

      cb(products)
    },

    handleSelectProduct(item) {
      this.form.push({
        product: item.id,
        _product: item,
        quantity: 0,
        price: item.price,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
