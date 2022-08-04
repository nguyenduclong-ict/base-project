<template>
  <div class="address-select flex flex-wrap">
    <div class="flex w-full gap-2 flex-wrap">
      <el-form-item class="flex-1" label="Tỉnh/Thành phố">
        <SelectEntity
          v-model="value.province_code"
          placeholder="Chọn tỉnh/thành phố"
          :multiple="false"
          :config="configProvince"
          @input="onInputProvince"
        />
      </el-form-item>

      <el-form-item class="flex-1" label="Quận/Huyện">
        <SelectEntity
          ref="selectDistrict"
          v-model="value.district_code"
          placeholder="Chọn quận/huyện"
          :multiple="false"
          :config="configDistrict"
        />
      </el-form-item>

      <el-form-item class="flex-1" label="Phường/Xã">
        <SelectEntity
          ref="selectWard"
          v-model="value.ward_code"
          placeholder="Chọn phường/xã"
          :multiple="false"
          :config="configWard"
        />
      </el-form-item>
    </div>
    <el-form-item label="Địa chỉ" class="w-full">
      <el-input v-model="value.address2" type="textarea"></el-input>
    </el-form-item>
    <el-form-item v-if="address2" label="Địa chỉ 2" class="w-full">
      <el-input v-model="value.address2" type="textarea"></el-input>
    </el-form-item>
  </div>
</template>

<script>
import SelectEntity from '../Common/SelectEntity.vue'
export default {
  components: { SelectEntity },
  props: {
    value: {
      type: Object,
    },
    address2: {
      type: Boolean,
    },
  },

  data() {
    return {}
  },

  computed: {
    configProvince() {
      return {
        endpoint: '/location/find',
        labelKey: 'name',
        valueKey: 'province_code',
        payload: {
          query: {
            type: 'province',
          },
          pageSize: 100,
          sort: ['province_id'],
        },
      }
    },
    configDistrict() {
      return {
        endpoint: '/location/find',
        labelKey: 'name',
        valueKey: 'district_code',
        payload: {
          query: {
            type: 'district',
            province_code: this.value.province_code,
          },
          pageSize: 1000,
        },
      }
    },
    configWard() {
      return {
        endpoint: '/location/find',
        labelKey: 'name',
        valueKey: 'ward_code',
        payload: {
          query: {
            type: 'ward',
            district_code: this.value.district_code,
          },
          pageSize: 1000,
        },
      }
    },
  },

  methods: {
    fetchProvinces() {},

    onInputProvince() {
      this.value.district_code = null
      this.value.ward_code = null
      this.$refs.selectDistrict.fetchData()
    },

    onInputDistrict() {
      this.value.ward_code = null
      this.$refs.selectWard.fetchData()
    },
  },
}
</script>

<style lang="scss" scoped></style>
