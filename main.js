import Vue from 'vue'
import App from './App'
import './js_sdk/ican-clipBoard/ican-clipBoard.js'
import uniIcons from "@/components/uni-icons/uni-icons.vue"
import uniPopup from '@/components/uni-popup/uni-popup.vue'
// #ifdef MP-WEIXIN
import uma from 'umtrack-wx';
uma.init({
	appKey: 'xxxx',
	useOpenid: false,
	autoGetOpenid: false,
	debug: true,
	uploadUserInfo: true
});
// #endif
// 此处用来挂载入uma到组件实例上，方便组件内使用this.$uma
// #ifdef MP-WEIXIN
uma.install = function (Vue) {
	Vue.prototype.$uma = uma;
}
Vue.use(uma);
// #endif
Vue.config.productionTip = false
Vue.component('uni-icons', uniIcons)
Vue.component('uni-popup', uniPopup)
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
