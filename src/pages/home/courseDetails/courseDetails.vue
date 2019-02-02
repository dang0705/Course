<template>
  <div class="course courseDetails" id="courseDetails" ref="courseDetails">
    <div id="titleImg">
      <img width="100%" :src="listParams.img" alt="">
    </div>
    <transition mode="out-in" name="go_down">
      <div v-show="!is_course" class="info">
        <div class="produce">
          <div>简介</div>
          <p>{{courseDetails.Profile}}</p>
        </div>
        <div class="contact_us">
          <h1>Contact Us</h1>
          <p><img width="4%" :src="`${img_path}/address.png`" alt=""><span>{{courseDetails.Address}}</span></p>
          <p><img width="4%" :src="`${img_path}/phone.png`" alt=""><span>{{courseDetails.Phone}}</span></p>
          <p><img width="4%" :src="`${img_path}/duration.png`" alt=""><span>{{courseDetails.CourseDuration}}</span></p>
          <p><img width="4%" :src="`${img_path}/mail.png`" alt=""><span>{{courseDetails.Email}}</span></p>
        </div>
      </div>
    </transition>
    
    <transition mode="out-in" name="go_up" @after-enter="after_enter" @before-enter="before_enter">
      <div class="course_booking" v-show="is_course">
        <group label-width="25vw">
          <selector
            title="时间："
            ref="valueMapRef"
            placeholder="请选择课程时间"
            :options="list"
            v-model="date_selected"
            :value-map="['TimetableId','Date']"
            @on-change="inputBlur"
            @click.native="inputBlur"
          ></selector>
          <x-input
            title="姓名："
            placeholder="您的姓名"
            :max="10"
            v-model="name"
            required
            @on-blur="inputBlur"
            @on-focus="inputFocus"
          ></x-input>
          <x-input
            title="电话："
            v-model="tel"
            placeholder="您的手机号"
            :max="11"
            type="tel"
            @on-blur="inputBlur"
            @on-focus="inputFocus"
            required
          ></x-input>
          <x-input
            title="验证码："
            placeholder="您的验证码"
            v-model="code"
            :max="4"
            type="tel"
            @on-blur="inputBlur"
            @on-focus="inputFocus"
            required
          >
            <x-button slot="right"
                      type="primary"
                      mini
                      :disabled="is_code_disabled"
                      @click.native="getCode"
            >{{code_text}}
            </x-button>
          </x-input>
        </group>
        <flexbox v-show="is_btn_show" style="padding: 0 5vw;position: relative;top: 15vh;">
          <flexbox-item>
            <x-button
              type="primary"
              @click.native="confirm('valueMapRef')"
            >确认预约
            </x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="warn" @click.native="cancel">取消预约</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </transition>
    <div id="booking" @click="to_course" v-show="!is_course">预约该课程</div>
    <div v-transfer-dom>
      <alert
        v-model="alert_show"
        hide-on-blur
        :title="alert_title"
        :content="alert_content"
      >
      </alert>
      <div v-transfer-dom>
        <confirm v-model="confirm_show"
                 :title="confirm_title"
                 :content="confirm_content"
                 :show-cancel-button="false"
                 @on-confirm="onConfirm"
        >
        </confirm>
      </div>
    </div>
    <loading :show="is_loading" text="请稍后。。。"></loading>
  </div>
</template>

