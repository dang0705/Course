import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home/home'

// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: '/open/miniProgram_oushang',
  scrollBehavior: (to, from, savePosition) => {
    console.log(to, from, savePosition);
  }
  ,
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      /*  beforeEnter: (to, from, next) => {
		  document.getElementById('title').innerText = '培训教师合作方'
		  next()
		}*/
    }
    ,
    {
      path: '/CourseList',
      name: 'CourseList',
      meta: {
        keepAlive: true
      },
      component: resolve => require([ '@/pages/home/CourseList/CourseList' ], resolve),
    }
    ,
    {
      path: '/courseDetails',
      name: 'courseDetails',
      component: resolve => require([ '@/pages/home/courseDetails/courseDetails' ], resolve),
    }
    ,
    {
      path: '/course',
      name: '预约',
      component: resolve => require([ '@/pages/home/course/course' ], resolve)
    }
  ]

});
router.beforeEach((to, from, next) => {
  next()
});
export default router
