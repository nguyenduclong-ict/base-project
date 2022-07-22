<template>
  <div class="p-5">
    <!-- <DataTable :config="config" /> -->

    <div
      v-for="index in 1000"
      :key="index"
      style="line-height: 32px; width: 100%; background: #fff"
    >
      Item {{ index }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {
        endpoint: '/product',
        columns: [
          { type: 'index', label: 'STT' },
          {
            prop: 'name',
            label: 'Name',
          },
        ],
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
