export const state = () => ({
  sidebar: true,
  breadcrumb: [],
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
      title: 'Tạo đơn',
      route: '/{shopCode}/order/create',
      icon: 'el-icon-shopping-cart-full',
      shop: true
    },
    {
      title: 'Bán hàng',
      key: 'order',
      icon: 'el-icon-sell',
      shop: true,
      children: [
        { title: 'Đơn hàng', route: '/{shopCode}/product', icon: '' },
        { title: 'Đối soát', route: '/{shopCode}/order/cross-check', icon: '' },
        { title: 'Trả hàng', route: '/{shopCode}/order/return', icon: '' },
      ],
    },
    {
      title: 'Kho hàng',
      key: 'warehouse',
      icon: 'el-icon-box',
      shop: true,
      children: [
        { title: 'Danh sách sản phẩm', route: '/{shopCode}/product', icon: '' },
        { title: 'Nhập hàng', route: '/{shopCode}/import', icon: '' },
        { title: 'Xuất hàng', route: '/{shopCode}/export', icon: '' },
        { title: 'Tồn kho', route: '/{shopCode}/product/create', icon: '' },
      ],
    },
  ]
})

export const mutations = {
  TOGGLE_SIDEBAR(state, value) {
    state.sidebar = value ?? !state.sidebar
  },
  SET_BREADCRUMB(state, value) {
    state.breadcrumb = value
  }
}
