<template>
  <img
    class="avatar object-cover"
    v-if="src"
    :src="src"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      'border-radius': `${size / 2}px`,
    }"
  />
  <span
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      'border-radius': `${size / 2}px`,
      'background-color': color,
      color: '#ffffff',
      'font-size': `${size / 2}px`,
    }"
    class="avatar text flex items-center justify-center"
    v-else
  >
    <span>{{ shortName }}</span>
  </span>
</template>

<script>
export default {
  props: {
    src: String,
    size: Number,
    name: String,
    color: String,
  },
  computed: {
    shortName() {
      return this.name
        .split(' ')
        .slice(0, 2)
        .map((e) => e.charAt(0))
        .join('')
    },
  },
}
</script>

<style lang="scss">
.avatar {
  display: inline-flex;
}
</style>
