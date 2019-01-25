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
            placeholder="您的手机验证码"
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
  
  </div>
</template>

<script>
  import {Group, Selector, XInput, XButton, Flexbox, FlexboxItem} from 'vux'
  
  export default {
    name: "courseDetails",
    components: {
      Selector,
      Group,
      XInput,
      XButton,
      Flexbox,
      FlexboxItem
    },
    data() {
      return {
        img_path: 'static/img',
        listParams: {},
        courseDetails: {},
        is_course: false,
        is_btn_show: false,
        date_selected: '',
        name: '',
        tel: '',
        tel_reg: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
        code: '',
        list: [],
        code_text: '发送验证码',
        is_code_disabled: false,
        timer: null,
        isFocus: false
      }
    },
    methods: {
      
      to_course() {
        this.is_course = true
        /*     this.$router.push({
			   path: '/course',
			   query: {
				 id: this.id,
				 img: this.listParams.img
			   }
			 })*/
      },
      after_enter() {
        this.is_btn_show = true
      },
      before_enter() {
        this.is_btn_show = false
      },
      inputBlur(val, $event) {
        console.log(val, $event);
        this.isFocus = false;
        setTimeout(() => {
          if ( document.body.scrollTop && !this.isFocus ) {
            document.body.scrollTop = 0;
          }
          console.log(this.isFocus);
        }, 150)
        
      },
      inputFocus(val, $event) {
        console.log($event);
        setTimeout(() => {
          this.isFocus = true;
          console.log(this.isFocus);
        }, 100)
      },
      cancel() {
        this.inputBlur();
        this.is_course = false
      },
      confirm(fullValue) {
        // console.log(this.$refs[ fullValue ].getFullValue());
        let time = this.$refs[ fullValue ].getFullValue()[ 0 ].Date.split(' ')[ 1 ].split(':')[ 0 ],
          am_pm;
        if ( time < 12 ) {
          am_pm = '上午'
        } else {
          am_pm = '下午'
        }
        console.log(am_pm);
        // console.log(this.date_selected, this.name, this.tel, this.code);
        if ( !this.date_selected ) {
          alert('请选择课程')
        } else if ( !this.name ) {
          alert('请输入您的姓名')
        } else if ( !this.code ) {
          alert('请输入验证码')
        } else {
          const that = this;
          that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=submitcode
                            &username=${that.name}
                            &phone=${that.tel}
                            &timetableid=${that.date_selected}
                            &code=${that.code}`)
            .then(data => {
              console.log(data);
            })
        }
      },
      getCode() {
        const that = this;
        //clearInterval(that.timer);
        that.is_code_disabled = true;
        let second = 60;
        // that.code_text = second + '秒';
        if ( that.tel && !that.tel_reg.test(that.tel) ) {
          that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=getcode&phone=${that.tel}`)
            .then(data => {
              console.log(data);
              if ( data.data.Status === '200' ) {
                that.timer = setInterval(() => {
                  console.log(second);
                  second--;
                  that.code_text = second + 's';
                  if ( second <= 0 ) {
                    clearInterval(that.timer);
                    that.timer = null;
                    that.code_text = '发送验证码';
                    that.is_code_disabled = false;
                  }
                }, 1000);
              } else {
              
              }
            })
        } else {
          // alert('请正确输入手机号')
        }
      }
    },
    
    mounted() {
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
      } else {
        that.$axios.post(`/yl/YLHandler.ashx?type=AuchanCourse&action=coursedetails&courseid=${this.id}`)
          .then(data => {
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
