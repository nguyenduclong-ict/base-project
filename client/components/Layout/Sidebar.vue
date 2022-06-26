<template>
  <div
    class="sidebar overflow-hidden"
    :class="[
      sidebarOpened && 'sidebar-opened',
      `--logo-height=${logoHeight}px`,
    ]"
  >
    <el-popover
      v-model="isShowSelectShop"
      placement="right"
      popper-class="popover-select-shop"
      v-if="currentShop"
    >
      <div
        slot="reference"
        :style="`height: ${logoHeight}px`"
        class="logo z-10 cursor-pointer flex items-center justify-center p-4"
      >
        <div v-if="sidebarOpened" class="flex flex-col items-center">
          <Avatar
            :src="currentShop.image_url"
            :name="currentShop.name"
            :color="currentShop.color"
            :size="56"
          />
          <div class="text-white mt-2 truncate text-center">
            {{ currentShop.name }}
          </div>
        </div>
        <Avatar
          v-else
          :src="currentShop.image_url"
          :name="currentShop.name"
          :color="currentShop.color"
          :size="32"
        />
      </div>

      <el-scrollbar
        style="max-width: 240px"
        :wrap-style="[{ maxHeight: '500px' }]"
        :view-style="[{ 'border-radius': '4px', overflow: 'hidden' }]"
      >
        <nuxt-link
          :to="`/${shop.code}/statistic`"
          v-for="shop in user.shops"
          :key="shop.id"
          class="shop-item cursor-pointer flex items-center p-2"
          @click.native="isShowSelectShop = false"
        >
          <Avatar
            :src="shop.image_url"
            :name="shop.name"
            :color="shop.color"
            :size="32"
          />
          <span class="ml-2 text-white truncate">
            {{ shop.name }}
          </span>
        </nuxt-link>
      </el-scrollbar>
    </el-popover>

    <el-scrollbar
      :style="`height: calc(100vh - ${logoHeight}px); z-index: -1`"
      :wrap-style="[
        { height: `calc(100vh - ${logoHeight}px)`, overflowX: 'hidden' },
      ]"
    >
      <el-menu
        :default-active="defaultActive"
        class="el-menu-sidebar"
        background-color="#364c79"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="!sidebarOpened"
        :collapse-transition="false"
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
import Avatar from '../Common/Avatar.vue'

export default {
  components: {
    ElMenuItem: MenuItem,
    Avatar,
  },

  data() {
    return {
      isShowSelectShop: false,
      defaultActive: this.$route.path,
    }
  },

  watch: {
    '$route.path'(value) {
      this.defaultActive = value
    },
  },

  computed: {
    ...mapState({
      sidebarOpened: (state) => state.sidebar,
    }),
    ...mapState(['sidebarItems']),
    ...mapState('auth', ['user']),
    ...mapState('shop', ['currentShop']),
    ...mapGetters('permission', ['userPermissions', 'isFullPermission']),
    items() {
      const items = []
      this.sidebarItems?.forEach((item) => {
        if (this.canShowSidebarItem(item)) {
          const copyOfItem = {
            ...item,
            children:
              item.children?.length > 0 &&
              item.children
                .filter(this.canShowSidebarItem)
                .map((child) => ({ ...child })),
          }

          if (this.currentShop) {
            if (copyOfItem.route) {
              copyOfItem.route = copyOfItem.route.replaceAll(
                '{shopCode}',
                this.currentShop.code
              )
            }
            if (copyOfItem.children?.length > 0) {
              copyOfItem.children.forEach((child) => {
                if (child.route) {
                  child.route = child.route.replaceAll(
                    '{shopCode}',
                    this.currentShop.code
                  )
                }
              })
            }
          }

          items.push(copyOfItem)
        }
      })
      return items
    },
    logoHeight() {
      return this.currentShop ? (this.sidebarOpened ? 128 : 48) : 0
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
    canShowSidebarItem(item) {
      if (typeof item.shop === 'boolean') {
        return !!this.currentShop === item.shop
      }
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
.popover-select-shop {
  background-color: #364c79;
  padding: 0px;
  .popper__arrow::after {
    border-right-color: #364c79 !important;
  }

  .shop-item:hover {
    background-color: rgb(43, 61, 97) !important;
  }
}

$sidebar-width: 240px;
$sidebar-small: 64px;

.sidebar {
  transition: 0.3s;
  width: $sidebar-small;
  background: #364c79;

  .logo {
    background: #364c79;
    // box-shadow: 0 2px 2px 0 rgba(#141c2d, 0.14),
    //   0 3px 1px -2px rgba(#141c2d, 0.12), 0 1px 5px 0 rgba(#141c2d, 0.2);
  }

  &.el-menu--collapse {
    width: $sidebar-small;
  }

  &.sidebar-opened {
    margin-left: 0px;
    width: $sidebar-width;
  }

  .el-menu-sidebar {
    min-height: calc(100vh - var(--logo-height));
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
    margin-left: -1 * $sidebar-width;
    top: 0px;
    position: fixed;
    left: -1 * $sidebar-width;
    width: $sidebar-width;

    &.sidebar-opened {
      left: 0;
    }

    .el-menu-sidebar {
      width: $sidebar-width;
    }
  }
}
</style>
