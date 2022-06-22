<template>
  <div id="layout-default">
    <Sidebar id="sidebar" />
    <div class="overlay" v-if="sidebar"></div>
    <el-scrollbar id="content" :wrap-style="[{ maxHeight: '100vh' }]">
      <nuxt />
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Sidebar from '~/components/Layout/Sidebar.vue'
export default {
  components: { Sidebar },
  computed: {
    ...mapState(['sidebar']),
  },
}
</script>

<style lang="scss" scoped>
#layout-default {
  display: flex;

  #sidebar {
    flex: none;
    z-index: 2;
  }

  #content {
    flex: 1;
  }
}

@media screen and (max-width: 786px) {
  #layout-default {
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1;
      background: #00000088;
    }
  }
}
</style>
