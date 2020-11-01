<template>
	<view class="activity-share-page" :style="{paddingBottom:showDrawer ? '444rpx' : 0}">
		<!-- <image :src="qrcodeImg" mode="widthFix"></image> -->
		<canvas canvas-id="myCanvas" class="poster-canvas" :style="{height: (canvasHeight*ratio) + 'px', width: (canvasWidth*ratio) + 'px'}"></canvas>
		<view class="header flex-col">
			<text class="title">{{info.describe || '暂无描述'}}</text>
			<text class="tips">仅剩{{info.saleVolume || 0}}单可售</text>
		</view>
		<view class="body">
			<view class="info-card">
				<view class="info-item flex-row border-bottom">
					<text>{{info.name || '暂无名称'}}</text>
					<text>x{{info.num || 0}}</text>
				</view>
				<!-- <view v-if="info.freightPrice" class="info-item flex-row border-bottom">
					<text>邮费</text>
					<text>¥ {{info.freightPrice}}</text>
				</view> -->
				<view class="info-item flex-row">
					<text>总计</text>
					<text>¥ {{(info.price || 0) * (info.num ||  0) + (info.freightPrice || 0)}}</text>
				</view>
			</view>
			<view class="user-card" v-if="info.isShowWx">
				<view class="tips flex-row">
					<text class="dot"></text>
					<text>更多好货，清添加店主微信</text>
					<text class="dot"></text>
				</view>
				<view class="user-info flex-row">
					<image class="avatar" :src="info.avatar || avatar"></image>
					<view class="txt flex-1">
						<view class="name acp-ellipsis">{{info.nickName}}</view>
						<view class="contact">
							<text>{{info.wechatNo || '暂无微信号'}}</text>
							<!-- <uni-icons type="compose" size="12" color="#5D5D5D" style="padding: 0 16rpx;"></uni-icons> -->
						</view>
					</view>
					<text class="edit" @click="navigateTo('/pages/userSetting/userSetting?id=' + id)">修改名片</text>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" :maskShow="false">
			<view class="footer-wrap">
				<uni-icons class="close" type="closeempty" size="30" color="#000" @click="close"></uni-icons>
				<view>创建成功</view>
				<view style="margin-top: 10rpx;">是否推送给用户发起微信支付？</view>
				<view class="btn-group flex-row">
					<button class="flex-col" open-type="share">
						<view class="flex-col icon-box">
							<image class="icon" src="@/static/images/weixin.png" mode="widthFix"></image>
						</view>
						<view class="txt">分享给好友</view>
					</button>
					<view class="flex-col" @click="showPoster">
						<view class="flex-col icon-box">
							<image class="icon" src="@/static/images/penyouquan.png" mode="widthFix"></image>
						</view>
						<view class="txt">保存海报</view>
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="poster" type="center" @change="posterChange">
			<view class="poster-wrap flex-col">
				<image :src="poster" style="width: 528rpx; height: 576rpx;"></image>
				<!-- <text>{{poster}}</text> -->
				<text class="save-btn" @click="download">保存图片</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		activityDetail
	} from "@/api/activity.js"
	import {
		getWacodeunlimit
	} from "@/api/login.js"
	import base64src from "@/static/utils/base64src.js"
	export default {
		data() {
			return {
				id: undefined,
				info: {},
				showDrawer: true,
				avatar: '/static/images/avatar.png',
				ratio: 1,
				canvasWidth: 528, // canvas画布宽度
				canvasHeight: 576, // canvas画布高度
				poster: undefined,
				qrcodeImg: undefined
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
			}
		},
		onShow() {
			this.id && this.getInfo();
			this.$refs.popup && this.$refs.popup.open()
		},
		onReady() {
			this.$refs.popup.open();
		},
		onShareAppMessage(res) {
			let obj = {
				title: `你关注的热销单品 “${this.info.name || '内有微商'}” 已限时出售,快来下单抢购吧`,
				path: '/pages/activityClient/activityClient?id=' + this.id + '&channelId=' + uni.getStorageSync('id'),
				imageUrl: this.poster
			}
			return obj
		},
		methods: {
			getInfo() {
				activityDetail({
					id: this.id
				}).then(res => {
					this.info = res.data
					const scene = `${this.id}&${uni.getStorageSync('id')}`
					const obj = {
						scene,
						autoColor: false,
						isHyaline: true,
						lineColor: {
							"r": 0,
							"g": 0,
							"b": 0
						},
						page: 'pages/activityClient/activityClient',
						width: 430,
					}
					getWacodeunlimit(obj).then(res => {
						this.qrcodeImg = "data:image/png;base64," + res.data;
						this.createPoster()
					})
				})
			},
			close() {
				this.showDrawer = false;
				this.$refs.popup.close()
			},
			showPoster() {
				if (!this.poster) {
					this.savePoster();
				}
				this.$refs.poster.open()
			},
			posterChange(e) {
				if (e.show) {
					this.$refs.popup.close()
				} else {
					this.showDrawer = false;
					this.$refs.popup.open()
				}
			},
			// 创建分享海报
			createPoster() {
				const {
					ratio,
					canvasWidth,
					canvasHeight,
					info
				} = this;
				const that = this
				const context = uni.createCanvasContext('myCanvas');
				this.roundRect(context, 0, 0, Number(canvasWidth * ratio), Number(canvasHeight * ratio), Number(
					10 * ratio));
				context.fillStyle = "#ffffff";
				context.fill();
				context.drawImage('/static/images/bg-img.png', 0, 0, Number(canvasWidth * ratio), Number(148 * ratio));
				context.fillStyle = "#333"
				context.textAlign = 'center'
				context.font = `${28*ratio}px bold Arial`;
				context.fillText(`${info.describe || ''}`, Number(canvasWidth / 2 * ratio), Number(82 * ratio));
				context.font = `${30*ratio}px bold Arial`;
				context.textAlign = 'left'
				context.fillText(`${info.name || ''}`, Number(24 * ratio), Number(238 * ratio));
				context.fillText('总计', Number(24 * ratio), Number(355 * ratio));
				context.textAlign = 'right'
				context.fillText(`x${info.num || 0}`, Number((canvasWidth - 24) * ratio), Number(238 * ratio));
				const price = (info.price || 0) * (info.num || 0) + (info.freightPrice || 0)
				context.fillText(`￥${price}`, Number((canvasWidth - 24) * ratio), Number(355 * ratio));
				base64src(that.qrcodeImg).then(res => {
					console.log(res)
					context.drawImage(res, 0, 0, 430, 430, Number(204 * ratio), Number(406 * ratio), Number(120 * ratio),
						Number(120 * ratio))
					context.draw();
					setTimeout(() => {
						that.savePoster()
					}, 1000)
				})
			},
			// 圆角矩形
			roundRect(ctx, x, y, w, h, r) {
				if (w < 2 * r) r = w / 2;
				if (h < 2 * r) r = h / 2;
				ctx.beginPath();
				ctx.moveTo(x + r, y);
				ctx.arcTo(x + w, y, x + w, y + h, r);
				ctx.arcTo(x + w, y + h, x, y + h, r);
				ctx.arcTo(x, y + h, x, y, r);
				ctx.arcTo(x, y, x + w, y, r);
				ctx.closePath();
			},
			// 生成图片
			savePoster() {
				const that = this
				const {
					ratio,
					canvasWidth,
					canvasHeight,
				} = this;
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: Number(canvasWidth * ratio),
					height: Number(canvasHeight * ratio),
					quality: 1,
					canvasId: 'myCanvas',
					success: function(res) {
						// console.log(res)
						that.poster = res.tempFilePath
						// that.$emit('savePoster', res.tempFilePath)
					},
					fail: err => {}
				})
			},
			// 保存图片
			download() {
				const that = this
				uni.saveImageToPhotosAlbum({
					filePath: this.poster,
					success: res => {
						// console.log(res)
						uni.showToast({
							title: '保存成功',
							icon: 'none',
							mask: true
						})
						that.$refs.poster.close()
					},
					fail: err => {
						uni.showToast({
							title: '保存失败',
							icon: 'none',
							mask: true
						})
					}
				})
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	.activity-share-page {
		.header {
			background-color: #FFD44D;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 0 0 40rpx 40rpx;
			padding: 48rpx 24rpx 184rpx;

			.title {
				font-size: 36rpx;
				font-weight: 500;
				line-height: 50rpx;
			}

			.tips {
				font-size: 28rpx;
				line-height: 40rpx;
				margin-top: 24rpx;
			}
		}

		.body {
			margin-top: -150rpx;
			padding: 0 24rpx;

			.info-card {
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
				background-color: #fff;
				border-radius: 10rpx;
				padding: 0 24rpx;
				margin: 24rpx 0;

				.info-item {
					padding: 32rpx 0;
					justify-content: space-between;
					line-height: 42rpx;
					font-size: 30rpx;
				}
			}

			.user-card {
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
				background-color: #fff;
				border-radius: 10rpx;
				padding: 1rpx 24rpx;
				margin: 24rpx 0;

				.tips {
					margin: 24rpx 0;
					color: #999;
					line-height: 40rpx;
					font-size: 28rpx;
					justify-content: center;

					.dot {
						width: 8rpx;
						height: 8rpx;
						border-radius: 4rpx;
						background: #D8D8D8;
						margin: 0 24rpx;
					}
				}

				.user-info {
					margin: 24rpx 0 32rpx;

					.avatar {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50rpx;
					}

					.txt {
						overflow: hidden;
						margin: 0 16rpx;

						.name {
							line-height: 42rpx;
							font-size: 30rpx;
							font-weight: 500;
							margin: 8rpx 0;
						}

						.contact {
							line-height: 34rpx;
							font-size: 24rpx;
							color: #999;
							margin: 8rpx 0;

							.copy {
								font-size: 16rpx;
								margin: 0 16rpx;
							}
						}
					}

					.edit {
						align-self: flex-end;
						color: #EFB600;
						line-height: 34rpx;
					}
				}
			}
		}

		.footer-wrap {
			position: relative;
			background-color: #fff;
			padding: 32rpx 24rpx;
			font-size: 36rpx;
			line-height: 50rpx;
			height: 380rpx;
			overflow: hidden;

			.close {
				position: absolute;
				z-index: 2;
				top: 24rpx;
				right: 16rpx;
			}

			.btn-group {
				justify-content: space-around;
				padding: 56rpx 80rpx;

				.icon-box {
					width: 82rpx;
					height: 82rpx;
					margin: 8rpx 0;

					.icon {
						width: 82rpx;
						max-height: 82rpx;
					}
				}

				.txt {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333;
				}
			}
		}

		.poster-wrap {
			.save-btn {
				font-size: 29rpx;
				width: 336rpx;
				height: 90rpx;
				background: #FFD44D;
				border-radius: 10rpx;
				border: 2rpx solid #979797;
				text-align: center;
				font-weight: 500;
				color: #333333;
				line-height: 90rpx;
				margin-top: 80rpx;
			}
		}

		.poster-canvas {
			transform: translate(-200%, -200%);
			position: fixed;
		}

		button {
			padding: 0;
			margin: 0;
			background-color: unset;
		}
	}
</style>
