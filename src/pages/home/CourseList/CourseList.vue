<template>
  <div id="courseList" @scroll="handleScroll">
    <img width="100%" :src="titleImg" alt="">
    <ul>
      <li
        class="course-item"
        v-for="(item,index) of courseList"
        :key="index"
        @click="gotoDetails({id:item.CourseId,img:item.Image,courseDetails:[]})"
      >
        <div class="imgWrapper">
          <img width="100%" :src="item.Image" alt="">
        </div>
        <div class="infoWrapper">
          <div class="header">
            <div class="look">查看详情</div>
            <p class="time">{{item.CourseDuration}}分钟</p>
          </div>
          <div class="title">
            {{item.CourseTitle}}
          </div>
          <div class="number">
            <img src="static/img/user.png" alt="">
            <span>剩余人数{{item.MaxNumber-item.ActualNumber}}</span>
          </div>
          <div class="footer">
            {{item.CourseNote}}
          </div>
        </div>
      </li>
    </ul>
    
    <divider v-show="isDividerShow">{{ dividerText }}</divider>
    <button id="scrollToTop" v-show="isToTopShow" @click="scrollToTop">↑</button>
  </div>
</template>

<script>
  import {Divider} from 'vux'
  
  export default {
    name: "CourseList",
    components: {
      Divider
    },
    data() {
      return {
        // params: 0,
        homeTop: 0,
        titleImg: '',
        dividerText: '已经到底啦',
        isDividerShow: false,
        isToTopShow: false,
        courseList: []
      }
    },
    methods: {
      gotoDetails(params) {
        const that = this;
        that.$axios.post(`https://api.shi1.cn/yl/YLHandler.ashx?type=AuchanCourse&action=coursedetails&courseid=${params.id}`)
          .then(data => {
            console.log(data);
            if ( data.data.Status === '200' ) {
              params.courseDetails = JSON.stringify(data.data.data);
              this.$router.push(
                {
                  name: 'courseDetails',
                  params: params
                }
              )
            }
          });
        
      }
      ,
      handleScroll(ev) {
        if ( ev.target.scrollTop + ev.target.clientHeight >= ev.target.scrollHeight ) {
          this.isDividerShow = this.isToTopShow = true;
        } else {
          this.isToTopShow = false;
        }
      }
      ,
      scrollToTop() {
        document.getElementById('courseList').scrollTop = 0
        // console.log(this.$refs[ 'courseList' ].target.scrollTop);
      }
    },
    activated() {
      document.getElementById('courseList').scrollTop = this.homeTop || 0
    },
    beforeRouteLeave(to, from, next) {
      let courseList = document.getElementById('courseList');
      this.homeTop = to.name === 'courseDetails' ? courseList.scrollTop : 0;
      next()
    },
    beforeRouteEnter(to, from, next) {
      console.log('to', to);
      console.log('from', from);
      const params = to.query;
      next(
        vm => {
          vm.titleImg = params.tab_img;
          vm.courseList = JSON.parse(params.courseList);
          vm.isDividerShow = vm.isToTopShow = false
        }
      )
    }
  }
</script>

<style scoped lang="stylus">
  #courseList
    padding-top: 36px
    height 100%
    overflow scroll
    
    .course-item
      padding 4%
      overflow hidden
      border-bottom: .5px solid #e2e2e2
      
      .imgWrapper
        width: 25vw
        height: 0
        padding-bottom: 25vw
        float left
      
      .infoWrapper
        width calc(100% - 25vw)
        float left
        height: 25vw
        position: relative
        padding-left: 4%
        .header
          overflow hidden
          font-size 1.2rem
          margin-bottom: 2.5%
          
          .look
            float left
            padding 1px 5px
            color #fff
            background #cc6733
          
          .time
            float right
        
        .title
          font-size: 3.2vw
          font-weight bold
          /*margin-bottom: 5%*/
          display -webkit-box
          -webkit-box-orient vertical
          -webkit-line-clamp 1
          text-overflow ellipsis
          overflow hidden
        .number
          color #cc6733
          font-size: 1rem
          height: 4vh
          line-height: 4vh
          letter-spacing .1rem
        .footer
          font-size: 1rem
          width 100%
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          color #a8a8a8
     /*     position: absolute
          bottom: 0
          left: 0*/
    
    #scrollToTop
      position: absolute
      width: 10vw
      height: 10vw
      background #cc6733
      border-radius 50%
      border: none
      color #fff
      z-index 99
      right: 5vw
      bottom: 5vh
      opacity: .8
</style>
