<template>
  <div class="upload-image">
    <input
      v-show="false"
      ref="input"
      type="file"
      accept="image/*"
      @change="handleSelectFile"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Array],
      default: false,
    },
  },

  data() {
    return {}
  },

  methods: {
    upload() {},
    handleSelectFile() {},
  },
}
</script>

<style lang="scss" scoped></style>
