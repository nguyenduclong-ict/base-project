<template>
  <div
    class="sidebar overflow-hidden"
    :class="[
      sidebarOpened && 'sidebar-opened',
      `--logo-height=${logoHeight}px`,
    ]"
  >
    <el-popover
      v-if="currentShop"
      v-model="isShowSelectShop"
      placement="right"
      popper-class="popover-select-shop"
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
          <div class="mt-2 truncate text-center">
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
          v-for="shop in user.shops"
          :key="shop.id"
          :to="`/${shop.code}/statistic`"
          class="shop-item cursor-pointer flex items-center p-2"
          @click.native="isShowSelectShop = false"
        >
          <Avatar
            :src="shop.image_url"
            :name="shop.name"
            :color="shop.color"
            :size="32"
          />
          <span class="ml-2 truncate">
            {{ shop.name }}
          </span>
        </nuxt-link>
      </el-scrollbar>
    </el-popover>

    <el-scrollbar
      :style="`height: calc(100vh - ${logoHeight}px);`"
      :wrap-style="[
        { height: `calc(100vh - ${logoHeight}px)`, overflowX: 'hidden' },
      ]"
    >
      <el-menu
        :default-active="defaultActive"
        class="el-menu-sidebar"
        background-color="#f7f7f7"
        text-color="#444"
        active-text-color="#000"
        :collapse="!sidebarOpened"
        :collapse-transition="false"
      >
        <template v-for="item in menuItems">
          <el-submenu
            v-if="item.children"
            :key="item.key || item.route"
            :index="item.key || item.route"
            :class="item.icon && 'has-icon'"
          >
            <template slot="title">
              <Icon v-if="item.icon" :name="item.icon" />
              <span>{{ item.title }}</span>
            </template>

            <el-menu-item
              v-for="child in item.children"
              :key="child.key || child.route"
              :index="child.key || child.route"
              :route="child.route"
            >
              <Icon v-if="child.icon" :name="child.icon" />
              <span>{{ child.title }}</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item
            v-else
            :key="item.key || item.route"
            :index="item.key || item.route"
            :route="item.route"
          >
            <Icon v-if="item.icon" :name="item.icon" />
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import Avatar from '../Common/Avatar.vue'
import MenuItem from './MenuItem.vue'

export default {
  components: {
    ElMenuItem: MenuItem,
    Avatar,
  },

  props: {
    items: {
      type: Array,
      default: [],
    },
    shop: {
      type: Boolean,
    },
  },

  data() {
    return {
      isShowSelectShop: false,
      defaultActive: '',
    }
  },

  computed: {
    ...mapState({
      sidebarOpened: (state) => state.sidebar,
    }),
    ...mapState(['sidebarItems', 'sidebarKey']),
    ...mapState('auth', ['user']),
    ...mapState('shop', ['currentShop']),
    ...mapGetters('permission', [
      'isFullPermission',
      'userPermissions',
      'shopPermissions',
    ]),
    menuItems() {
      const items = []
      this.items?.forEach((item) => {
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

  watch: {
    '$route.path'(value) {
      this.defaultActive = this.sidebarKey || value
    },
  },

  created() {
    this.defaultActive = this.sidebarKey || this.$route.path
  },

  mounted() {
    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
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
      const userPermission = this.shop
        ? this.shopPermission
        : this.userPermission

      return (
        !item.permission ||
        this.isFullPermission ||
        userPermission.includes(item.permission)
      )
    },
  },
}
</script>

<style lang="scss">
$sidebar-width: 240px;
$sidebar-small: 64px;
$bg-color: #f7f7f7;
$text-color: #444;
$active-color: #339ef0;

.popover-select-shop {
  background: $bg-color;
  padding: 0px;
  .popper__arrow::after {
    border-right-color: $bg-color !important;
  }

  .shop-item {
    color: $text-color;
  }

  .shop-item:hover {
    background-color: darken($color: $bg-color, $amount: 10) !important;
  }
}

.sidebar {
  transition: 0.3s;
  width: $sidebar-small;
  background: $bg-color;
  border-right: 1px solid #dedede;
  box-shadow: 0 1px 6px 1px rgb(0 0 0 / 10%);

  .logo {
    background: $bg-color;
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
    border-right: none;
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
    color: $text-color;
  }

  .el-submenu__title:hover,
  .el-menu-item:hover,
  .el-menu-item.is-active {
    background-color: lighten($color: $active-color, $amount: 33) !important;
  }

  .el-menu-item.is-active {
    border-right: solid 2px $active-color;
    font-weight: bold;
  }
}

.el-menu--popup {
  .el-submenu__title i,
  .el-menu-item:not(.is-active) i {
    color: $text-color;
  }

  .el-menu-item:hover,
  .el-menu-item.is-active {
    background-color: lighten($color: $active-color, $amount: 33) !important;
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
