<template>
	<view>
		<!-- 用户信息 开始 -->
		<view class="user_info">
			<view class="user_icon">
				<image mode="widthFix" :src="imgDetail.user.avatar"></image>
			</view>
			<view class="user_desc">
				<view class="user_name">{{imgDetail.user.name}}</view>
				<view class="user_time">{{imgDetail.cnTime}}</view>
			</view>
		</view>
		<!-- 用户信息 结束 -->
		<!-- 高清大图 开始 -->
		<view class="high_img">
			<swiper-action @swiperAction="handleSwiperAction">
				<image mode="widthFix" :src="imgDetail.img"></image>
			</swiper-action>		
		</view>
		<!-- 高清大图 结束 -->
		<!-- 点赞 开始 -->
		<view class="user_rank">
			<view class="rank">
				<text class="iconfont icon-zan">
					{{imgDetail.rank}}
				</text>
			</view>
			<view class="user_collect">
				<text class="iconfont icon-shoucang">
					收藏
				</text>
			</view>
		</view>
		<!-- 点赞 结束 -->
		<!-- 专辑 开始 -->
		<view class="album_wrap" v-if="album.length">
			<view class="album_title">相关</view>
			<view class="album_list">				
				<view class="album_item"
				v-for="item in album"
				:key="item.id"
				>
					<view class="album_cover">
						<image mode="aspectFill" :src="item.cover"></image>
					</view>
					<view class="album_info">
						<view class="album_info_text">专辑</view>
						<view class="album_name">{{item.name}}</view>
						<view class="iconf"> > </view>
					</view>
				</view>
			</view>
		</view>
		<!-- 专辑 结束 -->
		<!-- 最热评论 开始 -->
		<view class="comment hot" v-if="hot.length">
			<view class="comment_title">
				<view class="iconfont icon-shoucang"></view>
				<view class="comment_text">最新评论</view>
			</view>
			<view class="comment_list">
				<view class="comment_item"
				v-for="item in hot"
				:key="item.id"
				>
					<view class="comment_user">
						<view class="user_icon">
							<image mode="widthFix" :src="item.user.avatar"></image>
						</view>
						<view class="user_name">
							<view class="user_nickname">{{item.user.name}}</view>
							<view class="user_time">{{item.cnTime}}</view>
						</view>
						<!-- 用户徽章 -->
						<view class="user_badge">
							<image 
							v-for="item2 in item.user.title" 
							:key="item2.icon"
							:src="item2.icon"
							></image>
						</view>
					</view>
					<view class="comment_desc">
						<view class="comment_content">{{item.content}}</view>
						<view class="iconfont icon-zan">{{item.size}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 最热评论 结束 -->
		<!-- 最新评论 开始 -->
		<view class="comment new" v-if="comment.length">
			<view class="comment_title">
				<view class="iconfont icon-shoucang"></view>
				<view class="comment_text">最新评论</view>
			</view>
			<view class="comment_list">
				<view class="comment_item"
				v-for="item in comment"
				:key="item.id"
				>
					<view class="comment_user">
						<view class="user_icon">
							<image mode="widthFix" :src="item.user.avatar"></image>
						</view>
						<view class="user_name">
							<view class="user_nickname">{{item.user.name}}</view>
							<view class="user_time">{{item.cnTime}}</view>
						</view>
						<!-- 用户徽章 -->
						<view class="user_badge">
							<image 
							v-for="item2 in item.user.title" 
							:key="item2.icon"
							:src="item2.icon"
							></image>
						</view>
					</view>
					<view class="comment_desc">
						<view class="comment_content">{{item.content}}</view>
						<view class="iconfont icon-zan">{{item.size}}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 最新评论 结束 -->		
		<!-- 下载 开始 -->
		<view class="download">
			<view class="download_btn" @click="handleDownload">
				下载图片
			</view>
		</view>
		<!-- 下载 结束 -->
	</view>
</template>

<script>
import moment from "moment";
import swiperAction from "@/components/swiperAction"
// 设置语言为中文 
moment.locale("zh-cn");
export default{
	components:{
		swiperAction
	},
	data() {
		return {
			// 图片的索引
			imgIndex:0,
			//图片信息对象 包括 着用户头像,id。。。
			imgDetail:[],
			
			// 专辑数据
			album:[],
			//最新评论
			comment:[],
			//最热评论
			hot:[]
		}
	},
	onLoad() {
		const {imgIndex}=getApp().globalData;		
		this.imgIndex=imgIndex;	
		// console.log(this.imgDetail);
		this.getData();
	},
	methods:{
		getData(){
			const {imgList}=getApp().globalData;
			this.imgDetail=imgList[this.imgIndex];
			// xxx年前的数据
			this.imgDetail.cnTime=moment(this.imgDetail.atime*1000).from();
			// 获取图片详情的id
			// this.imgDetail.id
			this.getComments(this.imgDetail.id)
		},
		// 通过id请求获取图片评论数据
		getComments(id){
			this.request({
				url:`http://157.122.54.189:9088/image/v2/wallpaper/wallpaper/${id}/comment`
			})
			.then(result=>{
				//console.log(result);
				
				// 给hot、commen数组中的对象添加一个时间属性 xxx月前
				// 将时间戳改为 xxx年前的形式
				// 不能直接用 this.comment.cnTime=moment(this.comment.atime*1000).fromNow();
				// 时间戳有多个，在数组中，需要用循环forEach添加
				result.res.comment.forEach(v=>v.cnTime=moment(v.atime*1000).fromNow());
				result.res.hot.forEach(v=>v.cnTime=moment(v.atime*1000).fromNow());
				
				this.album=result.res.album;
				this.comment=result.res.comment;
				this.hot=result.res.hot;
				
			})
		},
		// 滑动事件 左滑 右滑 图片
		handleSwiperAction(e){
			// console.log(e);
			const {imgList}=getApp().globalData;
			if(e.direction==="left" && this.imgIndex<imgList.length-1){
				// 可以进行 左滑 加载下一页
				this.imgIndex++;
				this.getData();
			}else if(e.direction==="right" && this.imgIndex>0){
				// 可以进行 左滑 加载下一页
				this.imgIndex--;
				this.getData();
			}else{
				uni.showToast({
					title:"没有数据了",
					icon:"none"
				})
			}
			
		},
		// 点击下载图片 async await promise
		async handleDownload(){
			//先将文件下载到小程序缓存中,再将缓存中的文件下载到本地中
			//uni.downloadFile()
			//uni.saveImageToPhotosAlbum
			
			await uni.showLoading({
				title:"下载中"
			})
			
			// 1 将远程文件下载到小程序的内存中 tempFilePath
			const result1=await uni.downloadFile({url:this.imgDetail.img});
			const {tempFilePath}=result1[1];
			
			// 2 将小程序内存中的临时文件下载到本地上
			const result2=await uni.saveImageToPhotosAlbum({ filePath:tempFilePath })
			console.log(result2);
			
			uni.hideLoading();
			await uin.showToast({
				title:"下载成功"
			})
		}
	}
}
</script>

<style lang="scss" scoped>
// 用户信息
.user_info{
	display: flex;
	padding: 20rpx;
	.user_icon{
		padding: 0 20rpx;
		image{
			width: 88rpx;
			border-radius: 50%;		
		}
	}
	
	.user_desc{
		.user_name{
			color: #000;
			font-weight: 600;
		}
		.user_time{
			color: #ccc;
			font-size: 24rpx;
			padding: 10rpx 0;
		}
	}
}
// 
.user_rank{
	display: flex;
	height: 80rpx;
	border-bottom: 5rpx solid #eee;
	.rank{		
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		.iconfont{
		}
	}
	
	.user_collect{
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		.iconfont{
			
		}
	}
}
// 高清大图
.high_img{
	image{
		border-bottom: 1rpx solid #eee;
	}
}

//专辑
.album_wrap {
	padding: 20rpx;
  .album_title {
	  padding: 10rpx 0;
  }

  .album_list {	 
    .album_item {
	   display: flex; 
	   padding: 10rpx;
	   border-bottom: 10rpx solid #eee;
      .album_cover {
		 flex: 1; 
        image {
			width: 180rpx;
			height: 180rpx;
        }
      }


      .album_info {
		  flex: 3;
		  padding-left: 20rpx;
		  position: relative;
        .album_info_text {
			color:#fff;
			background-color: $color;
			width: 100rpx;
			height: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 10rpx 0;
        }

        .album_name {
			color: #888;
			padding: 10rpx 0;
        }
		.iconf{
			font-size: 50rpx;
			position: absolute;
			display: flex;
			top: 50%;
			// es 6
			transform: translateY(-50%);
			right: 10%;
			color: #666;
		}
      }
    }
  }
}

//最热评论
.comment {
  .comment_title {
	  display: flex;
	  padding: 20rpx;
    .iconfont {
		color: #ff1b02;
    }

    .comment_text {
		font-size: 24rpx;
		color: #000;
		font-weight: 600;
    }
  }

.comment_list {
  .comment_item {
	 border-bottom: 15rpx solid #eee; 
  // 用户信息
  
      .comment_user {
		  display: flex;
		  padding: 20rpx 0;		  
        .user_icon {
			width: 15%;
			display: flex;
			justify-content: center;
			align-items: center;
          image {
			  width: 90%;
          }
        }
  
        .user_name {
			flex: 1;
			padding: 0 10rpx;
          .user_nickname {
			 color: #000;
          }
  
          .user_time {
			  color: #888;
          }
        }
  
        .user_badge {
          image {
			  width: 40rpx;
			  height: 40rpx;
			  display: inline-block;
          }
        }
      }
      // 评论数据
      .comment_desc {
		 display: flex;
		 padding: 30rpx 0;
		 
        .comment_content {
			flex: 1;
			padding-left: 15%;
			color: #000;
        }
   
        .comment_like {
			text-align: right;
          .icon-zan {
  
          }
        }
      }
    }
  }
}
// 最新评论
.new{
	.icon-shoucang{
		color: #00dcf7!important;
	}
}

// 下载
.download{
	
	height: 120rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	
	
	.download_btn{
		width: 90%;
		height: 85%;
		font-size: 50rpx;
		font-weight: 600;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: $color;
	}
}
</style>
