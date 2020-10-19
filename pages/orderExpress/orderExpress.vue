<template>
	<view class="order-express">

	</view>
</template>

<script>
	import {
		expressDetial,
	} from "@/api/express.js"
	export default {
		data() {
			return {
				formData: {
					code: undefined,
					customerName: undefined,
					no: undefined
				}
			};
		},
		onLoad(options) {
			if (options.no && options.code) {
				this.formData.no = options.no
				this.formData.code = options.code
				this.getInfo()
			}
		},
		methods: {
			getInfo() {
				expressDetial(this.formData).then(res => {

				})
			}
		}
	}
</script>

<style lang="scss">

</style>
