<template>
  <div class="sidebar" :class="[sidebar && 'sidebar-opened']">
    <el-scrollbar :wrap-style="[{ height: '100vh' }]">
      <el-menu
        :default-active="defaultActive"
        class="el-menu-sidebar"
        background-color="#364c79"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <template v-for="item in items">
          <el-submenu
            v-if="item.children"
            :key="item.key || item.route"
            :index="item.key || item.route"
          >
            <template slot="title">
              <i v-if="item.icon" :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>

            <el-menu-item
              v-for="child in item.children"
              :key="child.key || child.route"
              :index="child.key || child.route"
              :route="child.route"
            >
              <i v-if="child.icon" :class="child.icon"></i>
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item
            v-else
            :key="item.key || item.route"
            :index="item.key || item.route"
            :route="item.route"
          >
            <i v-if="item.icon" :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>

    <button id="toogle-sidebar-button" @click="TOGGLE_SIDEBAR()">
      <i v-if="sidebar" class="el-icon-d-arrow-left"></i>
      <i v-else class="el-icon-d-arrow-right"></i>
    </button>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    ElMenuItem: MenuItem,
  },

  computed: {
    ...mapState(['sidebar']),
  },

  data() {
    return {
      defaultActive: this.$route.path,
      items: [
        {
          title: 'Dashboard',
          route: '/',
          icon: '',
        },
        {
          title: 'Product',
          key: '/product',
          children: [
            { title: 'Dashboard', route: '/product', icon: '' },
            { title: 'Dashboard', route: '/product/create', icon: '' },
          ],
        },
      ],
    }
  },

  methods: {
    ...mapMutations(['TOGGLE_SIDEBAR']),
    onResize() {
      if (window.innerWidth <= 786) {
        this.TOGGLE_SIDEBAR(false)
      } else {
        this.TOGGLE_SIDEBAR(true)
      }
    },
  },

  mounted() {
    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<style lang="scss">
$sidebar-width: 240px;

.sidebar {
  width: $sidebar-width;
  .el-menu-sidebar {
    width: $sidebar-width;
    min-height: 100vh;
  }

  #toogle-sidebar-button {
    display: none;
  }
}

@media screen and (max-width: 786px) {
  .sidebar {
    #toogle-sidebar-button {
      display: block;
      position: absolute;
      bottom: 128px;
      left: $sidebar-width;
      transition: 0.5s;
      color: white;
      background: #409eff;
      padding: 4px;
      border-radius: 0 4px 4px 0;
      z-index: 1;
    }

    top: 0px;
    position: fixed;
    left: -1 * $sidebar-width;
    transition: 0.5s;

    &.sidebar-opened {
      left: 0;
    }
  }
}
</style>
