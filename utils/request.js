// es6 promise 微信小程序的 api 的铺垫
export default(params)=>{
	uni.showLoading({
		title:"加载中"
	})
	
	return new Promise((resovle,reject)=>{
		
		wx.request({
			...params,
			success(res) {
				resovle(res.data);
			},
			fail(err) {
				reject(err);
			},
			complete(){
				uni.hideLoading();
			}
		})
	})
}