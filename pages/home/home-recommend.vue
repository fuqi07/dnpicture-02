<template>
	<scroll-view scroll-y @scrolltolower="handleToLower" class="recommend_view" v-if="recommends.length>0">
     <!-- 推荐 开始 -->
	 <view class="recommend_wrap">
		 <navigator class="recommend_item"
		 v-for="item in recommends"
		 :key="item.id"
		 :url="`/pages/album/index?id=${item.target}`"
		 >
		 <image mode="widthFix" :src="item.thumb"></image>
		 </navigator>
	 </view>
	 <!-- 推荐 结束 -->
	 <!-- 月份 开始 -->
	 <view class="months_wrap">
		 <view class="months_title">
			 <view class="months_title_info">
				 <view class="months_info">
					 <text>{{monthes.DD}} / </text>
					 {{monthes.MM}} 月
				 </view>
				 <view class="months_text">
					 {{monthes.title}}
				 </view>
			 </view>
			 <view class="months_title_more">更多 ></view>
		 </view>
		 <view class="months_content">
			 <view class="months_item"
			 v-for="(item,index) in monthes.items"
			 :key="item.id"
			 >
			 <go-detail :list="monthes.items" :index="index">
				 <image mode="aspectFill" :src="item.thumb"></image>
			 </go-detail>
			  
			 </view>
		 </view>
	 </view>
	 <!-- 月份 结束 -->
	 <!-- 热门 开始 -->
	 <view class="hots_wrap">
		 <view class="hots_title">
			 <text>热门</text>
		 </view>
		 <view class="hots_content">
			 <view class="hots_item"
			 v-for="(item,index) in hots"
			 :key="item.id"
			 >
			  <go-detail :list="hots" :index="index">
				  <image :src="item.thumb"></image>
			  </go-detail>
				 
			 </view>
		 </view>
	 </view>
	 <!-- 热门 结束 -->
	</scroll-view>
</template>

<script>
import moment from "moment";
import  goDetail  from "@/components/goDetail"
export default{
	components:{
		goDetail
	},
	data() {
		return {
			// 推荐列表
			recommends:[],
			// 月份
			monthes:[],
			// 热门
			hots:[],
			//
			params:{
				limit:30,
				order:"hot",
				skip:0
			},
			// 是否还有下一页
			hasMore:true
		}
	},
	mounted() {
		// 修改页面的标题
		uni.setNavigationBarTitle({
			title:"推荐"
		});
		
		this.getList();
	},
	methods:{
		getList(){
			this.request({
				url:"http://157.122.54.189:9088/image/v3/homepage/vertical",
				data:this.params
			})
			.then(result=>{
				//console.log(result);
				if(result.res.vertical==0){
					this.hasMore=false;
					uni.showToast({
						title:"没有更多数据了",
						icon:"none"
					})
					return ;
				}
				if(this.recommends.length===0){
					//推荐模块
					this.recommends=result.res.homepage[1].items;
					//月份模块
					this.monthes=result.res.homepage[2];
					// 将时间戳 改成 18号/ 月 moment.js
					this.monthes.MM=moment(this.monthes.stime).format("MM");
					this.monthes.DD=moment(this.monthes.stime).format("DD");
					//console.log(this.monthes);
				}
				// 获取热门数据的列表
				//数据拼接 es6
				this.hots=[...this.hots,...result.res.vertical] ;
				
			})
		},
		
		// 滚动条触底事件
		handleToLower(){
			if(this.hasMore){
				this.params.skip+=this.params.limit;
				this.getList();
			}else{
				uni.showToast({
					title:"没有更多数据了",
					icon:"none"
				})
			}
		}
		
	}
	
}
</script>


<style lang="scss" scoped>
   .recommend_view{
   		// height : 屏幕的高度-头部标题的高度
   		height: calc(100vh - 36px);
   	}
	.recommend_wrap{
		// flex 布局
		display: flex;
		flex-wrap: wrap;
		.recommend_item{
			width: 50%;
			border: 5rpx solid #fff;
		}
	}
		
	// 月份
		 .months_wrap{
			.months_title {
				display: flex;
				padding: 20rpx;
				justify-content: space-between;
				.months_title_info {
					color:$color;
					font-size: 30rpx;
					font-weight: 600;
					display: flex;
				.months_info {					
						text {
						  font-size: 36rpx;							
						}
				}
				
					.months_text {
						font-size: 34rpx;
						color: #666;
						margin-left: 30rpx;
					}
				}
			
				.months_title_more {
				   font-style: 24rpx;
				   color: $color;
				}
			}
			
			.months_content {
			  display: flex;
			  flex-wrap: wrap;
			  .months_item{
				width: 33.33%;
				border: 5rpx solid #fff;
			  }
			} 
		 }
	
	// 热门
	.hots_wrap {
		.hots_title {
			padding: 20rpx;
			text {
				font-size: 36rpx;
				font-weight: 600;
				border-left: 20rpx solid $color;
				padding-left: 20rpx;
			}
		}

		.hots_content {
			display: flex;
			flex-wrap: wrap;
		  .hots_item {
			 width: 33.33%;
			 border: 5rpx solid #fff;
			image{
				
			}
		  }
		}
	}
</style>
