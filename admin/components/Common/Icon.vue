<template>
  <i
    v-if="isElIcon"
    :class="[name]"
    :style="{
      color,
      width: parsePx(width || size),
      height: parsePx(height || size),
    }"
  ></i>
  <svg-icon
    v-else
    class="el-icon-x-svg"
    :name="name"
    :style="{
      color,
      width: parsePx(width || size),
      height: parsePx(height || size),
    }"
  ></svg-icon>
</template>

<script>
export default {
  props: {
    name: String,
    color: String,
    width: [Number, String],
    height: [Number, String],
    size: [Number, String],
  },

  computed: {
    isElIcon() {
      return this.name && this.name.startsWith('el-icon-')
    },
  },

  methods: {
    parsePx(value) {
      if (!value) return null
      if (!isNaN(value)) return value + 'px'
      return value
    },
  },
}
</script>

<style lang="scss" scoped>
.el-icon-x-svg {
  display: inline-block;
}
</style>
