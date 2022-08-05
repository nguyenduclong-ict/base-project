<template>
  <div class="input-tag el-input el-input--medium">
    <div class="el-input__inner">
      <el-tag
        v-for="(item, index) in value"
        :key="allowDupplicate ? item + index : item"
        disable-transitions
        :effect="effect"
        :type="type"
        size="small"
        closable
        @close="deleteTag(index)"
      >
        {{ item }}
      </el-tag>
      <span v-if="isEmpty" style="width: 11px"></span>
      <input
        v-model="input"
        class="el-input__inner"
        type="text"
        :placeholder="isEmpty && placeholder"
        @keydown.enter="createTag"
        @keydown.delete="keydownDelete"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: Array },
    allowDupplicate: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'info',
    },
    effect: {
      type: String,
      default: 'light',
    },
    placeholder: String,
  },

  data() {
    return {
      input: '',
    }
  },

  computed: {
    isEmpty() {
      return !this.value || this.value.length === 0
    },
  },

  methods: {
    createTag() {
      const item = this.input.trim()
      if (item) {
        this.input = ''
        if (!this.allowDupplicate && this.value?.includes(item)) {
          return
        }
        const value = this.value || []
        value.push(item)
        this.$emit('input', value)
        this.$emit('change', value)
      }
    },

    deleteTag(index) {
      if (this.value) this.value.splice(index, 1)
      this.$emit('input', this.value)
      this.$emit('change', this.value)
    },

    keydownDelete() {
      if (this.input === '' && this.value?.length > 0) {
        this.deleteTag(this.value.length - 1)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.input-tag {
  .el-input__inner {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 2px;
    padding-bottom: 2px;
    display: flex;
    flex-wrap: wrap;
    height: auto;
    align-items: center;

    .el-tag {
      margin: 2px 0 2px 4px;
    }

    input.el-input__inner {
      width: 10%;
      margin-left: 4px;
      margin-right: 4px;
      flex-grow: 1;
      height: 30px;
      line-height: 30px;
      outline: none !important;
      border: none !important;
    }
  }
}
</style>
