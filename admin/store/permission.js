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
  isFullPermission(state, getters, rootState, rootGetters) {
    const user = rootState.auth?.user
    if (!user) return false
    return user.roles.some(role => role.full_permission)
  }
}
