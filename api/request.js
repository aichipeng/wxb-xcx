const BASE_URL = "https://api.banyuge.com"
export const ajax = (data = {}, url, method = 'GET', isLoading = false) => {
	if (isLoading) {
		uni.showLoading({
			title: '加载中',
			mask: true
		});
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${BASE_URL}${url}`,
			data,
			method,
			header: {
				"Token": uni.getStorageSync('token'),
			},
			timeout: 10000,
			success: (res) => {
				if (isLoading) {
					uni.hideLoading()
				}
				if (res.data.errno != 0) {
					uni.showToast({
						title: res.data.errmsg,
						icon: "none",
						mask: true
					});
					reject(res)
					if (res.data.errno == 401) {
						setTimeout(function() {
							uni.navigateTo({
								url: '/pages/loginScreen/loginScreen',
							});
						}, 1000);
					}
				} else {
					resolve(res.data)
				}
			},
			fail: (error) => {
				if (isLoading) {
					uni.hideLoading()
				}
				uni.showToast({
					title: '服务器错误',
					icon: "none",
					mask: true
				});
				reject(error)
			}
		})
	})
}
export {
	BASE_URL
}
