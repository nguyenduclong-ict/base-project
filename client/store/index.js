export const state = () => ({
  sidebar: true,
  sidebarItems: [
    {
      title: 'Dashboard',
      route: '/dashboard',
      icon: 'el-icon-s-home',
      shop: false
    },
    {
      title: 'Thống kê',
      route: '/{shopCode}/statistic',
      icon: 'el-icon-data-analysis',
      shop: true
    },
    {
      title: 'Kho hàng',
      key: 'warehouse',
      icon: 'el-icon-box',
      shop: true,
      children: [
        { title: 'Danh sách sản phẩm', route: '/{shopCode}/product', icon: '' },
        { title: 'Tồn kho', route: '/{shopCode}/product/create', icon: '' },
      ],
    },
  ]
})

export const mutations = {
  TOGGLE_SIDEBAR(state, value) {
    state.sidebar = value ?? !state.sidebar
  },
}
