<template>
	<view class="video_play">
		<image :src="videoObj.img"></image>
		<view class="video_tool">
			<view @click="handleMuted" :class="['iconfont',muted?'icon-jingyin':' icon-shengyinyinliangxianxing']"></view>
			<view class="iconfont icon-forward-null">
				<button open-type="share"></button>
			</view>
		</view>
		<view class="video_wrap">
			<video objectFit="fill" :muted="muted" :src="videoObj.video"></video>
		</view>
		<view class="download">
			<view @click="handleDownload" class="download_btn">下载高清</view>
		</view>
	</view>
</template>

<script>
export default{
	data() {
		return {
			videoObj:{},
			muted:false
		}
	},
	onLoad() {
		this.videoObj=getApp().globalData.video;
		// console.log(this.videoObj);
	},
	methods:{
		// 开关声音
		handleMuted(){
			this.muted=!this.muted;
		},
		
		//下载高清视频
		async handleDownload(){
			await uni.showLoading({
				title:"下载中"
			})
			// 1 将远程文件下载到小程序内存中 2 将小程序内存中的文件下载到本地
			const result1=await uni.downloadFile({url:this.videoObj.video})
			const {tempFilePath}=result1[1];
			
			await uni.saveVideoToPhotosAlbum({
				filePath:tempFilePath
			});
			
			uni.hideLoading();
			await uni.showToast({
				title:"下载成功"
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.video_play {
	 position: relative;
   image {
	 position: absolute;
	 width: 100vh;
	 height: 100vh;
	 z-index: -1;
	// css3 滤镜
	filter: blur(20rpx);
  }

  .video_tool {
	  height: 80rpx;
	  display: flex;
	  justify-content: flex-end;
      .iconfont{		 
		 color: #fff;
		 width: 80rpx;
		 border-radius: 40rpx;
		 font-size: 50rpx;
		 background-color: rgba(0,0,0,.2);
		 display: flex;
		 justify-content: center;
		 align-items: center;
		 margin-right: 20rpx;
	  }
	  .icon-forward-null{
		position: relative;
		  button{
			 position: absolute;
			 width: 100%;
			 height: 100%;
			 opacity: 0;
		  }
	  }
  }

  .video_wrap {
     display: flex;
	 justify-content: center;
	 align-items: center;  
    video {
		width: 360rpx;
		height: 600rpx;
    }
  }

  .download {
	  display: flex;
	  justify-content: center;
	  
	  margin-top: 30rpx;
    .download_btn {
		width: 360rpx;
		height: 80rpx;
		border-radius: 40rpx;
		background-color: rgba(0,0,0,.6);
		color: #fff;
		border: 1rpx solid #fff;
		display: flex;
		justify-content: center;
		align-items: center;
    }
  }
}
</style>
