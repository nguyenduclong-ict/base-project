<template>
  <div class="page-content">
    <div class="mb-8 flex gap-4">
      <InputSearch
        :debounce="0"
        placeholder="Tìm kiếm shop"
        class="max-w-xs"
        @search="handleSearchShop"
      ></InputSearch>
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="() => $router.push('/shops/create')"
      >
        Thêm shop
      </el-button>
    </div>
    <div class="flex gap-8">
      <nuxt-link
        v-for="shop in shops"
        :key="shop.id"
        style="min-width: 256px; min-height: 128px"
        :to="`/${shop.code}/statistic`"
        class="cursor-pointer"
        @click.native="handleSelectShop(shop)"
      >
        <el-card class="w-full h-full">
          <Avatar
            :src="shop.image_url"
            :name="shop.name"
            :color="shop.color"
            :size="32"
          />
          {{ shop.name }}
        </el-card>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputSearch from '~/components/Common/InputSearch.vue'
import { searchString } from '~/utils'
import _ from '~/utils/lodash'
export default {
  components: { InputSearch },
  layout: 'dashboard',

  data() {
    return {
      shops: _.cloneDeep(this.$store.getters?.['shop/shops'] || []),
    }
  },

  methods: {
    handleSelectShop(shop) {
      localStorage.setItem('current_shop', shop.id)
    },

    handleSearchShop(query) {
      if (!query) {
        this.shops = _.cloneDeep(this.$store.getters?.['shop/shops'] || [])
        return
      }
      this.shops = _.cloneDeep(
        this.$store.getters['shop/shops'].filter((shop) =>
          searchString([shop.name], query)
        )
      )
    },
  },
}
</script>

<style lang="scss" scoped></style>
