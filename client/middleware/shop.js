export default function ({ route, $auth, redirect, store }) {
  if (route.params.shopCode) {
    const shop = $auth.user.shops.find(shop => shop.code === route.params.shopCode)
    if (!shop) redirect('/dashboard')
    else {
      store.commit('shop/SET_CURRENT_SHOP', shop)
    }
  } else {
    store.commit('shop/SET_CURRENT_SHOP', null)
  }
}
