import { ElMessageBoxShortcutMethod } from 'element-ui/types/message-box'

declare module 'vue/types/vue' {
  interface Vue {
    showConfirm: ElMessageBoxShortcutMethod
    validateForm: (form: any) => Promise<boolean>

    meta: {
      name: string
      age: number
    }
  }
}
