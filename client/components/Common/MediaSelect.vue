<template>
  <div>
    <el-button @click="show">Select</el-button>
    <el-dialog
      :visible.sync="visible"
      title="Chọn ảnh"
      append-to-body
      custom-class="media-select-dialog"
    >
      <el-tabs type="card">
        <el-tab-pane label="Ảnh đã tải lên">
          <!-- List Media -->
          <el-scrollbar :wrap-style="[{ maxHeight: '40vh' }]">
            <div class="flex gap-2 flex-wrap pb-4">
              <el-card
                v-for="media in medias"
                :key="media.id"
                class="media-item"
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
                  <div class="flex">
                    <span class="text-gray-500 flex-1 text-xs my-auto">
                      {{ mediaType(media) }} - {{ media.dimension }}
                    </span>
                    <el-tag type="info">image</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
          </el-scrollbar>

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
        </el-tab-pane>
        <el-tab-pane :label="`Đã chọn (${selected.length})`">
          <el-scrollbar :wrap-style="[{ maxHeight: '40vh' }]">
            <div class="flex gap-2 flex-wrap pb-4">
              <el-card
                v-for="media in selected"
                :key="media.id"
                class="media-item"
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
                  <div class="flex">
                    <span class="text-gray-500 flex-1 text-xs my-auto">
                      {{ mediaType(media) }} - {{ media.dimension }}
                    </span>
                    <el-tag type="info">image</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="Tải lên">Upload</el-tab-pane>
      </el-tabs>
      <div slot="footer" class="flex">
        <el-button @click="visible = false">Hủy</el-button>
        <div class="flex-1"></div>
        <el-button
          type="success"
          icon="el-icon-finished"
          @click="visible = false"
        >
          Xác nhận
        </el-button>
      </div>
    </el-dialog>

    <el-image
      ref="preview"
      :src="previewUrl"
      :preview-src-list="[previewUrl]"
      style="display: none"
    ></el-image>
  </div>
</template>

<script>
import * as qs from 'qs'
import { mapState } from 'vuex'
import _ from '@/utils/lodash'

export default {
  props: {
    value: {
      type: null,
    },
    multiple: {
      type: Boolean,
    },
  },

  data() {
    return {
      visible: false,
      medias: [],
      pager: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
      selected: [],
      previewUrl: null,
    }
  },

  computed: {
    ...mapState('shop', ['currentShop']),
  },

  created() {
    this.fetchMedias()
  },

  methods: {
    isSelected(media) {
      return !!this.selected.find((e) => e.id === media.id)
    },

    mediaType(media) {
      return media.mimetype.replace('image/', '').toUpperCase()
    },

    handleSelect(media) {
      const index = this.selected.findIndex((e) => e.id === media.id)
      if (index >= 0) {
        this.selected.splice(index, 1)
      } else if (!this.multiple) {
        this.selected = [media]
      } else {
        this.selected.push(media)
      }
    },

    show() {
      this.visible = true
    },

    hide() {
      this.visible = false
    },

    async fetchMedias(payload) {
      const response = await this.$axios.$get(
        '/media/list' +
          qs.stringify(
            {
              ...this.pager,
              ...payload,
              query: {
                mimetype: {
                  $regex: 'image/.*',
                },
              },
              shop_id: this.currentShop.id,
            },
            { encode: false, addQueryPrefix: true }
          )
      )

      this.medias = response.data
      Object.assign(this.pager, _.omit(response, 'data'))
    },

    handlePageChange(page) {
      this.fetchMedias({ page })
    },

    preview(url) {
      this.previewUrl = url
      this.$nextTick(() => {
        this.$refs.preview.clickHandler()
      })
    },
  },
}
</script>

<style lang="scss">
.media-select-dialog {
  .media-item {
    .el-card__body {
      padding: 0px;
    }

    width: 200px;
    flex: none;

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
