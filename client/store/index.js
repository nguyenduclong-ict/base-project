export const state = () => ({
  sidebar: true,
  sidebarItems: [
    {
      title: 'Dashboard',
      route: '/',
      icon: 'el-icon-s-home',
    },
    {
      title: 'Kho hàng',
      key: '/product',
      icon: 'el-icon-box',
      children: [
        { title: 'Danh sách sản phẩm', route: '/product', icon: '' },
        { title: 'Tồn kho', route: '/product/create', icon: '' },
      ],
    },
  ]
})

export const mutations = {
  TOGGLE_SIDEBAR(state, value) {
    state.sidebar = value ?? !state.sidebar
  },
}
