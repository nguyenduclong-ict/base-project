<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item label="Tên thuộc tính" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="Slug" prop="slug">
      <el-input v-model="form.slug"></el-input>
    </el-form-item>
    <div>
      <div class="flex gap-2 w-full h-6">
        <div class="flex-1 font-bold">Giá trị</div>
        <div class="flex-1 font-bold">Slug</div>
        <el-button class="icon opacity-0"></el-button>
      </div>
      <el-divider class="small-divider mb-4"></el-divider>
      <div class="h-2"></div>
      <draggable v-model="form.values">
        <div
          v-for="(value, index) in form.values"
          :key="value.code"
          class="flex gap-2"
        >
          <el-form-item
            class="flex-1"
            :prop="`values[${index}].value`"
            required
            :rules="{ required: true, message: 'Nhập giá trị' }"
          >
            <div class="flex items-center gap-2">
              <i class="el-icon-sort cursor-move"></i>
              <el-input
                v-model="value.value"
                placeholder="Nhập giá trị"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item
            class="flex-1"
            :prop="`values[${index}].slug`"
            :rules="{ required: true, message: 'Slug không được bỏ trống' }"
          >
            <el-input v-model="value.slug" placeholder="Slug"></el-input>
          </el-form-item>
          <el-button
            class="icon"
            icon="el-icon-delete"
            type="danger"
            @click="deleteValue(form, value)"
          ></el-button>
        </div>
      </draggable>
    </div>
    <el-button type="primary" icon="el-icon-plus" @click="addValue(form)">
      Thêm giá trị
    </el-button>
  </el-form>
</template>

<script>
import draggable from 'vuedraggable'
import { uniqueId } from '~/utils'

export default {
  components: { draggable },

  props: {
    form: { type: Object },
    rules: { type: Object },
  },

  methods: {
    deleteValue(form, value) {
      const index = form.values.indexOf(value)
      if (index >= 0) form.values.splice(index, 1)
    },

    addValue(form) {
      form.values.push({
        id: uniqueId(),
        slug: '',
        value: null,
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
