<template>
  <div></div>
</template>

<script>
export default {
  asyncData({ error }) {
    error({ statusCode: 403 })
  },
}
</script>

<style lang="scss" scoped></style>
