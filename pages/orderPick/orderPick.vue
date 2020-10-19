<template>
	<view class="activity-pick">
		<view class="form-card">
			<view class="form-item flex-row border-bottom">
				<text class="label">取件时间</text>
				<dataTimePicker @change="bindDateChange" fields="hour" :start="moment(new Date()).format('YYYY-MM-DD hh') + ':00'"
				 :defaultValue="moment(new Date()).format('YYYY-MM-DD hh')" />
			</view>
			<view class="form-item flex-row border-bottom">
				<text class="label">物流公司</text>
				<picker @change="pickerExpressCode" :value="expressIndex" :range="listExp" range-key="name">
					<view class="value" :style="{color: formData.code ? '#333' : '#999'}">{{formData.expressName || '请选择物流公司'}}</view>
				</picker>
			</view>
			<view class="form-item flex-row border-bottom">
				<text class="label">取件地址</text>
				<view class="value flex-1 flex-row" @click="navigateTo('/pages/addressScreen/addressScreen')">
					<view class="value flex-1">
						<view class="address" v-if="formData.address">{{formData.address}}</view>
						<view style="color: #999;" v-else>请选择地址</view>
					</view>
					<!-- <input class="value flex-1" v-model="formData.address" type="text" placeholder="选择取件地址" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" /> -->
					<uni-icons type="location-filled" size="20" color="#5D5D5D" style="margin-right: -6rpx;"></uni-icons>
				</view>
			</view>
			<view class="form-item flex-row border-bottom">
				<text class="label">联系人</text>
				<input class="value flex-1" v-model="formData.name" type="text" placeholder="请输入联系人" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
			<view class="form-item flex-row">
				<text class="label">联系电话</text>
				<input class="value flex-1" v-model="formData.mobile" type="number" maxlength="11" placeholder="请输入联系电话"
				 placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
		</view>
		<view class="btn-bottom flex-col" @click="submit">
			<text>确认预约</text>
		</view>
	</view>
</template>

<script>
	import {
		expressList,
		expressSubscribe
	} from "@/api/express.js"
	import moment from "moment";
	import DataTimePicker from "@/components/biaofun-datetime-picker/biaofun-datetime-picker.vue"
	export default {
		data() {
			return {
				moment,
				listExp: [],
				expressIndex: 0,
				formData: {
					startDate: moment(new Date()).format('YYYY-MM-DD hh') + ':00:00',
					endDate: moment(new Date()).format('YYYY-MM-DD hh') + ':00:00',
					code: undefined,
					expressName: undefined,
					mobile: undefined,
					name: undefined,
					address: undefined,
					orderNo: undefined,
					payType: 1
				}
			}
		},
		components: {
			DataTimePicker
		},
		onLoad(options) {
			// this.getInfo()
			if (options.item) {
				let item = JSON.parse(options.item)
				this.formData.orderNo = item
				// console.log(item)
				this.getExpressList()
			}
		},
		onShow() {
			const pages = getCurrentPages()
			const currPage = pages[pages.length - 1]
			if (currPage && currPage.data) {
				const {
					addressInfo
				} = currPage.data
				if (addressInfo) {
					this.formData.address = addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName + addressInfo.detailInfo
					this.formData.name = addressInfo.userName
					this.formData.mobile = addressInfo.telNumber
				}
			}
		},
		methods: {
			bindDateChange(e) {
				console.log(e)
				const {
					f3,
					ss
				} = e
				this.formData.startDate = `${f3}:${ss}`;
				this.formData.endDate = `${f3}:${ss}`;
			},
			getExpressList() {
				expressList().then(res => {
					this.listExp = res.data
				})
			},
			pickerExpressCode(e) {
				let {
					listExp,
				} = this;
				// console.log(current, e.detail.value)
				const index = e.detail.value;
				const cuurretExp = listExp[index];
				this.formData.code = cuurretExp.code
				this.formData.expressName = cuurretExp.name
				this.expressIndex = index
			},
			submit() {
				console.log(this.formData)
				const msg = this.verifyForm();
				if (!msg) {
					expressSubscribe(this.formData).then(res => {
						uni.showToast({
							title: "预约成功！",
							icon: "none",
							mask: true
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 500)
					})
				} else {
					uni.showToast({
						title: msg,
						icon: 'none',
						mask: true
					})
				}
			},
			// 校验表单
			verifyForm() {
				const {
					startDate,
					code,
					address,
					name,
					mobile
				} = this.formData;
				const {
					agree
				} = this
				let msg = '';
				if (!startDate) {
					msg = '请选择取件时间！'
				} else if (!code) {
					msg = '请选择物流公司！'
				} else if (!address) {
					msg = '请选择取件地址！'
				} else if (!name) {
					msg = '请输入联系人！'
				} else if (!mobile) {
					msg = '请输入联系电话！'
				} else if (!(/^1[3456789]\d{9}$/.test(mobile))) {
					msg = '请输入正确手机号码！'
				}
				return msg
			},
			navigateTo(url) {
				uni.navigateTo({
					url,
					fail: err => {
						uni.switchTab({
							url,
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity-pick {
		padding: 16rpx 24rpx 180rpx;

		.form-card {
			background-color: #fff;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 10rpx;
			padding: 0 41rpx;
			font-size: 30rpx;
			line-height: 42rpx;

			.form-item {
				padding: 41rpx 0;
				justify-content: space-between;

				.label {
					font-size: 30rpx;
					line-height: 42rpx;
				}

				.value {
					text-align: right;
					margin-left: 20rpx;
				}
			}
		}

		.btn-bottom {
			position: fixed;
			bottom: 60rpx;
			left: 24rpx;
			right: 24rpx;
			height: 90rpx;
			background: #FFD44D;
			box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
			border-radius: 45rpx;
			font-size: 30rpx;
			line-height: 42rpx;
		}
	}
</style>
