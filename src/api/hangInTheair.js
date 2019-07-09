import {
  checkParentActive,
  checkApproval,
  schoolNewsNoReadCopyList,
  assignHomework,
  SendScoreCheckSendScore
} from "./api";

/**
 *
 * @param {*} number 参数 12345分别代表点我试试模块的模态框顺序
 * @param {*} obj.number  代表各个模态框所显示的未处理事件数量
 * @param {*} obj.type     代表当前模态框的序号
 * @param {*} obj.message  模态框4所需要的页面渲染数据(所呈现信息)
 */

export default //因为里面执行的是异步方法所以使用Promise对象
async function dogin(number) {
  let obj = {};
  if (number == 0) {
    return await SendScoreCheckSendScore().then(res => {
      if (res.data.code == 200) {
        console.log(res);
        if (res.data.data == 0) {
          //   obj.number = res.data.data.noActivateCount;
          obj.buttonName = "发布成绩";
          obj.type = 0;
          return obj;
        } else {
          return new Promise((resolve, reject) => {
            resolve(dogin(1));
          });
        }
      }
    });
  } else if (number == 1) {
    return await checkParentActive().then(res => {
      if (res.data.code == 200) {
        if (res.data.data.noActivateCount == 0) {
          return new Promise((resolve, reject) => {
            resolve(dogin(2));
          });
        } else {
          obj.number = res.data.data.noActivateCount;
          obj.buttonName = "一键通知激活";
          obj.type = 1;
          return obj;
        }
      }
    });
  } else if (number == 2) {
    return await checkApproval().then(res => {
      if (res.data.code == 200) {
        if (res.data.data == 0) {
          return new Promise((resolve, reject) => {
            resolve(dogin(3));
          });
        } else {
          obj.number = res.data.data;
          obj.buttonName = "马上审批";
          obj.type = 2;
          return obj;
        }
      }
    });
  } else if (number == 3) {
    return await schoolNewsNoReadCopyList().then(res => {
      console.log(res);
      if (res.data.code == 200) {
        if (res.data.data == 0) {
          return new Promise((resolve, reject) => {
            resolve(dogin(4));
          });
        } else {
          obj.number = res.data.data;
          obj.buttonName = "马上阅读";
          obj.type = 3;
          return obj;
        }
      }
    });
  } else if (number == 4) {
    return await assignHomework({
      editStatus: 2
    }).then(res => {
      if ((res.data.code = 200)) {
        if (res.data.data !== "") {
          return new Promise((resolve, reject) => {
            resolve(dogin(5));
          });
        } else {
          obj.buttonName = "马上发布";
          obj.message = res.data.message;
          obj.type = 4;
          return obj;
        }
      }
    });
  } else if (number == 5) {
    obj.type = 5;
    return obj;
  }
}
