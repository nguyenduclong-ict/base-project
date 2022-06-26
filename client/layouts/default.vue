<template>
  <div id="layout-default">
    <Sidebar id="sidebar" />
    <div class="overlay" v-if="sidebar" @click="TOGGLE_SIDEBAR()"></div>

    <div id="content">
      <Header />
      <el-scrollbar
        :wrap-style="[{ maxHeight: 'calc(100vh - 48px)', overflowX: 'hidden' }]"
      >
        <nuxt />
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Sidebar from '~/components/Layout/Sidebar.vue'
import Header from '~/components/Layout/Header.vue'
export default {
  components: { Sidebar, Header },
  computed: {
    ...mapState(['sidebar']),
  },
  methods: {
    ...mapMutations(['TOGGLE_SIDEBAR']),
  },
}
</script>

<style lang="scss" scoped>
#layout-default {
  display: flex;
  height: 100vh;

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
