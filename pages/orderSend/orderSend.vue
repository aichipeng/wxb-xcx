<template>
	<view class="activity-send">
		<swiper class="swiper" previous-margin="35rpx" next-margin="35rpx" :current="current" @change="swiperChange">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<view class="swiper-item-warp">
					<view class="flex-row">
						<text>{{item.addTime}}</text>
						<!-- <text>今天</text>
						<text>20:01</text> -->
					</view>
					<view class="user-info flex-row">
						<image class="avatar" :src="item.userAvatar || avatar"></image>
						<text class="name flex-1 acp-ellipsis">{{item.nickName || '神秘人'}}</text>
					</view>
					<view class="address-info border-bottom">
						<view class="address-item flex-row">
							<text class="label">收件人:</text>
							<text class="acp-ellipsis">{{item.consignee}}</text>
							<text style="margin-left: 48rpx;">{{item.mobile}}</text>
						</view>
						<view class="address-item flex-row">
							<text class="label">收货地址:</text>
							<text class="flex-1 acp-ellipsis-l2">{{item.address}}</text>
						</view>
						<view class="address-item flex-row">
							<text class="label">订单单号:</text>
							<view class="flex-row flex-1 acp-ellipsis">
								<text class="acp-ellipsis">{{item.orderSn}}</text>
								<uni-icons type="compose" size="12" color="#5D5D5D" style="margin-left: 26rpx;"></uni-icons>
							</view>
						</view>
					</view>
					<view class="form-group">
						<view class="form-item flex-row border-bottom">
							<text class="label">物流单号</text>
							<input :disabled="formMap[index].finished" class="value" v-model="formMap[index].expressNo" type="number"
							 placeholder="请输入物流单号" placeholder-style="color: #999; font-size: 29rpx;line-height: 40rpx;" />
						</view>
						<view class="form-item flex-row border-bottom">
							<text class="label">物流公司</text>
							<picker :disabled="formMap[index].finished" @change="pickerExpressCode" :value="formMap[index].expressIndex"
							 :range="listExp" range-key="name">
								<view class="value" :style="{color: formMap[index].expressCode ? '#333' : '#999'}">{{formMap[index].expressName || '请选择物流公司'}}</view>
							</picker>
						</view>
						<view class="form-item flex-row border-bottom">
							<text class="label">物流成本</text>
							<input :disabled="formMap[index].finished" class="value" v-model="formMap[index].freightPrice" type="number"
							 placeholder="请选择输入物流成本" placeholder-style="color: #999; font-size: 29rpx;line-height: 40rpx;" />
						</view>
					</view>
					<view class="submit-btn flex-col" @click="handleSumbit(index)">
						<text>确认</text>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="tips flex-col">
			<text>需填写 {{list.length}} 个，已完成<text style="color: #EFB600;margin: 0 6rpx;">{{finishNum}}</text>个</text>
		</view>
	</view>
</template>

<script>
	import {
		orderDetail,
		orderExpress
	} from "@/api/order.js"
	import {
		expressList
	} from "@/api/express.js"
	export default {
		data() {
			return {
				current: 0,
				listExp: [], // 物流公司列表
				list: [],
				finishNum: 0,
				formMap: [],
				avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2476878483,4014399276&fm=26&gp=0.jpg',
			};
		},
		onLoad(options) {
			const _this = this
			if (options.item) {
				let item = JSON.parse(options.item)
				// console.log(item)
				this.getExpressList()
				item.forEach((item, index) => {
					_this.getInfo(item);
				})
			}
		},
		methods: {
			getInfo(orderSn) {
				let {
					list,
					formMap
				} = this
				orderDetail({
					orderSn
				}).then(res => {
					list.push(res.data);
					formMap.push({
						expressIndex: 0,
						expressCode: undefined,
						expressName: undefined,
						expressNo: undefined,
						freightPrice: undefined,
						orderNo: orderSn,
						finished: false
					})
					this.list = list;
					this.formMap = formMap
				})
			},
			getExpressList() {
				expressList().then(res => {
					this.listExp = res.data
				})
			},
			swiperChange(e) {
				// console.log(e)
				this.current = e.detail.current
			},
			pickerExpressCode(e) {
				let {
					current,
					listExp,
					formMap
				} = this;
				// console.log(current, e.detail.value)
				const index = e.detail.value;
				const cuurretExp = listExp[index];
				formMap[current].expressCode = cuurretExp.code
				formMap[current].expressName = cuurretExp.name
				formMap[current].expressIndex = index
			},
			handleSumbit(index) {
				const {
					formMap,
					finishNum,
					list
				} = this
				// console.log(this.current)
				const formData = formMap[index]
				if (!formMap[index].finished) {
					orderExpress(formData).then(res => {
						formMap[index].finished = true;
						this.finishNum = finishNum + 1
						if (finishNum + 1 >= list.length) {
							uni.showToast({
								title: "全部提交成功！",
								icon: "none",
								mask: true
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 500)
						} else {
							uni.showToast({
								title: "提交成功！下一个",
								icon: "none",
								mask: true
							})
							this.goNext()
						}
					})
				}
			},

			goNext() {
				const {
					formMap,
				} = this
				let index = -1;
				for (let i in formMap) {
					if (!formMap[i].finished) {
						index = i
						break;
					}
				}
				if (index != -1) {
					this.current = index
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity-send {
		padding-bottom: 40rpx;

		.swiper {
			// margin: 0 21rpx;
			padding: 16rpx 0;
			height: 980rpx;

			.swiper-item {
				// background-color: #fff;
				// margin: 0 21rpx;
				padding: 0 11rpx;
				box-sizing: border-box;

				.swiper-item-warp {
					background-color: #fff;
					box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
					border-radius: 10rpx;
					height: 100%;
					padding: 41rpx;
					box-sizing: border-box;

					.user-info {
						margin-top: 40rpx;

						.avatar {
							width: 80rpx;
							height: 80rpx;
							border-radius: 40rpx;
						}

						.name {
							font-size: 30rpx;
							font-weight: 500;
							margin: 0 16rpx;
						}
					}

					.address-info {
						padding: 25rpx 0;

						.address-item {
							margin: 16rpx 0;

							.label {
								width: 118rpx;
								color: #999;
							}
						}
					}

					.form-group {
						font-size: 29rpx;
						line-height: 40rpx;

						.form-item {
							justify-content: space-between;
							padding: 41rpx 0;

							.label {}

							.value {
								text-align: right;
							}
						}
					}

					.submit-btn {
						height: 90rpx;
						border-radius: 45px;
						background: #FFD44D;
						box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
						font-size: 30rpx;
						line-height: 42rpx;
						margin-top: 48rpx;
					}
				}
			}
		}

		.tips {
			margin-top: 114rpx;
		}
	}
</style>
