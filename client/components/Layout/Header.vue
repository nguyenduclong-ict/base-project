<template>
  <div class="app-header shadow-base bg-white flex gap-2">
    <div
      class="toggle-button flex justify-center items-center"
      @click="TOGGLE_SIDEBAR()"
    >
      <svg-icon name="menu"></svg-icon>
    </div>

    <el-breadcrumb
      v-if="breadcrumb.length > 0"
      separator="/"
      class="flex items-center"
    >
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumb"
        :key="item.path || index"
        :to="{ path: item.path }"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['sidebar']),
    breadcrumb() {
      const result = []
      const breadcrumb = this.$store.state.breadcrumb

      breadcrumb.forEach((item) => {
        const clone = { ...item }
        if (clone.path) clone.path = this.replaceRouteParams(clone.path)
        result.push(clone)
      })

      return result
    },
  },

  methods: {
    ...mapMutations(['TOGGLE_SIDEBAR']),
    replaceRouteParams(path = '') {
      Object.keys(this.$route.params).forEach((key) => {
        path = path.replaceAll(`{${key}}`, this.$route.params[key])
      })
      return path
    },
  },
}
</script>

<style lang="scss">
.app-header {
  height: 48px;

  .toggle-button {
    width: 48px;
    height: 48px;
    cursor: pointer;
  }
}
</style>
