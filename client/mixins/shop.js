import { mapState } from 'vuex';

export const ShopMixin = {
  computed: {
    ...mapState('shop', ['currentShop'])
  },
}
