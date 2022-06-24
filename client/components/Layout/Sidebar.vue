<template>
  <div class="sidebar overflow-hidden" :class="[sidebar && 'sidebar-opened']">
    <div style="height: 48px" class="logo z-10">
      <nuxt-link to="/" class="w-full h-full flex items-center justify-center">
        <svg-icon name="nuxt" style="color: #fff; height: 32px; width: auto" />
      </nuxt-link>
    </div>
    <el-scrollbar
      style="height: calc(100vh - 48px); z-index: -1"
      :wrap-style="[{ height: 'calc(100vh - 48px)', overflowX: 'hidden' }]"
    >
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
            :class="item.icon && 'has-icon'"
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
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  components: {
    ElMenuItem: MenuItem,
  },

  data() {
    return {
      defaultActive: this.$route.path,
    }
  },

  watch: {
    '$route.path'(value) {
      this.defaultActive = value
    },
  },

  computed: {
    ...mapState(['sidebar', 'sidebarItems']),
    ...mapGetters('permission', ['userPermissions', 'isFullPermission']),
    items() {
      const items = []
      this.sidebarItems?.forEach((item) => {
        if (this.checkSidebarItemPermisison(item)) {
          items.push({
            ...item,
            children:
              item.children?.length > 0 &&
              item.children.filter(this.checkSidebarItemPermisison),
          })
        }
      })
      return items
    },
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
    checkSidebarItemPermisison(item) {
      return (
        !item.permission ||
        this.isFullPermission ||
        this.userPermisisons.includes(item.permission)
      )
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
  .logo {
    background: #364c79;
    // box-shadow: 0 2px 2px 0 rgba(#141c2d, 0.14),
    //   0 3px 1px -2px rgba(#141c2d, 0.12), 0 1px 5px 0 rgba(#141c2d, 0.2);
  }

  transition: 0.3s;

  margin-left: -1 * $sidebar-width;

  &.sidebar-opened {
    margin-left: 0px;
  }

  width: $sidebar-width;
  .el-menu-sidebar {
    width: $sidebar-width;
    min-height: 100vh;
    border-right: solid 1px rgb(54, 76, 121) !important;
  }

  .el-submenu__title,
  .el-menu-item {
    height: 48px;
    line-height: 48px;
  }

  .el-submenu.has-icon {
    .el-menu-item {
      padding-left: 52px !important;
    }
  }

  .el-submenu__title i,
  .el-menu-item:not(.is-active) i {
    color: #fff;
  }

  .el-menu-item:hover,
  .el-menu-item.is-active {
    background-color: rgb(43, 61, 97) !important;
  }
}

@media screen and (max-width: 786px) {
  .sidebar {
    #toogle-sidebar-button {
      display: block;
      position: absolute;
      bottom: 128px;
      left: $sidebar-width;
      transition: 0.3s;
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
