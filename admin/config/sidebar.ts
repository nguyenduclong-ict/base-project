interface SidebarItem {
  title?: string
  route?: string
  icon?: string
  key?: string
  children?: SidebarItem[]
}

export const dashboardSidebar: SidebarItem[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    icon: 'dashboard',
  },
  {
    title: 'Cửa hàng',
    route: '/shops',
    icon: 'shop',
  },
]

export const shopSidebar: SidebarItem[] = [
  {
    title: 'Thống kê',
    route: '/{shopCode}/statistic',
    icon: 'el-icon-data-analysis',
  },
  {
    title: 'Tạo đơn',
    route: '/{shopCode}/order/create',
    icon: 'el-icon-shopping-cart-full',
  },
  {
    title: 'Bán hàng',
    key: 'order',
    icon: 'el-icon-sell',
    children: [
      { title: 'Đơn hàng', route: '/{shopCode}/product', icon: '' },
      { title: 'Đối soát', route: '/{shopCode}/order/cross-check', icon: '' },
      { title: 'Trả hàng', route: '/{shopCode}/order/return', icon: '' },
    ],
  },
  {
    title: 'Sản phẩm',
    key: 'product',
    icon: 'el-icon-box',
    children: [
      { title: 'Danh sách sản phẩm', route: '/{shopCode}/product' },
      { title: 'Nhập hàng', route: '/{shopCode}/product/import' },
      { title: 'Danh mục', route: '/{shopCode}/product/category' },
    ],
  },
  {
    title: 'Cài đặt',
    icon: 'el-icon-setting',
    key: 'setting',
    children: [
      { title: 'Thư viện ảnh', route: '/{shopCode}/setting/media' },
      { title: 'Thông tin cửa hàng', route: '/{shopCode}/setting/info' },
    ],
  },
]
