<template>
  <div class="flex justify-center mt-56">
    <el-form ref="form" :model="form" :rules="rules" class="w-96">
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username" name="username"></el-input>
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-button type="primary" class="w-full" @click="handleLogin">
        Login
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  layout: 'empty',

  data() {
    return {
      form: {
        username: '',
        password: '',
      },

      rules: {
        username: [{ required: true }, { minlength: 4 }],
        password: [{ required: true }, { minlength: 6 }],
      },
    }
  },

  methods: {
    async handleLogin() {
      const isValid = await this.validateForm(this.$refs.form)

      if (isValid) {
        this.$auth.loginWith('local', { data: this.form })
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
