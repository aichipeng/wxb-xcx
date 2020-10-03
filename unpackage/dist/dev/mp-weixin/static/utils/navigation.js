export const navigation = (link, needToken = false, urlType = 1) => {
	if (link != "") {
		if (!needToken) {
			switch (Number(urlType)) {
				case 1:
					uni.navigateTo({
						url: link,
						fail: err => {
							console.log('err')
							uni.switchTab({
								url: link
							});
						}
					});
					break;
				case 2:
					uni.navigateTo({
						url: "/pages/webview/webview?src=" + encodeURIComponent(JSON.stringify(link))
					});
					break;
				default:
					break;
			}
		}else {
			console.log(uni.getStorageSync('token'))
		}
	}
}
