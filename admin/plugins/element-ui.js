import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import Vue from 'vue'

// override component
import Avatar from '@/components/Common/Avatar.vue'
import Icon from '@/components/Common/Icon'


Vue.use(Element, { locale, size: 'medium' })

// register global components
Vue.component('Avatar', Avatar)
Vue.component('Icon', Icon)
