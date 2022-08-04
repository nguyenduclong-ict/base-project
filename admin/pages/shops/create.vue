<template>
  <div class="page-content flex">
    <el-card shadow="never" class="w-full mx-auto mt-10 max-w-2xl relative">
      <div class="absolute top-4 left-4">
        <el-button
          type="text"
          icon="el-icon-back"
          @click="() => $router.back()"
        >
          Quay lại
        </el-button>
      </div>
      <div class="text-2xl text-center">Tạo cửa hàng</div>

      <div class="flex justify-center my-5">
        <el-image
          v-if="form.image_url"
          :src="form.image_url"
          fit="cover"
          class="cursor-pointer w-20 h-20 rounded-full"
          @click="pickFile"
        ></el-image>

        <div
          v-else
          class="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer border hover:bg-slate-100"
          @click="pickFile"
        >
          <Icon name="add-image" size="32" />
        </div>

        <input
          ref="selectFile"
          type="file"
          style="display: none"
          :multiple="false"
          accept="image/*"
          @change="onPickFile"
        />
      </div>

      <div class="w-full text-center">
        <span class="font-semibold text-xl mx-7">
          {{ form.name }}
        </span>
      </div>

      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="Tên cửa hàng" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <AddressSelect v-model="form" />
      </el-form>

      <div class="flex justify-center">
        <el-button type="primary" @click="createShop">Tạo cửa hàng</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import AddressSelect from '~/components/AddressSelect/AddressSelect.vue'
export default {
  components: { AddressSelect },
  layout: 'dashboard',

  meta: {
    sidebarKey: '/shops',
  },

  data() {
    return {
      form: {
        name: '',
        image_url: '',
        address: '',
        address2: '',
        country_code: 'VN',
        province_code: null,
        district_code: null,
        ward_code: null,
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Vui lòng nhập tên cửa hàng',
          },
          {
            min: 3,
            message: 'Tên cửa hàng phải lớn hơn 3 kí tự',
          },
        ],
      },
    }
  },

  methods: {
    pickFile() {
      this.$refs.selectFile.value = null
      this.$refs.selectFile.click()
    },

    async onPickFile(event) {
      const file = event.target.files[0]
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append(
          'fileInfo',
          JSON.stringify({
            name: file.name,
            alt: file.alt,
            caption: file.caption,
          })
        )

        const response = await this.$axios.$post('/media/upload', formData)
        this.form.image_url = response.url
      } catch (error) {
        console.log('onPickFile', error)
      }
    },

    async createShop() {
      try {
        const valid = await this.validateForm(this.$refs.form)
        if (valid) {
          const response = await this.$axios.$post('/shop', { ...this.form })
          this.$message.success('Khởi tạo shop thành công')
          await this.$auth.fetchUser()
          this.$router.push(`/${response.code}/statistic`)
        }
      } catch (error) {
        console.error(`createShop`, error)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