<script>
  import {
    Group,
    Selector,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem,
    Alert,
    TransferDomDirective as TransferDom,
    Loading,
    Confirm
  } from 'vux'
  
  export default {
    name: "courseDetails",
    directives: {
      TransferDom
    },
    components: {
      Selector,
      Group,
      XInput,
      XButton,
      Flexbox,
      FlexboxItem,
      Alert,
      Loading,
      Confirm
    },
    data() {
      return {
        browser: '',
        img_path: 'static/img',
        listParams: {},
        courseDetails: {},
        is_course: false,
        is_btn_show: false,
        date_selected: '',
        name: '',
        tel: '',
        tel_reg: /^1[0-9]{10}$/,
        code: '',
        list: [],
        code_text: '发送验证码',
        is_code_disabled: false,
        timer: null,
        isFocus: false,
        alert_show: false,
        alert_content: '',
        alert_title: '',
        is_loading: false,
        confirm_show: false,
        confirm_content: '',
        confirm_title: '预约成功'
      }
    },
    methods: {
      
      to_course() {
        this.is_course = true
        
      },
      after_enter() {
        this.is_btn_show = true
      },
      before_enter() {
        this.is_btn_show = false
      },
      inputBlur(val, $event) {
        // console.log(val, $event);
        // console.log(this.browser);
        if ( this.browser.includes('iPhone') ) {
          this.isFocus = false;
          // console.log(1);
          setTimeout(() => {
            if ( document.body.scrollTop && !this.isFocus ) {
              document.body.scrollTop = 0;
            }
          }, 150)
        }
        
        
      },
      inputFocus(val, $event) {
        // console.log($event);
        if ( this.browser.includes('iPhone') ) {
          setTimeout(() => {
            this.isFocus = true;
          }, 100)
        }
        
      },
      cancel() {
        this.inputBlur();
        this.is_course = false
      },
      fail_alert(ctx) {
        this.alert_show = true;
        this.alert_title = ctx;
        this.alert_content = ``;
      },
      onConfirm() {
        this.$router.push('/')
      },
      confirm(fullValue) {
        // console.log(this.$refs[ fullValue ].getFullValue());
        let time, hours, CourseTitle, am_pm, myDate, getFullValue;
        if ( this.$refs[ fullValue ].getFullValue() ) {
          getFullValue = this.$refs[ fullValue ].getFullValue()[ 0 ].Date;
          myDate = getFullValue.split(' ')[ 0 ];  /*日期*/
          time = getFullValue.split(' ')[ 1 ];    /*时间*/
          hours = time.split(':')[ 0 ];           /*小时*/
          CourseTitle = this.courseDetails.CourseTitle;
        }
        
        if ( hours < 12 ) {
          am_pm = '上午'
        } else {
          am_pm = '下午'
        }
        // console.log(this.date_selected, this.name, this.tel, this.code);
        if ( !this.date_selected || !this.$refs[ fullValue ].getFullValue() ) {
          this.fail_alert('请选择课程')
        } else if ( !this.name ) {
          this.fail_alert('请输入您的姓名')
        } else if ( !this.tel && !this.tel_reg.test(this.tel) ) {
          this.fail_alert('请正确输入手机号')
        } else if ( !this.code ) {
          this.fail_alert('请输入验证码')
        } else {
          const that = this;
          that.is_loading = true;
          that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=submitcode
                            &username=${that.name}
                            &phone=${that.tel}
                            &timetableid=${that.date_selected}
                            &code=${that.code}`)
            .then(data => {
              const status = data.data.Status;
              that.code = '';
              that.stopInterval(that);
              that.is_loading = false;
              if ( status === '200' ) {
                that.cancel();
                that.confirm_show=true;
                that.confirm_title = '预约成功！';
                that.confirm_content = `亲爱的${that.name}，请于：</br>
                                      ${myDate}${am_pm}${time}参与</br>
                                     ”${CourseTitle}“的课程`;
              } else if ( status === '1' ) {
                that.alert_show = true;
                that.alert_title = '验证码错误';
                that.alert_content = `您输入的验证码有误</br>
                                      请核对后重新输入`
              } else if ( status === '2' ) {
                that.alert_show = true;
                that.alert_title = '该课程已预约';
                that.alert_content = `抱歉，您已经预约过该节课程。</br>
                                      请选择其他课程进行预约。`
              }
            })
        }
      },
      stopInterval(that) {
        clearInterval(that.timer);
        that.timer = null;
        that.code_text = '发送验证码';
        that.is_code_disabled = false;
      },
      getCode() {
        const that = this;
        clearInterval(that.timer);
        let second = 30;
        console.log(that.tel_reg.test(that.tel));
        // that.code_text = second + '秒';
        if ( that.tel && that.tel_reg.test(that.tel) ) {
          that.is_code_disabled = true;
          that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=getcode&phone=${that.tel}`)
            .then(data => {
              if ( data.data.Status === '200' ) {
                that.timer = setInterval(() => {
                  console.log(second);
                  second--;
                  that.code_text = second + 's';
                  if ( second <= 0 ) {
                    that.stopInterval(that)
                  }
                }, 1000);
              } else {
                that.fail_alert(data.data.result)
              }
            })
        } else {
          that.fail_alert('请正确输入手机号')
        }
      }
    },
    
    mounted() {
      this.is_loading = true;
      this.browser = navigator.userAgent;
      this.listParams = this.$route.params;
      this.id = this.listParams.id;
      console.log(this.id);
      const that = this;
      that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=selectpicker&courseid=${this.id}`)
        .then(data => {
          console.log(data);
          if ( data.data.Status === '200' ) {
            that.list = data.data.data
          }
        });
      if ( this.listParams.courseDetails ) {
        this.courseDetails = JSON.parse(this.listParams.courseDetails)[ 0 ]
        that.is_loading = false;
      } else {
        that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=coursedetails&courseid=${this.id}`)
          .then(data => {
            that.is_loading = false;
            if ( data.data.Status === '200' ) {
              console.log(data);
              this.courseDetails = data.data.data[ 0 ]
            }
          })
      }
      console.log(this.courseDetails);
    }
  }
</script>

<style scoped lang="stylus">
  .go_down-enter,
  .go_up-enter
    transform translateX(100%)
  
  .go_down-enter-active,
  .go_up-enter-active
    transition .6s


</style>
