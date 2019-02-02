<template>
  <div id="app">
    <x-header :left-options="{backText: '',showBack: isShowBack}">{{xHeaderText}}</x-header>
    <keep-alive include="CourseList,home">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
  import {XHeader} from 'vux'
  
  export default {
    name: 'App',
    components: {XHeader},
    data() {
      return {
        xHeaderText: '课程预约',
        isShowBack: false,
        openid: '',
      }
    },
    watch: {
      '$route.name': function () {
        const routeName = this.$route.name;
        // console.log(routeName);
        switch (routeName) {
          case 'CourseList':
            this.isShowBack = true;
            this.xHeaderText = '课程列表';
            break;
          case 'courseDetails':
            this.isShowBack = true;
            this.xHeaderText = '课程详情';
            break;
          case '预约':
            this.isShowBack = true;
            this.xHeaderText = '课程预约';
            break;
          default:
            this.isShowBack = false;
            this.xHeaderText = '首页';
        }
        
        // console.log(this.isShowBack);
      }
      
      
    },
    methods: {
      getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = location.search.substr(1).match(reg);
        if ( r != null ) return decodeURI(decodeURIComponent(decodeURI(r[ 2 ])));
        return null;
      }
    },
    mounted() {
      this.openid = this.getUrlParam('openid');

      
      // alert(this.openid)
      // console.log(location.search);
    }
  }
</script>

<style>
  #app {
    height: 100%;
    /*flex: 1;*/
    width: 100%;
    overflow: scroll;
    overflow-scrolling: touch;
  
  }
</style>
