<template>
	<view class="account-keep-create">
		<block v-for="(item,index) in formMap" :key="index">
			<view class="keep-card">
				<view class="header flex-row" style="justify-content: space-between;">
					<view class="tabs flex-row">
						<view class="tab" :style="{color: item.plusMinus == 1 ? '#EFB600' : '#999'}" @click="changeType(index,1)">
							<text>收入</text>
							<view class="line" v-if="item.plusMinus == 1"></view>
						</view>
						<view class="tab" :style="{marginLeft: '60rpx', color: item.plusMinus == 2 ? '#EFB600' : '#999'}" @click="changeType(index,2)">
							<text>支出</text>
							<view class="line" v-if="item.plusMinus == 2"></view>
						</view>
					</view>
					<picker mode="date" :value="item.addTime" @change="bindDateChange" :data-index="index" :end="moment(new Date()).format('YYYY-MM-DD')">
						<view class="add-time">{{moment(item.addTime).format('YYYY年MM月DD日')}}</view>
					</picker>
				</view>
				<view class="form-item flex-row">
					<text class="label">类目</text>
					<view class="value flex-1 flex-row" style="margin-right: 0;">
						<view :class="['tabT', key == item.tradeType ? 'inTabT' : '']" v-for="(val,key) in item.plusMinus==1 ? spliceTrade([11,15]) : spliceTrade([10,12,13,14]) "
						 :key="key" @click="changeTrade(index,key)">
							<text>{{val}}</text>
						</view>
					</view>
				</view>
				<view class="form-item flex-row">
					<text class="label">名称</text>
					<input class="value flex-1" type="text" v-model="item.goodsName" placeholder="请输入物商品名称" placeholder-style="color: #DDD; font-size: 29rpx;line-height: 40rpx;" />
				</view>
				<view class="form-item flex-row">
					<view class="flex-1 flex-row">
						<text class="label">单价</text>
						<input class="value flex-1" type="number" v-model="item.goodsPrice" placeholder="¥ 0.00" placeholder-style="color: #DDD; font-size: 29rpx;line-height: 40rpx;" />
					</view>
					<view v-if="item.plusMinus == 1" class="flex-1 flex-row">
						<text class="label">数量</text>
						<view class="value flex-1 flex-row">
							<view class="circle-box flex-col" @click="changeNum('minus')" @longpress="changeNum('minus_max')">
								<!-- <text style="margin-bottom: 6rpx;">-</text> -->
								<uni-icons type="minus-filled" size="20" :color="item.goodsNum > 1 ? '#FFD44D' : '#ddd'"></uni-icons>
							</view>
							<!-- <text style="padding: 10rpx 30rpx;">1</text> -->
							<view class="input-box flex-col">
								<input class="num-input" maxlength="8" type="number" v-model="item.goodsNum" data-name="goodsNum" @input="filterMath"
								 @blur="filterMath" />
								<text v-if="item.goodsNum > 999" class="absolute-row-center tips">{{item.goodsNum}}</text>
							</view>
							<view class="circle-box flex-col" @click="changeNum('plus')" @longpress="changeNum('plus_max')">
								<!-- <text style="margin-bottom: 6rpx;">+</text> -->
								<uni-icons type="plus-filled" size="20" color="#FFD44D"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				<view class="form-item flex-row" v-if="item.plusMinus == 1">
					<text class="label">总额</text>
					<text class="value flex-1" :style="{color:item.goodsPrice ? '#333' : '#ddd'}">{{item.goodsPrice ? item.goodsNum * item.goodsPrice : '￥0.00'}}</text>
					<!-- <input class="value flex-1" type="number" v-model="item.allPrice" placeholder="¥ 0.00" placeholder-style="color: #DDD; font-size: 29rpx;line-height: 40rpx;" /> -->
				</view>
				<view class="del-btn flex-col" @click="delForm(index)" v-if="formMap.length > 1">
					<view class="flex-row">
						<uni-icons type="trash" size="16" color="#BBB" style="margin: 0 10rpx;"></uni-icons>
						<text>删除记录</text>
					</view>
				</view>
			</view>
		</block>
		<view class="btn-group flex-row">
			<view class="btn-left flex-col flex-1" @click="addForm">
				<text>记一笔</text>
			</view>
			<view style="width: 34rpx;"></view>
			<view class="btn-right flex-col flex-1" @click="submit">
				<text>完成</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		accKeepCreate
	} from "@/api/account.js"
	import moment from "moment";
	export default {
		data() {
			return {
				moment,
				formMap: [{
					plusMinus: 1,
					type: 2,
					tradeType: 11,
					addTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					goodsName: '',
					goodsPrice: undefined,
					goodsNum: 1
				}],
				tradeTypeMap: {
					'10': '物流',
					'12': '成本',
					'13': '退款',
					'14': '优惠',
					'11': '商品',
					'15': '自定义',
				}
			};
		},
		onLoad() {},
		methods: {
			// 支出、收入类型切换
			changeType(index, type = 1) {
				const {
					formMap
				} = this
				formMap[index].plusMinus = type
				formMap[index].tradeType = type == 1 ? 11 : 10;
				this.formMap = formMap
				console.log(index, this.formMap)
			},
			changeTrade(index, type) {
				const {
					formMap
				} = this
				formMap[index].tradeType = type
				this.formMap = formMap
				console.log(index, this.formMap)
			},
			spliceTrade(arr) {
				let obj = {};
				Object.keys(this.tradeTypeMap).forEach(key => {
					if (arr.indexOf(Number(key)) != -1) {
						obj[key] = this.tradeTypeMap[key]
					}
				})
				return obj
			},
			bindDateChange(e) {
				const {
					value
				} = e.detail
				const {
					index
				} = e.target.dataset
				const {
					formMap
				} = this
				console.log(index, value)
				const time = moment(new Date()).format('HH:mm:ss')
				formMap[index].addTime = moment(value).format('YYYY-MM-DD') + ' ' + time
				this.formMap = formMap
			},
			changeNum(type) {
				switch (type) {
					case 'plus':
						this.formData.goodsNum++
						break;
					case 'plus_max':
						this.formData.goodsNum++
						break;
					case 'minus':
						if (this.formData.goodsNum > 1) {
							this.formData.goodsNum--
						}
						break;
					case 'minus_max':
						if (this.formData.goodsNum > 1) {
							this.formData.goodsNum--
						}
						break;
					default:
						break;
				}
			},
			filterMath(e) {
				const {
					name
				} = e.currentTarget.dataset;
				let {
					value
				} = e.detail;
				if (value) {
					this.formData[name] = Math.ceil(value)
				} else {
					this.formData[name] = 1
				}
			},
			delForm(index) {
				const that = this
				uni.showModal({
					title: '提示',
					content: '是否确定删除该记录',
					success: function(res) {
						if (res.confirm) {
							that.formMap.splice(index, 1)
							console.log(that.formMap)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			addForm() {
				this.formMap.push({
					plusMinus: 1,
					type: 2,
					tradeType: 11,
					addTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
					goodsName: '',
					goodsPrice: undefined,
					goodsNum: 1
				});
				console.log(this.formMap)
			},
			submit() {
				console.log(this.formMap)
				accKeepCreate({bookKeepingPARAMList: this.formMap}).then(res => {
					uni.navigateBack({
						delta: 1
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.account-keep-create {
		padding: 1rpx 24rpx 180rpx;

		.keep-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 24rpx 30rpx;
			margin: 24rpx 0;

			.header {
				.tabs {
					.tab {
						font-size: 29rpx;
						line-height: 40rpx;
						position: relative;

						.line {
							position: absolute;
							width: 57rpx;
							height: 4rpx;
							background-color: #EFB600;
							bottom: -8rpx;
							left: 50%;
							transform: translateX(-50%);
						}
					}
				}

				.add-time {
					font-size: 22rpx;
					color: #999;
					line-height: 32px;
				}
			}

			.form-item {
				margin: 48rpx 0;

				.label {
					font-size: 29rpx;
					line-height: 40rpx;
				}

				.value {
					margin: 0 40rpx;
					flex-wrap: wrap;
					font-size: 29rpx;
					line-height: 40rpx;

					.tabT {
						margin: 5rpx 24rpx 5rpx 0;
						padding: 8rpx 28rpx 6rpx;
						border-radius: 30rpx;
						background-color: #F1F1F1;
						color: #999;
						font-size: 24rpx;
						line-height: 34rpx;
					}

					.inTabT {
						background-color: #FFF8E3;
						color: #EFB600;
					}

					.circle-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 18rpx;
					}

					.input-box {
						position: relative;
						width: 76rpx;

						.tips {
							font-size: 20rpx;
							line-height: 28rpx;
							color: #999;
							bottom: -20rpx;
						}
					}

					.num-input {
						text-align: center;
						margin: 10rpx;
						font-size: 29rpx;
						line-height: 40rpx;
					}
				}
			}

			.del-btn {
				color: #bbb;
				font-size: 28rpx;
				line-height: 40rpx;
				margin-bottom: 10rpx;
			}
		}

		.btn-group {
			position: fixed;
			bottom: 60rpx;
			left: 24rpx;
			right: 24rpx;

			.btn-left {
				height: 90rpx;
				background: #FFFFFF;
				box-shadow: 0 6rpx 12rpx 0 rgba(0, 0, 0, 0.04);
				border-radius: 45rpx;
				font-size: 30rpx;
				line-height: 42rpx;
			}

			.btn-right {
				height: 90rpx;
				background: #FFD44D;
				box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
				border-radius: 45px;
				font-size: 30rpx;
				line-height: 42rpx;
			}
		}
	}
</style>
	}
</style>
