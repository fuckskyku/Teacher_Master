<template>
  <div id="integralDetail">
    <!-- 头部 -->
    <div class="header">
      <div class="header_left">
        <img src="/static/img/积分icon.png" alt>
        <div class="number">
          {{bonusPoint}}
          <span>积分</span>
        </div>
        <el-button type="text" class="rule" @click="dialogVisibleRule=true">积分规则</el-button>
        <el-button type="text" class="rule" @click="$router.push('signatureDetails')">签到记录</el-button>
      </div>
      <div class="header_right">
        <el-button type="primary" round class="exchange" @click="next()">兑换话费</el-button>
      </div>
    </div>

    <el-tabs v-model="activeName" class="tabs">
      <!-- <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick"> -->
      <el-tab-pane name="recordOfConversion" class="tabsOne">
        <span slot="label">
          <i class="el-icon-date"></i> 积分详情
        </span>
        <el-table
          :data="tableData.data"
          style="width: 100%"
          height="520px"
          :header-cell-style="{textAlign:'center'}"
          :cell-style="{textAlign:'center'}"
        >
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column prop="changeName" label="项目"></el-table-column>
          <el-table-column label="日期">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span
                style="margin-left: 10px"
              >{{ new Date(scope.row.createTime).format('yyyy-MM-dd hh:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="receiveBonusPoint" label="所得积分"></el-table-column>
        </el-table>
        <pageHtml :tabObj.sync="tableData" name="BonusPoint"></pageHtml>
      </el-tab-pane>

      <el-tab-pane name="IntegralDetails" class="tabsTwo">
        <span slot="label">
          <i class="el-icon-date"></i> 兑换记录
        </span>
        <el-table
          :data="tableDataTwo.data"
          style="width: 100%"
          height="520px"
          :header-cell-style="{textAlign:'center'}"
          :cell-style="{textAlign:'center'}"
        >
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column prop="exchangeName" label="兑换商品"></el-table-column>
          <el-table-column label="日期">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span
                style="margin-left: 10px"
              >{{ new Date(scope.row.createTime).format('yyyy-MM-dd hh:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <div>{{scope.row.extStatus==1?'成功':'失败'}}</div>
            </template>
          </el-table-column>
        </el-table>
        <pageHtml :tabObj.sync="tableDataTwo" name="'getBonusPointEx'"></pageHtml>
      </el-tab-pane>
    </el-tabs>
    <!-- 积分规则模态框 -->
    <el-dialog
      :visible.sync="dialogVisibleRule"
      :before-close="handleClose"
      class="reviseRule"
      :fullscreen="false"
      center
      :inline-message="true"
      status-icon
      width="30%"
    >
      <div slot="title" class="reviseRuleTitle">
        <div class="peg"></div>
        <div class="text">积分规则</div>
      </div>
      <div class="reviseContent">
        <div>1、用户在APP端或者教师版后台完善自己的信息得10积分;</div>
        <div>
          2、用户在APP端或者教师版后台
          <span style="color:rgb(192,180,131);font-weight:600">发布作业、发布通知、发布新闻风采、发布班级圈</span>各得对应积分;
        </div>
        <div>3、签到规则：连续签到第1-7天每天得5积分，连续签到第8-14天每天得6积分，连续签到第15-21天每天得8积分，连续签到第22-28天每天得13积分，第7/14/21/28天用户可以额外获得奖励积分，连续签到天数越多所获得的积分越多。以28天为一个周期循环。</div>
        <div>
          <span style="font-weight:600;">兑换规则：</span>10积分=1元，积分可以兑换话费(10积分=1元,积分可以兑换话费，给他人兑换话费需要双倍积分)
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRule=false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 积分规则模态框结束-->

    <!-- 兑换话费首先输入被充值的手机号码 -->
    <el-dialog
      :visible.sync="dialogVisiblMobileAndMobile"
      :before-close="handleClose"
      class="reviseMobileAndPw"
      :fullscreen="false"
      center
      :inline-message="true"
      top="20vh"
      status-icon
      width="30%"
    >
      <div slot="title" class="reviseTitle">请输入需要充值的手机号码</div>
      <div class="reviseContent">
        <div class="input_item">
          <span>充值手机：</span>
          <el-input v-model="mobile" placeholder="请输入需要充值的手机号码"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblMobileAndMobile=false;mobile=''">取 消</el-button>
        <el-button type="primary" @click="pay()">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 兑换话费模态框 -->
    <el-dialog
      :visible.sync="dialogVisiblExchange"
      :before-close="handleClose"
      class="reviseExchange"
      :fullscreen="false"
      center
      :inline-message="true"
      status-icon
      width="30%"
    >
      <div slot="title" class="reviseTitle">
        可兑换积分
        <span>{{bonusPoint}}</span>分
      </div>
      <div class="reviseContent" v-show="integral500">
        <!-- <img :src='{{this.dialogVisiblExchangeFlag?'/static/img/50元话费.png':'/static/img/50元话费.png'}}' alt=""> -->
        <img :src="ExchangeImgSrc" alt>
      </div>
      <div class="reviseContent" v-show="integral1000">
        <img :src="ExchangeImgSrc1000" alt>
      </div>
      <div
        style="color:red;font-size:14px;padding-top:16px;text-align:center;"
        v-show="notice"
      >您是为其他号码充值,需要使用双倍积分哟</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblExchange=false;mobile=''">取 消</el-button>
        <el-button type="primary" @click="exchangeGo()">确认兑换</el-button>
      </span>
    </el-dialog>
    <!-- 兑换话费模态框结束-->

    <!-- 输入密码模态框 -->
    <el-dialog
      :visible.sync="dialogVisiblMobileAndPw"
      :before-close="handleClose"
      class="reviseMobileAndPw"
      :fullscreen="false"
      center
      :inline-message="true"
      top="20vh"
      status-icon
      width="30%"
    >
      <div slot="title" class="reviseTitle">请输入您的登录密码</div>
      <div class="reviseContent">
        <div class="input_item">
          <span>登录密码：</span>
          <el-input v-model="pw" type="password" placeholder="请输入登录密码"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblMobileAndPw=false">取 消</el-button>
        <el-button type="primary" @click="stepGo()">充值</el-button>
      </span>
    </el-dialog>
    <!-- 输入密码模态框结束 -->

    <!-- 兑换成功模态框 -->
    <el-dialog
      :visible.sync="dialogVisiblOK"
      :before-close="handleClose"
      class="reviseOK"
      :fullscreen="false"
      center
      :inline-message="true"
      status-icon
      width="30%"
    >
      <div class="reviseContent">
        <img src="/static/img/兑换成功.png" alt>
        <div class="text">恭喜你话费已兑换成功，请注意查收</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblOK=false">关闭</el-button>
        <!-- <el-button type="primary">确定</el-button> -->
      </span>
    </el-dialog>
    <!-- 兑换成功模态框结束-->
  </div>
</template>

<script>
import {
  userInfo,
  BonusPoint, //签到记录接口
  pointenough, //积分明细  --- 兑换积分是否充足
  ExchangeType, //积分明细  ---查看用户可兑换积分类型
  getBonusPointEx, //兑换记录
  getSignInPoints,
  sendRequest //兑换话费接口
} from "@/api/api.js";
export default {
  data() {
    return {
      databaseMobile: "", //数据库中本人的手机号码
      activeName: "recordOfConversion", //Tab表格切换
      tableData: [], //积分明细表格数据
      tableDataTwo: [], //兑换记录表格数据
      integral: "", //积分对象
      dialogVisibleRule: false,
      dialogVisiblExchange: false,
      ExchangeImgSrc: "/static/img/50元话费.png",
      ExchangeImgSrc1000: "/static/img/50元话费1000积分.png",
      integral500: false,
      integral1000: false,
      dialogVisiblMobileAndPw: false,
      dialogVisiblMobileAndMobile: false,
      dialogVisiblOK: false,
      notice: false,
      mobile: "", //被充值的手机号码
      pw: "", //兑换话费输入的登录密码
      step: 1, //兑换话费步骤
      bonusPoint: ""
    };
  },
  created() {
    if(this.$route.query.isShow != undefined) {
      this.dialogVisiblMobileAndMobile = true
    }
    getSignInPoints().then(res => {
      console.log(res.data.data);
      this.bonusPoint = res.data.data.bonusPoint;
    });
    BonusPoint().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.tableData = res.data.data;
      }
    });
    getBonusPointEx().then(res => {
      if (res.data.code == 200) {
        console.log(res.data.data);
        this.tableDataTwo = res.data.data;
      }
    });
  },

  methods: {
    //关闭模态框
    handleClose(done) {
      done();
    },
    // handleClick(tab,event){
    //     if(tab.name=='recordOfConversion'){
    //       BonusPoint().then(res => {
    //             if (res.data.code == 200) {
    //               console.log(res.data.data);
    //               this.tableData = res.data.data;
    //             }
    //           });
    //     }else{
    //     getBonusPointEx().then(res => {
    //           if (res.data.code == 200) {
    //             console.log(res.data.data);
    //             this.tableDataTwo = res.data.data;
    //           }
    //         });
    //     }
    //     console.log(tab,event);
    // },
    //兑换话费  --- 第一步  获取本人电话号码
    next() {
      this.databaseMobile = this.getLocalStorage("login_userInfo").mobile;
      this.dialogVisiblMobileAndMobile = true;
    },
    //兑换话费  ----第二步  输入被充值的手机号码并判断是否为本人手机号码
    pay() {
      if (this.mobile != "") {
        if (
          this.mobile.match(
            /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
          )
        ) {
          if (this.mobile == this.databaseMobile) {
            //本人给本人充值
            this.dialogVisiblExchange = true;
            this.dialogVisiblMobileAndMobile = false;
            this.integral1000 = false;
            this.integral500 = true;
            this.notice = false;
          } else {
            //本人给他人充值  显示一条notice
            this.dialogVisiblExchange = true;
            this.dialogVisiblMobileAndMobile = false;
            this.integral1000 = true;
            this.integral500 = false;
            this.notice = true;
          }
        } else {
          this.$message({
            message: "请输入正确的手机号码",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "手机号码不能为空",
          type: "warning"
        });
      }
    },
    //兑换话费  ----第三步  判断积分是否充足
    exchangeGo() {
      pointenough({ mobile: this.mobile }).then(res => {
        if (res.data.code == 200) {
          this.dialogVisiblMobileAndPw = true;
          this.dialogVisiblExchange = false;
        } else {
          this.$message({
            message: res.data.message,
            type: "warning"
          });
        }
      });
    },
    //兑换话费  ----最后一步  输入登陆密码然后判断密码是否正确以及充值是否成功
    stepGo() {
      if (this.pw !== "") {
        sendRequest({
          exchangeType: 2,
          mobile: this.mobile,
          password: this.pw
        }).then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              message: "充值成功",
              type: "success"
            });
            this.dialogVisiblOK = true;
            this.dialogVisiblExchange = false;
            this.dialogVisiblMobileAndPw = false;
            this.dialogVisiblMobileAndMobile = false;
          } else {
            this.$message({
              message: res.data.message,
              type: "warning"
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../../../assets/Scss/publicTemplate/UserInfoAndWeater.scss";
</style>
