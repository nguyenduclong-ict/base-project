<template>
  <el-form ref="form" :model="value" :rules="rules" v-bind="elForm">
    <el-form-item
      v-for="(field, fieldName) in fields"
      :key="fieldName"
      :prop="fieldName"
      :label="field.name || fieldName"
      v-bind="field.formItem"
    >
      <component
        :is="getComponentName(field)"
        v-bind="getComponentProps(field)"
        v-model="value[fieldName]"
      ></component>
    </el-form-item>
  </el-form>
</template>

<script>
import MediaSelect from './MediaSelect.vue'
import SelectEntity from './SelectEntity.vue'
export default {
  components: { MediaSelect, SelectEntity },
  props: {
    fields: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
    },
    elForm: {
      type: Object,
    },
  },

  data() {
    return {
      rules: {},
    }
  },

  watch: {
    fields: {
      immediate: true,
      handler() {
        this.mapRules()
      },
    },
  },

  methods: {
    mapRules() {
      const rules = {}

      Object.keys(this.fields).forEach((fieldName) => {
        const field = this.fields[fieldName]

        rules[fieldName] = rules[fieldName] || []

        if (field.required)
          rules[fieldName].push({
            required: true,
            message: `${field.name || fieldName} is requried`,
          })

        if (Array.isArray(field.rules)) rules.push(...field.rules)
        else if (field.rules) rules.push(field.rules)
      })

      this.rules = rules
    },

    getComponentName(field) {
      switch (field.type) {
        case 'string':
          return 'el-input'

        case 'number':
          return 'el-input-number'

        case 'checkbox':
          return 'el-checkbox'

        case 'image':
          return 'MediaSelect'

        default:
          return field.type
      }
    },

    getComponentProps(field) {
      const props = field.props || {}
      return props
    },

    validate() {
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => resolve(valid))
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
