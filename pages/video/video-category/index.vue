<template>
	<view>
		<view class="video_category">
			
		</view>
	</view>
</template>

<script>
export default{
	data() {
		return {
			category:[]
		}
	},
	mounted() {
		// 修改页面的标题
		uni.setNavigationBarTitle({
			title:"分类"
		});
		
		this.getList();
	},
	methods:{
		getList(){
			this.request({
				url:"http://157.122.54.189:9088/videoimg/v1/videowp/category"
			})
			.then(result=>{
				console.log(result);
				
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.video_category {
	display: flex;
	flex-wrap: wrap;
  .cate_item{
	width: 33.33%;
	position: relative;
	border: 5rpx solid #fff;
    image {
		height: 240rpx;
    }

    .cate_name {
		position: absolute;
		width: 100%;
		height: 40rpx;
		left: 0;
		bottom: 0;
		color: #fff;
		// css3 渐变
		background-image: linear-gradient(to right top,rgba(0,0,0,.2),rgba(0,0,0,0));
		font-size: 40rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		
    }
  }
}
</style>
