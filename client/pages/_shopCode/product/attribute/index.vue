<template>
  <div class="p-5">
    <div class="flex mb-2">
      <div class="flex-1"></div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-document-add"
          @click="showCreate"
        >
          Thêm thuộc tính
        </el-button>
      </div>
    </div>

    <DataTable
      ref="datatable"
      :config="config"
      @edit="handleEditRow"
    ></DataTable>

    <el-dialog
      width="600px"
      :visible.sync="isShowCreate"
      title="Create Attribute"
      append-to-body
    >
      <ProductAttributeForm
        v-if="formCreate"
        ref="formCreate"
        :form="formCreate"
        :rules="rules"
      />

      <div slot="footer" class="flex">
        <el-button @click="isShowCreate = false">Hủy</el-button>
        <div class="flex-1"></div>
        <el-button
          type="success"
          icon="el-icon-finished"
          @click="createAttribute"
        >
          Tạo
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="600px"
      :visible.sync="isShowUpdate"
      title="Update Attribute"
      append-to-body
    >
      <ProductAttributeForm
        v-if="formUpdate"
        ref="formUpdate"
        :form="formUpdate"
        :rules="rules"
      />

      <div slot="footer" class="flex">
        <el-button @click="isShowUpdate = false">Hủy</el-button>
        <div class="flex-1"></div>
        <el-button
          type="success"
          icon="el-icon-finished"
          @click="updateAttribute"
        >
          Cập nhật
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DataTable from '~/components/DataTable/DataTable.vue'
import _ from '@/utils/lodash'
import { getErrorMessage } from '~/utils/request'
import ProductAttributeForm from '~/components/ProductAttribute/ProductAttributeForm.vue'

export default {
  components: { DataTable, ProductAttributeForm },
  meta: {
    breadcrumb: [
      {
        path: '/{shopCode}/product/attribute',
        name: 'Thuộc tính sản phẩm',
      },
    ],
  },
  data() {
    return {
      isShowCreate: false,
      formCreate: null,
      isShowUpdate: false,
      formUpdate: null,
      fields: null,
      rules: {
        name: {
          required: true,
          message: 'Tên không được bỏ trống',
        },
        slug: {
          required: true,
          message: 'Slug không được bỏ trống',
        },
      },
      config: {
        endpoint: '/attribute',
        payload: {
          'query[shop_id]': this.$store.state.shop.currentShop?.id,
          sort: ['-createdAt'],
          popuplates: ['parent'],
        },
        columns: [
          { type: 'index', label: 'STT' },
          {
            prop: 'name',
            label: 'Name',
          },
          {
            prop: 'slug',
            label: 'Slug',
          },
          {
            type: 'controls',
            buttons: ['edit', 'delete'],
          },
        ],
      },
    }
  },

  computed: {
    ...mapState('shop', ['currentShop']),
  },

  created() {
    this.fields = this.initFields()
  },

  methods: {
    showCreate() {
      this.initFormCreate()
      this.isShowCreate = true
    },

    initFields() {
      return {
        name: { type: 'string', name: 'Tên thuộc tính', required: true },
        slug: { type: 'string', name: 'Slug', required: true },
        parent: {
          type: 'SelectEntity',
          name: 'Danh mục cha',
          props: {
            config: {
              endpoint: '/attribute/find',
              payload: {
                query: {
                  shop: this.currentShop.id,
                },
              },
            },
          },
        },
      }
    },

    initFormCreate() {
      this.formCreate = {
        slug: '',
        name: '',
        values: [],
      }
    },

    async createAttribute() {
      try {
        const valid = await this.validateForm(this.$refs.formCreate.$refs.form)
        if (valid) {
          await this.$axios.$post('/attribute', {
            ...this.formCreate,
            shop: this.currentShop.id,
          })
          this.isShowCreate = false
          this.$message.success('Thêm thuộc tính thành công')
          this.$refs.datatable.fetchData({ page: 1 })
        }
      } catch (error) {
        console.error(`createAttribute`, error)
        this.$message.error(getErrorMessage(error))
      }
    },

    async updateAttribute() {
      try {
        const valid = await this.validateForm(this.$refs.formUpdate.$refs.form)
        if (valid) {
          await this.$axios.$put(
            '/attribute/' + this.formUpdate.id,
            this.formUpdate
          )
          this.isShowUpdate = false
          this.$message.success('Cập nhật thuộc tính thành công')
          this.$refs.datatable.fetchData({ page: 1 })
        }
      } catch (error) {
        console.error(`updateAttribute`, error)
        this.$message.error(getErrorMessage(error))
      }
    },

    handleEditRow(row) {
      this.formUpdate = _.cloneDeep(row)
      this.isShowUpdate = true
    },
  },
}
</script>

<style lang="scss" scoped></style>
