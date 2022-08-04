export default function ({ route, store }) {
  console.log('[middleware]: meta');
  let breadcrumb = []
  let sidebarKey = ''
  for (const meta of route.meta) {
    if (meta.breadcrumb) breadcrumb = meta.breadcrumb
    if (meta.sidebarKey) {
      sidebarKey = meta.sidebarKey
      if (store.state.shop.currentShop) {
        sidebarKey = sidebarKey.replaceAll(
          '{shopCode}',
          store.state.shop.currentShop.code
        )
      }
    }
  }
  store.commit('SET_BREADCRUMB', breadcrumb)
  store.commit('SET_SIDEBAR_KEY', sidebarKey)
}
