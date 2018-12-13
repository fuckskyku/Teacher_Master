<template>
    <div id="register">
        <div class="tables">
            <div class="tables-head">
                <!-- 积分信息 -->
                <div class="countPoints">
                    <span class="icon"> <img src="/static/img/积分icon.png" alt=""></span>
                    <span class="number">{{countPoints}}</span>
                    <span class="words">签到积分</span>  
                </div>
                <div class="signInNumberOfDays">
                    已连续签到 <span>{{countDays}}</span> 天，连续越多获奖越多哟～
                </div>
            </div>
            <div class="tables-month">
                <span class="minus" @click="minus()"> < </span>
                <span class="month">{{date.month}}月</span>
                <span class="add" @click="add()">></span>
            </div>
            <div class="tables-landscape">
                    <ul class="weekdays">
                        <li>日</li>
                        <li>一</li>
                        <li>二</li>
                        <li>三</li>
                        <li>四</li>
                        <li>五</li>
                        <li>六</li>
                    </ul>
            </div>
            <div class="tables-dates">
                <ul class="dates">
                  <li v-for="value in days" v-html="value"><span>{{value}}</span></li>
                </ul>
            </div>
        </div>
        <div class="rule">
            <span>签到规则：</span>
            <div>
                    连续签到第1-7天每天得5积分，连续签到第8-14天每天得6积分，连续签到第15-21天每天得8积分，连续签到第22-28天每天得13积分，第7/14/21/28天用户可以额外获得奖励积分，连续签到天数越多所获得的积分越多。以28天为一个周期循环。
            </div>
        </div>
        <div class="" @click="po()"></div>
    </div>
</template>
<script>
import formGenerated from "@/util/TimeInformation.js";
import { lists, judgeWeek } from "@/util/tab.js";
import { getSignInPoints } from "@/api/api.js";
export default {
  data() {
    return {
      date: "",
      days: [],
      weekNumb: "",
      ddd: "",
      sss:"2018-09",
      countPoints: "", //总积分
      countDays: "" //连续签到天数

    };
  },
  methods: {
    back() {
      this.$router.push({ path: "/" });
    },
    add() {
      //点击事件  下个月
      var weekNUM = ""; //表示当月1号是星期几
      var lis = ""; //表示当月共有多少天
      if (this.date.month >= 12) {
        //判断是不是跨年月
        var month = 1;
        var year = this.date.year + 1;
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          //console.log("是闰年 又是跨年月")
          weekNUM = judgeWeek(month, year);
          lis = lists(weekNUM, month, 0, year);
          this.date.month = month;
          this.date.year = year;
          this.days = lis;
        } else {
          //console.log("不是闰年 是跨年月")
          weekNUM = judgeWeek(month, year);
          lis = lists(weekNUM, month, 1, year, year);
          this.date.month = month;
          this.date.year = year;
          this.days = lis;
        }
      } else {
        //不是跨年月
        var month = this.date.month + 1;
        var year = this.date.year;
        weekNUM = judgeWeek(month, year);
        lis = lists(weekNUM, month, this.date.leapYear, year); //生命周期函数中已经判断不跨年(本年)是否为闰年(this.date.leapyear的值)
        this.date.month = month;
        this.date.year = year;
        this.days = lis;
      }
    },
    minus() {
      //点击事件   上个月
      var weekNUM = ""; //表示当月1号是星期几
      var lis = ""; //表示当月共有多少天
      if (this.date.month <= 1) {
        //判断是不是 跨年月
        var month = 12;
        var year = this.date.year - 1;
        weekNUM = judgeWeek(month, year);
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
          //因为要往前算一年  所以要判断上一年是不是闰年
          //console.log(是闰年)
          lis = lists(weekNUM, month, 0);
          this.date.month = month;
          this.date.year = year;
          this.days = lis;
        } else {
          //不是闰年
          lis = lists(weekNUM, month, 1, year);
          this.date.month = month;
          this.date.year = year;
          this.days = lis;
        }
      } else {
        //这里不考虑是否会跨年  所以lists()直接传leapyear的值  leapyear值参考Timeinformation.js
        var month = this.date.month - 1;
        var year = this.date.year;
        weekNUM = judgeWeek(month, year);
        lis = lists(weekNUM, month, this.date.leapYear, year);
        this.date.month = month;
        this.date.year = year;
        this.days = lis;
      }
    }
  },
  created() {
    getSignInPoints().then(res => {
      // 渲染页面总积分和连续签到天数
      if (res.data.code == "200") {
        this.countPoints = res.data.data.signInPoint;
        this.countDays = res.data.data.signInDays;
      }
    });
    formGenerated().then(res => {
      this.date = res;
      // console.log(this.date);
      var lis = lists(
        this.date.MyDate,
        this.date.month,
        this.date.leapYear,
        this.date.year
      );
      this.days = lis;
      // console.log(lis);
    });
  }
};
</script>
<style lang="scss">
@import '../../../../assets/Scss/publicTemplate/UserInfoAndWeater.scss';

</style>


