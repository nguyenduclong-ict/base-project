<template>
  <div class="app-editor">
    <VueEditor
      ref="editor"
      :value="value"
      :placeholder="placeholder"
      :custom-modules="customModules"
      :editor-options="options"
      @input="(v) => $emit('input', v)"
    />

    <MediaSelect
      ref="mediaSelect"
      v-model="imagesSelected"
      style="display: none"
      multiple
      :show-trigger="false"
      @input="onSelectMedia"
    />

    <el-image
      ref="preview"
      :src="previewUrl"
      :preview-src-list="[previewUrl]"
      style="display: none"
    ></el-image>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor/dist/vue2-editor.core.js'
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'
import ImageResize from 'quill-image-resize-module'
import { mapState } from 'vuex'
import MediaSelect from '../MediaSelect.vue'

export default {
  components: { VueEditor, MediaSelect },

  props: {
    value: { type: String },
    placeholder: String,
  },

  data() {
    return {
      quill: null,
      previewUrl: null,
      imagesSelected: [],
      customModules: [
        { alias: 'imageResize', module: ImageResize },
        { alias: 'imageDropAndPaste', module: QuillImageDropAndPaste },
      ],
      options: {
        modules: {
          imageResize: {},
          imageDropAndPaste: {
            handler: this.imageHandler,
          },
          toolbar: {
            container: [
              [{ header: [false, 1, 2, 3, 4, 5, 6] }],
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              [
                { align: '' },
                { align: 'center' },
                { align: 'right' },
                { align: 'justify' },
              ],
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ color: [] }, { background: [] }],
              ['link', 'image'],
              ['clean'],
            ],
            handlers: {
              image: () => {
                this.imagesSelected = []
                this.$refs.mediaSelect.show()
              },
            },
          },
        },
      },
    }
  },

  computed: {
    ...mapState('shop', ['currentShop']),
  },

  mounted() {
    this.quill = this.$refs.editor.quill
    this.quill.container.addEventListener('dblclick', this.onDblClick)
  },

  beforeDestroy() {
    this.quill.container.removeEventListener('dblclick', this.onDblClick)
  },

  methods: {
    onSelectMedia(medias) {
      console.log('medias', medias)
      medias.forEach((media) => {
        this.insertEmbedToCurrentCursor('image', media.url, {
          attribute: { width: 100 },
        })
      })
    },

    onDblClick(event) {
      if (event.target === this.quill.getModule('imageResize').overlay) {
        const img = this.quill.getModule('imageResize').img
        if (img.src) {
          this.previewImage(img.src)
        }
      }
    },

    insertEmbedToCurrentCursor(type, value) {
      const caretPosition = this.quill.getSelection(true)
      this.quill.insertEmbed(caretPosition.index, type, value)
    },

    async imageHandler(_imageDataUrl, _type, imageData) {
      const file = imageData.toFile()
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
        'fileInfo',
        JSON.stringify({
          name: file.name,
          alt: file.alt,
          caption: file.caption,
        })
      )
      if (this.currentShop) formData.append('shop_id', this.currentShop.id)
      const response = await this.$axios.$post('/media/upload', formData)
      this.insertEmbedToCurrentCursor('image', response.url)
    },

    previewImage(url) {
      this.previewUrl = url
      this.$nextTick(() => {
        this.$refs.preview.clickHandler()
      })
    },
  },
}
</script>

<style lang="scss">
@import 'quill/dist/quill.core.css';
@import 'quill/dist/quill.bubble.css';
@import 'quill/dist/quill.snow.css';

.app-editor {
  .quillWrapper {
    background-color: #fff;
  }

  .ql-picker-options {
    z-index: 1000;
  }

  .ql-editor {
    min-height: 200px;
  }

  .ql-toolbar {
    padding-top: 0px;
    padding-bottom: 0px;
    border-radius: 4px 4px 0 0;
  }

  .ql-container {
    border-radius: 0 0 4px 4px;
  }

  .ql-picker-label:before {
    position: absolute;
  }
}
</style>
