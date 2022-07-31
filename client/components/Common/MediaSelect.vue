<template>
  <div class="media-select inline-flex flex-wrap gap-2">
    <div v-for="(item, index) in valueItems" :key="item.id" class="value-item">
      <el-image
        :src="item.url"
        style="width: 128px; height: 128px"
        :preview-src-list="[item.url]"
        fit="cover"
      ></el-image>

      <el-button
        class="icon absolute top-1 right-1"
        icon="el-icon-delete"
        size="mini"
        @click="deleteValue(item, index)"
      ></el-button>
    </div>

    <div
      v-if="multiple || (!multiple && !value)"
      class="value-item cursor-pointer flex justify-center items-center border border-dashed border-gray-400 bg-gray-100"
      @click="show"
    >
      <i class="el-icon-plus text-gray-500" style="font-size: 32px"></i>
    </div>

    <el-dialog
      :visible.sync="visible"
      title="Chọn ảnh"
      append-to-body
      width="878px"
      custom-class="media-select-dialog"
    >
      <el-tabs v-model="tab" type="card">
        <el-tab-pane label="Ảnh đã tải lên" name="gallery">
          <!-- List Media -->
          <el-scrollbar :wrap-style="[{ maxHeight: 'calc(90vh - 270px)' }]">
            <div class="flex gap-2 flex-wrap pb-4">
              <el-card
                v-for="media in medias"
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
                    <span
                      class="text-gray-500 flex-1 text-xs break-normal my-auto"
                    >
                      {{ infoText(media) }}
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
        <!-- Selected -->
        <el-tab-pane :label="`Đã chọn (${selected.length})`" name="selected">
          <div v-if="!selected.length" class="h-32">
            Bạn chưa chọn file nào, vui lòng chọn file từ tab Ảnh đã tải lên
          </div>

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
                  <div class="flex mt-2">
                    <span
                      class="text-gray-500 flex-1 text-xs break-normal my-auto"
                    >
                      {{ infoText(media) }}
                    </span>
                    <el-tag type="info">image</el-tag>
                  </div>
                </div>
              </el-card>
            </div>
          </el-scrollbar>
        </el-tab-pane>
        <!-- Upload  -->
        <el-tab-pane label="Tải lên" name="upload">
          <div
            v-if="filesForUpload.length > 0"
            class="flex gap-2 flex-wrap pb-4"
          >
            <el-card
              v-for="media in filesForUpload"
              :key="media.id"
              class="media-item"
            >
              <div class="image-wrapper flex justify-center relative">
                <el-image
                  class="cursor-pointer"
                  fit="cover"
                  style="height: 82px"
                  :src="media.url"
                  @click="preview(media.url)"
                ></el-image>
                <el-button
                  icon="el-icon-delete"
                  class="icon absolute top-1 right-1"
                  @click="deleteUploadMedia(media)"
                ></el-button>
              </div>
              <div class="p-2">
                <div class="text-xs">{{ media.name }}</div>
                <div class="flex mt-2">
                  <span
                    class="text-gray-500 flex-1 text-xs break-normal my-auto"
                  >
                    {{ infoText(media) }}
                  </span>
                </div>
                <el-progress
                  v-if="media.uploading"
                  :percentage="media.progress"
                  :status="media.progress === 100 ? 'success' : null"
                ></el-progress>
              </div>
            </el-card>
          </div>

          <div
            class="w-full flex flex-col border border-dashed border-gray-400 rounded-lg h-52 bg-gray-100 justify-center items-center cursor-pointer"
            @click="pickFile"
            @drop.prevent="onDropFile"
            @dragover.prevent
          >
            <i class="el-icon-upload text-gray-400 text-7xl"></i>
            <span class="mt-2">Drag & Drop here or</span>
            <div class="mt-2">
              <el-button type="primary">Browse files</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <div v-if="tab === 'gallery' || tab === 'selected'" class="flex">
          <el-button @click="visible = false">Hủy</el-button>
          <div class="flex-1"></div>
          <el-button
            type="success"
            icon="el-icon-finished"
            :disabled="!selected.length"
            @click="handleFinish"
          >
            Xác nhận
          </el-button>
        </div>

        <div v-if="tab === 'upload'" class="flex">
          <el-button @click="visible = false">Hủy</el-button>
          <div class="flex-1"></div>
          <el-button
            v-if="filesForUpload.length > 0"
            type="primary"
            icon="el-icon-upload"
            @click="upload"
          >
            Upload ({{ filesForUpload.length }}) file
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-image
      ref="preview"
      :src="previewUrl"
      :preview-src-list="[previewUrl]"
      style="display: none"
    ></el-image>

    <input
      v-show="false"
      ref="inputFile"
      type="file"
      multiple
      accept="image/*"
      @change="onPickFile"
    />
  </div>
</template>

<script>
import * as qs from 'qs'
import { mapState } from 'vuex'
import numeral from 'numeral'
import _ from '@/utils/lodash'
import { uniqueId } from '~/utils'

