<template>
  <div class="py-5 px-10 medias-page">
    <div class="mb-4 flex">
      <InputSearch
        style="width: 250px"
        :loading="fetching"
        @search="handleSearch"
      />
      <div class="flex-1"></div>
      <el-button
        v-if="selected.length > 0"
        icon="el-icon-delete"
        type="danger"
        @click="handleDeleteMedia"
      >
        Xóa ({{ selected.length }}) ảnh
      </el-button>
    </div>
    <el-scrollbar
      v-if="data.length > 0"
      :wrap-style="[{ maxHeight: 'calc(90vh - 270px)' }]"
    >
      <div class="flex gap-2 flex-wrap pb-4">
        <el-card
          v-for="media in data"
          :key="media.id"
          class="media-item"
          @click.native="handleSelect(media)"
        >
          <div class="image-wrapper flex justify-center relative">
            <el-checkbox
              :value="isSelected(media)"
              @change="handleSelect(media)"
            ></el-checkbox>
            <el-image
              class="cursor-pointer"
              fit="cover"
              style="height: 82px"
              :src="media.url"
              @click="preview(media.url)"
            ></el-image>
          </div>
          <div class="p-2">
            <div class="text-xs">{{ media.name }}</div>
            <div class="flex mt-2">
              <span class="text-gray-500 flex-1 text-xs break-normal my-auto">
                {{ infoText(media) }}
              </span>
              <el-tag type="info">image</el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </el-scrollbar>

    <div
      v-else
      class="h-60 text-gray-300 flex items-center justify-center flex-col"
    >
      <svg-icon name="empty" class="mb-4" style="width: 96px; height: 96px" />
      Bạn chưa tải lên ảnh nào
    </div>

    <el-pagination
      class="mt-2"
      hide-on-single-page
      background
      layout="->, prev, pager, next"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pager.pageSize"
      :page-count="pager.totalPages"
      :current-page="pager.page"
      :total="pager.total"
      @current-change="handlePageChange"
    ></el-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import numeral from 'numeral'
import { buildQueryUrl } from '~/utils/request'
import _ from '@/utils/lodash'
import InputSearch from '~/components/Common/InputSearch.vue'

export default {
  components: { InputSearch },
  meta: {
    breadcrumb: [
      {
        path: '/{shopCode}/setting/media',
        name: 'Thư viện ảnh',
      },
    ],
  },

  data() {
    return {
      data: [],
      fetching: false,
      pager: {
        page: 1,
        pageSize: 12,
        total: 0,
        totalPages: 0,
      },
      selected: [],
      previewUrl: null,
      filesForUpload: [],
    }
  },

  fetch() {
    this.fetchData()
  },

  computed: {
    ...mapState('shop', ['currentShop']),
  },

  methods: {
    async handleDeleteMedia() {
      const agree = await this.showConfirm(
        `Bạn có chắc chắn muốn xóa ${this.selected.length} files?`,
        { title: 'Chú ý', type: 'warning', confirmButtonText: 'Xóa' }
      )

      if (agree) {
        const ids = this.selected.map((e) => e.id).join('+')

        await this.$axios.$delete(
          buildQueryUrl('/media/' + ids, { shop_id: this.currentShop.id })
        )

        this.selected = []
        this.fetchData({ page: 1 })
      }
    },

    handleSearch(query) {
      this.fetchData({ search: query })
    },

    isSelected(media) {
      return !!this.selected.find((e) => e.id === media.id)
    },

    mediaType(media) {
      return media.mimetype
        ? media.mimetype.replace('image/', '').toUpperCase()
        : ''
    },

    infoText(media) {
      const arr = []
      if (media.mimetype)
        arr.push(media.mimetype.replace('image/', '').toUpperCase())
      if (media.dimension) arr.push(media.dimension)
      if (media.size) arr.push(numeral(media.size).format('0b'))
      return arr.join(' - ')
    },

    handleSelect(media) {
      const index = this.selected.findIndex((e) => e.id === media.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      } else {
        this.selected.push(media)
      }
    },

    async fetchData(payload) {
      this.fetching = true

      try {
        const response = await this.$axios.$get(
          buildQueryUrl('/media/list', {
            ...this.pager,
            ...payload,
            query: {
              mimetype: {
                $regex: 'image/.*',
              },
              shop: this.currentShop.id,
            },
            sort: ['-createdAt'],
            shop_id: this.currentShop.id,
          })
        )

        this.data = response.data
        Object.assign(this.pager, _.omit(response, 'data'))
      } catch (error) {
        console.error('fetchData', error)
      }

      this.fetching = false
    },

    handlePageChange(page) {
      this.fetchData({ page })
    },
  },
}
</script>

<style lang="scss">
.medias-page {
  .media-item {
    .el-card__body {
      padding: 0px;
    }

    width: 200px;
    flex: none;

    .text-xs {
      word-break: break-all;
    }

    .image-wrapper {
      background: repeating-conic-gradient(
          rgb(246, 246, 249) 0%,
          rgb(246, 246, 249) 25%,
          transparent 0%,
          transparent 50%
        )
        50% center / 20px 20px;

      .el-checkbox {
        position: absolute;
        top: 4px;
        left: 8px;
      }
    }
  }

  .media-item.selected {
    border-color: dodgerblue;
  }
}
</style>
