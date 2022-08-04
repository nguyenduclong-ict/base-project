export const getters = {
  userPermissions(state, getters, rootState) {
    const user = rootState.auth?.user
    if (!user) return []

    const permisisons = []

    user.roles.forEach((role) => {
      permisisons.push(...role.permissions)
    })

    return permisisons
  },
  shopPermissions(state, getters, rootState) {
    const currentShop = rootState.shop.currentShop
    const user = rootState.auth?.user
    const permisisons = []
    if (!currentShop) return []

    user.roles.forEach((role) => {
      if (role.shops.include(currentShop.id))
        permisisons.push(...role.permissions)
    })

    return permisisons
  },
  isFullPermission(state, getters, rootState, rootGetters) {
    const user = rootState.auth?.user
    if (!user) return false
    return user.roles.some(role => role.full_permission)
  }
}
