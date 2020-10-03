export const getRatio = () => {
	let ratio = 1
	uni.getSystemInfo({
		success: function(res) {
			ratio = res.windowWidth / 375
		}
	});
	return ratio
}
