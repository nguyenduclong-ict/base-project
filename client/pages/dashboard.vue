<template>
  <div class="p-8">
    <div class="mb-8 flex gap-8">
      <el-input
        prefix-icon="el-icon-search"
        placeholder="Tìm kiếm shop"
        class="max-w-xs"
      ></el-input>
      <el-button icon="el-icon-plus" type="primary">Thêm shop</el-button>
    </div>
    <div class="flex gap-8">
      <nuxt-link
        :to="`/${shop.code}/statistic`"
        v-for="shop in shops"
        :key="shop.id"
        class="cursor-pointer"
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
  computed: {
    ...mapGetters('shop', ['shops']),
  },
}
</script>

<style lang="scss" scoped></style>
