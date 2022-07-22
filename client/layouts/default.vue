<template>
  <div id="layout-default">
    <div id="sidebar-wrapper">
      <Sidebar id="sidebar" />
    </div>
    <div class="overlay" v-if="sidebar" @click="TOGGLE_SIDEBAR()"></div>

    <div id="content" :style="{ maxWidth: `calc(100vw - ${sidebarWidth}px)` }">
      <Header />
      <el-scrollbar
        id="content-scrollbar"
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
  data() {
    return {
      sidebarWidth: 0,
      sidebarObserver: null,
    }
  },
  mounted() {
    const observer = new ResizeObserver((entries) => {
      let rect = entries[0].contentRect
      this.sidebarWidth = rect.width
    })
    observer.observe(this.$el.querySelector('#sidebar-wrapper'))
    this.sidebarObserver = observer
  },

  beforeDestroy() {
    this.sidebarObserver.disconnect()
  },
}
</script>

<style lang="scss">
#layout-default {
  display: flex;
  height: 100vh;

  #sidebar-wrapper {
    flex: none;
    z-index: 2;
  }

  #content {
    flex: 1;
    background: #fafafa;
    position: relative;

    #content-scrollbar {
      margin-top: 4px;
    }
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
