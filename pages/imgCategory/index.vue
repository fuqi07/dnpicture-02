<template>
	<view>
		<view  class="category_tab" >
			<view class="category_tab_title">
				<view class="title_inner" >
				<uni-segmented-control
				:current="current"
				:values="items.map(v=>v.title)"
				@clickItem="onClickItem"
				style-type="text"
				active-color="#d62e7b"
				></uni-segmented-control>	
				</view>
				 <view class="iconfont icon-search"></view>
			</view>
			
			
			<scroll-view  scroll-y enable-flex @scrolltolower="handleTOLower" class="category_tab_content" >
				<view class="cate_item"
				v-for="(item,index) in vertical"
				:key="item.id"
				>
				 <go-detail :list="vertical" :index="index">
					 <image mode="widthFix" :src="item.thumb"></image>
				 </go-detail>
					
				</view> 	
			</scroll-view>
		</view>
	</view>
	
</template>

<script>
import {uniSegmentedControl} from '@dcloudio/uni-ui'
import  goDetail  from "@/components/goDetail"
export default{
	components:{
		uniSegmentedControl,
		goDetail
	},
	data() {
		return {
			id:0,
			items:[			
				{title:"最新",order:"new"},
				{title:"热门",order:"hot"}
			],
			current:0,
			params:{
				limit:30,
				skip:0,
				order:"new"
			},
			// 页面显示数据的数组
			vertical:[],
			hasMore:true
		}
	},
	onLoad(options) {
		this.id=options.id
		this.getList();
	},
	methods:{
		getList(){
			this.request({
				url:`http://157.122.54.189:9088/image/v1/vertical/category/${this.id}/vertical`,
				data:this.params
			})
			.then(result=>{
				// console.log(result);
				if(result.res.vertical.length===0){
					this.hasMore=false;
					uni.showToast({
						title:"没有更多数据了",
						icon:"none"
					})
					return ;
				}
				
				this.vertical=[...this.vertical,...result.res.vertical];
			})
		},
		onClickItem(e){
			if(this.current !== e.currentIndex){
				this.current=e.currentIndex;
			}else{
				// 点击的是相同的标题
				return ;
			}
			this.params.order=this.items[e.currentIndex].order;
			this.params.skip=0;
			this.vertical=[];
			this.getList();
		},
		//加载下一页数据
		handleTOLower(){
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
    .category_tab{
		.category_tab_title{
			position: relative;
			.title_inner{
				width: 60%;
				margin: 0 auto;
			}
			.icon-search{
				position: absolute;
				top:50%;
				transform: translateY(-50%);
				right: 5%;
			}
		}
		.category_tab_content{
			display: flex;
			flex-wrap: wrap;
			height: calc(100vh - 36px);
			.cate_item{
				width: 33.33%;
				border: 5rpx solid #fff;
				image{
					
				}
			}
		}
	}
</style>
