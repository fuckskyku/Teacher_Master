<template>
  <div id="weather">
    <img :src="imgType" alt>
    <div class="userId">
      {{userId}}
      <span>{{regards}}</span>
    </div>
    <div class="tip">{{tip}}</div>
    <el-button @click="hangintheair">开始我们的旅程</el-button>
  </div>
</template>

<script>
import { weatherInfo } from "@/api/api.js";
export default {
  data() {
    return {
      userId: this.getLocalStorage("login_userInfo").realName + "老师",
      tip: "",
      imgType: ""
    };
  },
  computed: {
    regards() {
      let now = new Date(),
        hour = now.getHours();
      if (hour < 6) {
        return "凌晨好";
      } else if (hour < 9) {
        return "早上好";
      } else if (hour < 12) {
        return "上午好";
      } else if (hour < 14) {
        return "中午好";
      } else if (hour < 17) {
        return "下午好";
      } else if (hour < 19) {
        return "傍晚好";
      } else if (hour < 22) {
        return "晚上好";
      } else {
        return "夜里好";
      }
    }
  },
  methods: {
    hangintheair() {
      this.$router.push({ path: "/hangintheair" });
    }
  },
  created() {
    var _this = this;
    let log, lat;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var longitude = position.coords.longitude;
          var latitude = position.coords.latitude;
        },
        function(e) {
          _this.$message({
            message: "您的坐标获取失败，导致天气不准请见谅。",
            type: "warning"
          });
        }
      );
    }
    weatherInfo({
      log: log,
      lat: lat
    }).then(res => {
      this.tip = res.data.data.weatherInfo;
      if (res.data.data.weaterType == 1) {
        this.imgType = "/static/insetImg/插画/天气/1.png";
      } else if (res.data.data.weaterType == 2) {
        this.imgType = "/static/insetImg/插画/天气/2.png";
      } else if (res.data.data.weaterType == 3) {
        this.imgType = "/static/insetImg/插画/天气/3.png";
      } else if (res.data.data.weaterType == 4) {
        this.imgType = "/static/insetImg/插画/天气/4.png";
      } else if (res.data.data.weaterType == 5) {
        this.imgType = "/static/insetImg/插画/天气/5.png";
      }
      // console.log(res)
    });
  }
};
</script>

<style lang="scss">
@import "../../../assets/Scss/publicTemplate/UserInfoAndWeater.scss";
</style>



