<template>
  <div id="home">
    <swiper
      @on-index-change="onSwiperChange"
      :aspect-ratio="11/16"
      dots-position="center"
      height="250px"
    >
      <!--<router-link
        v-for="(item,index) of banner_list"
        tag="div"
        class="vux-swiper-item"
        :to="{
          name: 'courseDetails',
          params: {
            id:item.CourseId,
            img:item.Image}
            }"
      >-->
         <swiper-item
		   v-for="(item,index) of banner_list"
		   :key="index"
		   @click.native="swiperItemClick({id:item.CourseId,img:item.Image})"
		 >
        <div id="modal"></div>
        <!--<div id="banner_text">
          <h1>{{item.CourseTitle}}</h1>
          <h1 class="eng">{{item.CourseViceTitle}}</h1>
        </div>-->
        <img width="100%" :src="item.Image" alt="">
      <!--</router-link>-->
      </swiper-item>
    </swiper>
    <div id="tabWrapper">
      <tab>
        <tab-item
          active-color="#cc6733"
          v-for="(item,index) of tab_list"
          :selected="!index?true:false"
          :key="index"
          @on-item-click=tabClick
        >
          {{item.SortName}}
        </tab-item>
      
      </tab>
      <div id="contentImgWrapper"
           @click="gotoContent(tab_id)"
      >
        <img id="contentImg" width="100%" alt=""
             :src="tab_list[tab_index].Image"
        >
      </div>
    </div>
    <div v-transfer-dom>
      <loading :show="isLoadingShow" text="数据加载中"></loading>
    </div>
  </div>
</template>

<script>
  import {Swiper, SwiperItem, Tab, TabItem, Loading, TransferDomDirective as TransferDom,} from 'vux'
  
  // const storage = window.localStorage;
  
  export default {
    name: "home",
    directives: {
      TransferDom
    },
    components: {
      Swiper,
      SwiperItem,
      Tab,
      TabItem,
      Loading
    },
    data() {
      return {
        banner_index: 0,
        banner_list: [],
        courseList: [],
        tab_index: 0,
        tab_id: 0,
        tab_img: '',
        isLoadingShow: true,
        tab_list: [ {
          Image: '',
        } ],
      }
    },
    methods: {
      beforeRouteLeave(to, from, next) {
        console.log('leave');
        console.log(this.tab_index);
        next()
      },
      onSwiperChange(index) {
        this.banner_index = index;
        console.log(this.banner_index);
      }
      ,
      swiperItemClick(params) {
        this.$router.push({
          name: 'courseDetails',
          params: params
        })
      }
      ,
      tabClick(index) {
        this.tab_index = index;
        this.tab_id = this.tab_list[ index ].SortId;
        this.tab_img = this.tab_list[ index ].Image;
      }
      ,
      gotoContent(sortID) {
        // this.$router.push('/CourseList/'+this.tab_id)
        // storage.setItem('tab_img', this.tab_img);
        const that = this;
        that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=courselist&sortid=${sortID}`)
          .then(data => {
            if ( data.data.Status === '200' ) {
              this.courseList = data.data.data;
              this.$router.push(
                {
                  path: '/CourseList',
                  query: {
                    courseList: JSON.stringify(this.courseList),
                    tab_img: this.tab_img
                  }
                })
            }
          });
        
      }
      ,
      getSwiperList() {
        const that = this;
        /*  params = new URLSearchParams();
        params.append('type', 'AuchanCourse');
        params.append('action', 'kvlist');*/
        that.$axios.post('/yl/YLHandler.ashx?type=AuchanCourse&action=kvlist').then(data => {
          // console.log(data);
          if ( data.data.Status === '200' ) {
            that.banner_list = data.data.data
          }
        })
      }
      ,
      getTabList() {
        const that = this;
        that.isLoadingShow = true;
        that.$axios.post('/yl/YLHandler.ashx?type=AuchanCourse&action=menulist').then(data => {
          // console.log(data);
          if ( data.data.Status === '200' ) {
            that.tab_list = data.data.data;
            that.tab_id = that.tab_list[ 0 ].SortId;
            that.tab_img = that.tab_list[ 0 ].Image;
          }
          that.isLoadingShow = false;
        })
      }
    },
    mounted() {
      this.getSwiperList();
      this.getTabList();
      this.isLoadingShow = false;
    }
  }
</script>

<style scoped lang="stylus">
  #home
    padding-top: 36px
    height: 100%
    
    .vux-slider
      color #fff
      
      #modal
        position: absolute
        width: 100%
        height: 100%
        background rgba(0, 0, 0, 0.2)
      
      #banner_text
        position: absolute;
        top: 50%
        transform translateY(-50%)
        width 100%
        text-align center
        
        h1
          font-size: 2rem;
          font-weight bold
          line-height: 1.2
        
        .eng
          font-weight normal
    
    #tabWrapper
      margin-top: 20px
      
      .vux-button-group
        margin 5% auto
        width: 90%
      
      #contentImgWrapper
        width: 90%
        /*height: 30.9%*/
        overflow hidden
        display block
        margin 5% auto
        border-radius 5px
        box-shadow 3px 3px 8px rgba(0, 0, 0, .4)

</style>
