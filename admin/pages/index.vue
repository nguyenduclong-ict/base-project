<template>
  <div></div>
</template>

<script>
export default {
  layout: 'dashboard',
  asyncData({ redirect, $auth }) {
    const shopId = localStorage.getItem('current_shop')
    const shop = $auth.user.shops.find((shop) => shop.id === shopId)
    if (shop) {
      redirect(`/${shop.code}/statistic`)
    }
  },
}
</script>

<style lang="scss" scoped></style>