export default {
  props: {
    value: {
      type: null,
    },
    multiple: {
      type: Boolean,
    },
    valueType: {
      type: String,
      default: 'object',
    },
    // sử dụng để lấy các trường vào value
    valueFields: {
      type: Array,
      default: () => [
        'id',
        'url',
        'name',
        'mimetype',
        'dimension',
        'size',
        'alt',
        'caption',
      ],
    },
    limit: {
      type: Number,
      default: 10,
    },
  },

  data() {
    return {
      visible: false,
      medias: [],
      tab: 'gallery',
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

  computed: {
    ...mapState('shop', ['currentShop']),
    valueItems() {
      if (this.multiple)
        return Array.isArray(this.value)
          ? this.value.map(this.parseValueItem)
          : []
      return this.value ? [this.parseValueItem(this.value)] : []
    },
  },

  watch: {
    tab(value) {
      if (value === 'gallery') this.fetchMedias()
    },
  },

  created() {
    this.fetchMedias()
  },

  methods: {
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
      } else if (!this.multiple) {
        this.selected = [media]
      } else if (this.selected.length < this.limit) {
        this.selected.push(media)
      }
    },

    show() {
      this.visible = true
      this.selected = [...this.valueItems]
      this.filesForUpload = []
      this.fetchMedias({ page: 1 })
    },

    hide() {
      this.visible = false
      this.selected = []
      this.filesForUpload = []
    },

    parseValueItem(value) {
      if (!value) return value
      if (typeof value === 'string') {
        return {
          id: uniqueId(),
          url: value,
        }
      } else {
        return {
          ...value,
          id: value.id || uniqueId(),
        }
      }
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
                shop: this.currentShop.id,
              },
              sort: ['-createdAt'],
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

    pickFile() {
      this.$refs.inputFile.value = null
      this.$refs.inputFile.click()
    },

    onPickFile(e) {
      const files = e.target.files
      for (const file of files) {
        this.filesForUpload.push({
          id: uniqueId(),
          name: file.name,
          size: file.size,
          mimetype: file.type,
          alt: '',
          caption: '',
          raw: file,
          progress: 0,
          uploading: false,
          error: false,
          response: null,
          url: URL.createObjectURL(file),
        })
      }
    },

    onDropFile(e) {
      const files = e.dataTransfer.files
      for (const file of files) {
        console.log(file)
        this.filesForUpload.push({
          id: uniqueId(),
          name: file.name,
          size: file.size,
          mimetype: file.type,
          alt: '',
          caption: '',
          raw: file,
          progress: 0,
          uploading: false,
          error: false,
          response: null,
          url: URL.createObjectURL(file),
        })
      }
    },

    deleteUploadMedia(media) {
      const index = this.filesForUpload.indexOf(media)
      if (index >= 0) this.filesForUpload.splice(index, 1)
    },

    async upload() {
      this.uploading = true
      try {
        await Promise.all(
          this.filesForUpload.map(async (file) => {
            try {
              file.uploading = true

              const formData = new FormData()
              formData.append('file', file.raw)
              formData.append(
                'fileInfo',
                JSON.stringify({
                  name: file.name,
                  alt: file.alt,
                  caption: file.caption,
                })
              )
              formData.append('shop_id', this.currentShop.id)

              const response = await this.$axios.$post(
                '/media/upload',
                formData,
                {
                  onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                      (progressEvent.loaded / progressEvent.total) * 100
                    )
                    file.progress = percentCompleted
                  },
                }
              )

              file.response = response

              Object.assign(
                file,
                _.pick(response, 'id', 'name', 'alt', 'caption', 'url')
              )

              return response
            } catch (error) {
              console.error(`upload error`, file, error)
              file.error = error
            }
          })
        )
      } catch (error) {
        console.error(`Upload error`, error)
      }
      const uploadSuccess = this.filesForUpload
        .filter((e) => e.response)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      const uploadError = this.filesForUpload.filter((e) => !e.response)
      this.$message.success(`Đã tải lên thành công ${uploadSuccess.length}`)
      this.filesForUpload = uploadError
      this.uploading = false

      // select and swich to gallery tab
      if (this.multiple) {
        this.selected.push(...uploadSuccess.map((e) => e.response))
      } else {
        this.selected = [uploadSuccess[0].response]
      }
      this.tab = 'gallery'
    },

    mediaToValue(media) {
      if (this.valueType === 'string') return media.url
      return _.pick(media, this.valueFields)
    },

    handleFinish() {
      if (this.multiple) {
        const value = this.selected.map(this.mediaToValue)
        this.$emit('input', value)
      } else {
        this.$emit(
          'input',
          this.selected[0] ? this.mediaToValue(this.selected[0]) : null
        )
      }
      this.hide()
    },

    deleteValue(_item, index) {
      if (this.multiple) {
        this.value.splice(index, 1)
        this.$emit('input', this.value)
      } else {
        this.$emit('input', null)
      }
    },
  },
}
</script>

<style lang="scss">
.media-select-dialog {
  margin-top: 5vh !important;
  margin-bottom: 0 !important;

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

.media-select {
  .value-item {
    @apply rounded-lg;
    position: relative;
    width: 128px;
    height: 128px;
    overflow: hidden;
  }
}
</style>
