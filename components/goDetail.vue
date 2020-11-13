<template>
	<view @click="handleClick">
		<slot></slot>
	</view>
</template>

<script>
export default{
	props:{ // 接收数据
		list:Array,
		index:Number
	},
	methods:{
		handleClick(){
			//console.log(this.index);
			//console.log(this.list);
			// 1 将数据缓存下来
			getApp().globalData.imgList=this.list;
			getApp().globalData.imgIndex=this.index;
			// 2 再实现点击跳转页面
			uni.navigateTo({
				url:"/pages/imgDetail/index"
			})
		}
	}
	
}
</script>

<style>
</style>
