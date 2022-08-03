export const state = () => ({
  currentShop: null
})

export const getters = {
  shops(state, getters, rootState) {
    return rootState.auth?.user?.shops || []
  }
}

export const mutations = {
  SET_CURRENT_SHOP(state, value) {
    state.currentShop = value
  }
}
