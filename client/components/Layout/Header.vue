<template>
  <div class="app-header shadow-base">
    <div
      class="toggle-button flex justify-center items-center"
      @click="TOGGLE_SIDEBAR()"
    >
      <svg-icon name="menu"></svg-icon>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState(['sidebar']),
  },

  methods: {
    ...mapMutations(['TOGGLE_SIDEBAR']),
  },
}
</script>

<style lang="scss">
.app-header {
  height: 48px;

  .toggle-button {
    width: 48px;
    height: 48px;
    cursor: pointer;
  }
}
</style>
