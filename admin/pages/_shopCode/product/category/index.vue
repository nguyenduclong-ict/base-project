<template>
  <div class="page-content">
    <div class="flex mb-2">
      <div class="flex-1"></div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-document-add"
          @click="showCreate"
        >
          Thêm danh mục
        </el-button>
      </div>
    </div>

    <DataTable
      ref="datatable"
      :config="config"
      @edit="handleEditRow"
    ></DataTable>

    <el-dialog
      :visible.sync="isShowCreate"
      title="Create Category"
      append-to-body
    >
      <FormData
        ref="formCreate"
        v-model="formCreate"
        :fields="fields"
      ></FormData>

      <div slot="footer" class="flex">
        <el-button @click="iShowCreate = false">Hủy</el-button>
        <div class="flex-1"></div>
        <el-button
          type="success"
          icon="el-icon-finished"
          @click="createCategory"
        >
          Tạo
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowUpdate"
      title="Update Category"
      append-to-body
    >
      <FormData
        ref="formUpdate"
        v-model="formUpdate"
        :fields="fields"
      ></FormData>

      <div slot="footer" class="flex">
        <el-button @click="isShowUpdate = false">Hủy</el-button>
        <div class="flex-1"></div>
        <el-button
          type="success"
          icon="el-icon-finished"
          @click="updateCategory"
        >
          Cập nhật
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FormData from '~/components/Common/FormData.vue'
import DataTable from '~/components/DataTable/DataTable.vue'
import _ from '@/utils/lodash'
import { getErrorMessage } from '~/utils/request'

export default {
  components: { DataTable, FormData },
  meta: {
    breadcrumb: [
      {
        path: '/{shopCode}/product/category',
        name: 'Danh mục sản phẩm',
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
      config: {
        endpoint: '/category',
        payload: {
          'query[shop]': this.$store.state.shop.currentShop?.id,
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
        name: { type: 'string', name: 'Tên danh mục', required: true },
        slug: { type: 'string', name: 'Slug', required: true },
        parent: {
          type: 'SelectEntity',
          name: 'Danh mục cha',
          props: {
            config: {
              endpoint: '/category/find',
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
        color: '',
        parent: null,
      }
    },

    async createCategory() {
      try {
        const valid = await this.$refs.formCreate.validate()
        if (valid) {
          await this.$axios.$post('/category', {
            ...this.formCreate,
            shop: this.currentShop.id,
          })
          this.isShowCreate = false
          this.$message.success('Thêm danh mục thành công')
          this.$refs.datatable.fetchData({ page: 1 })
        }
      } catch (error) {
        console.error(`createCategory`, error)
        this.$message.error(getErrorMessage(error))
      }
    },

    async updateCategory() {
      try {
        const valid = await this.$refs.formUpdate.validate()
        if (valid) {
          await this.$axios.$put(
            '/category/' + this.formUpdate.id,
            this.formUpdate
          )
          this.isShowUpdate = false
          this.$message.success('Cập nhật danh mục thành công')
          this.$refs.datatable.fetchData({ page: 1 })
        }
      } catch (error) {
        console.error(`updateCategory`, error)
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
