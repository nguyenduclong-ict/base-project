export const state = () => ({
  sidebar: true,
})

export const mutations = {
  TOGGLE_SIDEBAR(state, value) {
    state.sidebar = value ?? !state.sidebar
  },
}
