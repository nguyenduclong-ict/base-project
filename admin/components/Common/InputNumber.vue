<template>
  <el-input
    ref="input"
    v-model="_value"
    class="input-number"
    :placeholder="placeholder"
  ></el-input>
</template>

<script>
import numeral from 'numeral'
export default {
  props: {
    value: { type: null },
    placeholder: { type: String },
  },

  data() {
    return {
      selectionIndex: 0,
    }
  },

  computed: {
    _value: {
      get() {
        if (
          this.value === '' ||
          this.value === null ||
          this.value === undefined
        )
          return ''
        if (!isNaN(this.value)) return numeral(this.value).format('0,0.[00]')
        return this.value
      },
      set(v) {
        const coma = v.match(/,/g)?.length || 0
        let coma2
        let value
        try {
          value = numeral(v).value()
          coma2 = numeral(value).format('0,0.[00]').match(/,/g)?.length || 0
        } catch (error) {}
        this.$emit('input', value)
        const selectionEnd = this.$refs.input.$refs.input.selectionEnd
        this.$nextTick(() => {
          this.$refs.input.$refs.input.selectionEnd =
            selectionEnd + (coma2 > coma ? 1 : coma2 === coma ? 0 : -1)
        })
      },
    },
  },
  mounted() {
    console.log(this.$refs.input)
  },
}
</script>

<style lang="scss">
.input-number .el-input__inner {
  text-align: right;
}
</style>
