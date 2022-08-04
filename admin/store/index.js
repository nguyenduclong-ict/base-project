import { dashboardSidebar, shopSidebar } from '~/config/sidebar'

export const state = () => ({
  sidebar: true,
  breadcrumb: [],
  sidebarKey: '',
  sidebarItems: shopSidebar,
  dashboardSidebar
})

export const mutations = {
  TOGGLE_SIDEBAR(state, value) {
    state.sidebar = value ?? !state.sidebar
  },
  SET_BREADCRUMB(state, value) {
    state.breadcrumb = value
  },
  SET_SIDEBAR_KEY(state, value) {
    state.sidebarKey = value
  }
}
