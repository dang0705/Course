<template>
  <div id="home">
    <swiper
      @on-index-change="onSwiperChange"
      :aspect-ratio="11/16"
      dots-position="center"
      height="250px"
    >
      <swiper-item
        v-for="(item,index) of banner_list"
        :key="index"
        @click.native="swiperItemClick({id:item.CourseId,img:item.Image})"
      >
        <div id="modal"></div>
        <img width="100%" :src="item.Image" alt="">
      </swiper-item>
    </swiper>
    
    <div id="tab_box">
      <div id="tabWrapper">
        <ul id="tab">
          <li
            v-for="(item,index) of tab_list"
            :class="{isActive:index===tab_index,tab:true}"
            @click=tabClick(index,$event)
          >
            {{item.SortName}}
          
          </li>
        </ul>
      </div>
    </div>
    <!--      <tab>
			<tab-item
			  active-color="#cc6733"
			  v-for="(item,index) of tab_list"
			  :selected="!index?true:false"
			  :key="index"
			  @click.native=tabClick(index)
			>
			  {{item.SortName}}
			</tab-item>
		  </tab>-->
    <div id="contentImgWrapper"
         @click="gotoContent(tab_id)"
    >
      <img id="contentImg" width="100%" alt=""
           :src="tab_list[tab_index].Image"
      >
    </div>
    <div v-transfer-dom>
      <loading :show="isLoadingShow" text="数据加载中"></loading>
    </div>
    <div v-transfer-dom>
      <alert
        v-model="alert_show"
        hide-on-blur
        :title="alert_title"
      >{{alert_text}}
      </alert>
    </div>
  </div>
</template>

<script>
  import {Swiper, SwiperItem, Tab, TabItem, Loading, Alert, TransferDomDirective as TransferDom,} from 'vux'
  
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
      Alert,
      Loading
    },
    data() {
      return {
        window_width: '',
        isActive: false,
        alert_show: false,
        alert_title: '',
        alert_text: '',
        banner_index: 0,
        banner_list: [],
        courseList: [],
        tab_index: 0,
        tab_id: 0,
        tab_img: '',
        isLoadingShow: false,
        tab_list: [ {
          Image: '',
        } ],
      }
    },
    methods: {
      fail_alert(ctx) {
        this.alert_show = true;
        this.alert_title = ctx;
        this.alert_text = ``;
      },
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
      tabClick(index, evt) {
        console.log(evt);
        const target = evt.target,
          tabWrapper = document.getElementById('tabWrapper');
        if ( target.offsetWidth + target.offsetLeft > this.window_width || (this.tab_list.length > 3 && index >= 2) ) {
          
          tabWrapper.scrollLeft = target.offsetLeft
        } else {
          tabWrapper.scrollLeft = 0
          
        }
        this.isActive = true;
        this.tab_index = index;
        this.tab_id = this.tab_list[ index ].SortId;
        this.tab_img = this.tab_list[ index ].Image;
        
      }
      ,
      gotoContent(sortID) {
        // this.$router.push('/CourseList/'+this.tab_id)
        // storage.setItem('tab_img', this.tab_img);
        const that = this;
        that.isLoadingShow = true;
        
        that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=courselist&sortid=${sortID}`)
          .then(data => {
            that.isLoadingShow = false;
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
            } else {
              that.fail_alert('敬请期待。。。')
            }
          });
        
      }
      ,
      getSwiperList() {
        const that = this;
        that.isLoadingShow = true;
        
        /*  params = new URLSearchParams();
        params.append('type', 'AuchanCourse');
        params.append('action', 'kvlist');*/
        that.$axios.post('/yl/YLHandler.ashx?type=AuchanCourse&action=kvlist').then(data => {
          // console.log(data);
          that.isLoadingShow = false;
          if ( data.data.Status === '200' ) {
            that.banner_list = data.data.data
          } else {
            that.fail_alert('敬请期待。。。')
          }
        })
      }
      ,
      getTabList() {
        const that = this;
        that.isLoadingShow = true;
        that.$axios.post('/yl/YLHandler.ashx?type=AuchanCourse&action=menulist').then(data => {
          // console.log(data);
          that.isLoadingShow = false;
          if ( data.data.Status === '200' ) {
            that.tab_list = data.data.data;
            that.tab_id = that.tab_list[ 0 ].SortId;
            that.tab_img = that.tab_list[ 0 ].Image;
          }
        })
      }
    },
    mounted() {
      this.getSwiperList();
      this.getTabList();
      this.isLoadingShow = false;
      this.window_width = document.body.clientWidth
    }
  }
</script>

<style scoped lang="stylus">
  #home
    padding-top: 36px
    height: 100%
    overflow-y hidden
    
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
    
    #tab_box
      width: 100%
      height: 8vh
      
      #tabWrapper
        width: 100%
        margin-top: 20px
        overflow-x scroll
        overflow-scrolling touch
      ul
        display flex
        width: 120%
        .isActive
          color #cc6733
          border-bottom: 3px solid #cc6733
        
        .tab
          white-space nowrap
          padding 1% 4%
          box-sizing border-box
          flex: 1
    
    #contentImgWrapper
      width: 90%
      height: 30vh
      overflow hidden
      margin 5% auto
      border-radius 5px
      box-shadow 3px 3px 8px rgba(0, 0, 0, .4)

</style>
