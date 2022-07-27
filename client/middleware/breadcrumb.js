export default function ({ route, store }) {
  let breadcrumb = []
  for (const meta of route.meta) {
    if (meta.breadcrumb) breadcrumb = meta.breadcrumb
  }
  store.commit('SET_BREADCRUMB', breadcrumb)
}
