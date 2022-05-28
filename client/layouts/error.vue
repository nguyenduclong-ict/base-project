<template>
  <div class="layout-error">
    <Error404 v-if="error.statusCode === 404" />
    <Error403 v-if="error.statusCode === 403" />
  </div>
</template>

<script>
import Error403 from '~/components/Errors/Error403.vue'
import Error404 from '~/components/Errors/Error404.vue'
export default {
  layout: 'empty',
  components: { Error404, Error403 },
  props: ['error'],
}
</script>

<style lang="scss" scoped></style>
