<template>
  <div class="p-8">
    <div class="mb-8 flex gap-8">
      <el-input
        prefix-icon="el-icon-search"
        placeholder="Tìm kiếm shop"
        class="max-w-xs"
      ></el-input>
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
        :to="`/${shop.code}/statistic`"
        class="cursor-pointer"
        @click.native="handleSelectShop(shop)"
      >
        <el-card>
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
export default {
  layout: 'dashboard',
  computed: {
    ...mapGetters('shop', ['shops']),
  },

  methods: {
    handleSelectShop(shop) {
      localStorage.setItem('current_shop', shop.id)
    },
  },
}
</script>

<style lang="scss" scoped></style>
