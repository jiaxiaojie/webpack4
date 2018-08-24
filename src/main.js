import Vue from 'vue'
import router from './router/router'
import App from './App.vue'

import axios from './http/interceptors'

import ElementUI from 'element-ui'
import './assets/css/style.scss'
import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

import ToNum2Format from './components/common/filters/toNum2Format'

import _global from './components/common/global/variables'
import signData from './components/common/global/request'

import lodash from 'lodash'
import md5 from 'js-md5'


Vue.use(ElementUI)
Vue.use(signData);

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)
Vue.component('font-awesome-icon', FontAwesomeIcon)

/*将axios挂载到vue的prototype上，
 *在组件中可以直接使用this.axios访问 */
Vue.prototype.axios = axios;
Vue.prototype._ = lodash;
Vue.prototype.md5 = md5;
Vue.prototype._global = _global;


Vue.filter(
    'ToNum2Format',ToNum2Format
)
//挂载app
new Vue({
    el: '#app',
    router,
    axios,
    render: h => h(App)
})
