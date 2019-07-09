<template>
  <div class="container">
            <div class="banner"></div>
            <section>
                <div class="content">
                    <ul>
                        <div class="empty">{{rankData ==''? '暂无数据' : ''}}</div>
                        <li class="cell" v-for="(item,index) in rankData">
                            <div class="hd">
                                {{item.sort > 3? item.sort : ''}}
                                <img v-if="item.sort < 4" :src="item.sort == 1?'/static/integral/1.png':item.sort == 2 ? '/static/integral/2.png' : item.sort == 3 ? '/static/integral/3.png' : index" alt="">
                                </div>
                            <div class="avatar">
                                <img :onerror="defaultImg" :src="item.avatarImg==''?'/static/integral/default.jpg': 'http://upload.mseenet.com' + item.avatarImg" alt="">
                            </div>
                            <div class="bd">{{item.nickName}}</div>
                            <div class="fd"> <span>+</span>&nbsp;<span>{{item.bonusPoint}}</span>&nbsp;分</div>
                        </li>
                    </ul>
                    
                </div>
                <div class="cell mine">
                    <div class="hd">{{mineObj.sort == '0' ? '--' : mineObj.sort}}</div>
                    <div class="avatar"><img :onerror="defaultImg" :src="mineObj.avatarImg == '' ? '/static/integral/default.jpg' : 'http://upload.mseenet.com' + mineObj.avatarImg" alt=""></div>
                    <div class="bd">{{mineObj.nickName}}</div>
                    <div class="fd"> <span>+</span>&nbsp;<span>{{mineObj.bonusPoint}}</span>&nbsp;分</div>
                </div>
                <p class="tip" style="">(提分榜：只累计活动期间内增加的积分)</p>
                <div class="btn">
                    <img @click="skip('classList')" src="/static/integral2/发布成绩.png" alt="">
                    <img @click="skip('issuejobnotice')" src="/static/integral2/发布作业.png" alt="">
                    <img @click="skip('issuenoticeinfo')" src="/static/integral2/发布通知.png" alt="">
                </div>
                <div class="remark">
                    <p>活动期间家长查看成绩、通知、作业等，教师累计可得150积分。</p>
                    注：活动期间内积分增幅最高前3名：得<span>500元</span>现金；第4~10名：得<span>200元</span>现金。
                    <p>奖品由咪师小助手在活动结束后5天内发放。若有疑问请添加咪师小助手（微信号：wsmsxzs）</p>
                    <p>活动结束后恢复原积分数值：发布成绩50积分，发布作业5积分，发布通知5积分。</p>
                </div>
            </section>
        </div>
</template>

<script>
//接口学校列表
import { activityBonusGetBonusRanking } from "@/api/api.js";
import { mapState, mapActions } from "vuex";

export default {
  inject: ["reload"],
  data() {
    return {
      rankData: [],
      mineObj: {},
      defaultImg: 'this.src="' + require('../../../../static/integral/default.jpg') + '"'
    };
  },
  computed: {
  
  },
  mounted() {
      this.getRank()
  },

  methods: {
    getRank() {
        activityBonusGetBonusRanking({}).then(res =>{
            console.log("ranking",res.data)
            if(res.data.code == 200 && res.data.data != null) {
                this.rankData = res.data.data.activityBonusList
                this.mineObj = res.data.data.activityBonus
            }
        })
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/Scss/publicTemplate/rank.scss";
</style>

