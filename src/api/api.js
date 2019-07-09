import req from './apiSetting'



//检查是否可以签到
export const SingInIsSign  = param =>{return req.post('/singIn/isSign',param)}

//数据字典
export const commonDictList = param => { return req.post('/commonDict/list', param) }

//更改导入步骤状态
export const teacherUpdateGuideStep = param => { return req.post('/teacher/updateGuideStep', param) }

// 验证手机号码是否已激活
export const isStatus = param => { return req.post('/isStatus', param) }
//帐号登录
export const login = param => { return req.post('/login', param) }
//忘记密码
export const forgetPwd = param => { return req.post('/user/forgetPwd', param); }
//获取图形验证码
export const captcha = param => { return req.get('/captcha', param) }

//图形验证码验证(发送短信验证码（无token验证）)
export const sendNoTokenSms = param => { return req.post('/sms/sendNoTokenSms', param); }

//忘记密码短信验证码(无token验证)
export const userForgetVerify = param => { return req.post('/user/userForgetVerify', param); }

//账户激活（包括短信验证码，密码）
export const userActive = param => { return req.post('/user/userActive', param); }

//第一次登入的积分
export const bonusPointLogSignIn = param => { return req.post('/bonusPointLog/signIn', param); }

//首页班级信息
export const gradeClassInfo = param => { return req.post('/gradeClass/gradeClassInfo', param); }

//获取学校列表
export const teacherSchools = param => { return req.post('/teacherSchools', param) }

//切换学校
export const switchSchool = param => { return req.post('/switchSchool', param); }

//获取所有教师
export const teacherList = param => { return req.post('/teacher/list', param); }

//获取所有科目
export const subjectList = param => { return req.post('/subject/list', param); }

//导入步骤已经存在的信息
export const existclassSubjectList = param => { return req.post('/classSubject/classSubjectList', param) }

//存储导入科目以及设置任课老师
export const classSubjectSave = param => { return req.postJson('/classSubject/save', param); }

//删除已经导入的科目老师
export const classSubjectdelete = param => { return req.post('/classSubject/delete', param); }


//获取未激活人数
export const teacherAdmin = param => { return req.post('/user/userCount', param) }

//查询天气
export const weatherInfo = param => { return req.post('/weather/weatherInfo', param) }

//家长未激活 已发短信通知数量与未发送短信通知的数量
export const checkParentActive = param => { return req.get('/parent/checkParentActive', param) }

//检查是否有未审批的数据(点我试试）
export const checkApproval = param => { return req.post('/approval/checkApproval', param) }


//个人信息
export const userInfo = param => { return req.post('/user/userInfo', param); }
//修改个人信息
export const updateInfo = param => { return req.post('/user/updateInfo', param); }

//修改手机号码
export const modifyMobile = param => { return req.post('/user/modifyMobile', param); }

//发送手机验证码
export const sendSms = param => { return req.post('/sms/sendSms', param); }

//积分明细
export const getSignInPoints = param => { return req.post('/singIn/getSignInPoints', param); }

//签到记录列表
export const BonusPoint = param => { return req.post('/bonusPointLog/getBonusPoint', param); }

//兑换记录接口
export const getBonusPointEx = param => { return req.post('/bonusPointExLog/getBonusPointEx', param); }

//积分明细  --- 兑换积分是否充足
export const pointenough = param => { return req.post('/bonusPointExLog/checkBonusPoint', param); }
//积分明细  ---查看用户可兑换积分类型
export const ExchangeType = param => { return req.post('/bonusPointExLog/checkChangeType', param); }

//积分明细  --- 充值话费(有参数)
export const sendRequest = param => { return req.post('/bonusPointExLog/pointToTelephoneFee', param); }

//表格数据模块
//班级通知
export const classNotice = param => { return req.post('/schoolNotice/classNotice', param) }

//班级考勤
export const classPage = param => { return req.post('/classAttendanceLog/page', param) }

//班级考勤导出
export const classAttendanceLogClassAttendanceExportData = param => { return req.get('/classAttendanceLog/classAttendanceExportData', param) }

//班级考勤详情
export const ClassAttendanceLogPage = param => { return req.post('/studentClassAttendanceLog/page', param) }

//班级作业
export const classHomework = param => { return req.post('/homework/classHomework', param) }

//发布作业所需要的树结构数据
export const gradeClassClassGradeTree = param => { return req.post('/gradeClass/classGradeTree', param) }


//教师科目列表管理
export const teacherObjListData = param => { return req.post('/teacher/pageList', param) }

//教师科目更改接口
export const classSubjectupdate = param => { return req.post('/classSubject/update', param) }

//班级学生管理
export const studentPageList = param => { return req.post("/student/pageList", param) }

//查看学生
export const studentLookForm = param => { return req.get('/student/from', param) }
//学生删除
export const studentDelete = param => { return req.post('/student/delete', param) }
//学生新增
export const studentAdd = param => { return req.post('/student/add', param) }

//学生修改
export const studentUpdate = param => { return req.post('/student/update', param) }


//学生家长数据
export const parentPageList = param => { return req.get('/parent/pageList', param) }
//修改家长数据
export const parentUpdate = param => { return req.post('/parent/update', param) }
//删除家长
export const parentDelete = param => { return req.postJson('/parent/delete', param) }
//通知激活单个家长
export const parentsendParentActivateNotice = param => { return req.get('/parent/sendParentActivateNotice', param) }
//批量激活家长
export const parentsendBatchParentActivateNoticet = param => { return req.get('/parent/sendBatchParentActivateNotice', param) }
//点击不再通知
export const parentNoRemind = param => { return req.post('/parent/noRemind', param) }


//审批与发布模块
//审批列表
export const approvalApprovalList = param => { return req.post('/approval/approvalList', param) }

//审批接口单个
export const approvalAudit = param => { return req.post('/approval/auditStatus', param) }

//继续审批
export const approvalGetOneApproval = param => { return req.post('/approval/getOneApproval', param) }

//抄送我的列表
export const schoolNewsCopyList = param => { return req.post('/schoolNews/copyList', param) }
//抄送我的是否有未读
export const schoolNewsNoReadCopyList = param => { return req.post('/schoolNews/noReadCopyList', param) }

export const schoolNewsNoReadCopyInfo = param => { return req.post('/schoolNews/noReadCopyInfo', param) }
//抄送我的阅读状态更改该
export const schoolNewsChangeCopyRead = param => { return req.post('/schoolNews/changeCopyRead', param) }
//是否发送成绩
export const SendScoreCheckSendScore = param => {return req.post('/SendScore/checkSendScore',param)}


//发布作业列表
export const homeworkList = param => { return req.post('/homework/list', param) }

//发布作业                       ----(点我试试)
export const assignHomework = param => { return req.post('/teacher/teacherHomework', param) }
//编辑作业调用的查看接口
export const homeworkInfo = param => { return req.post('/homework/info', param) }
//发布作业
export const homeworkSave = param => { return req.post('/homework/save', param) }
//删除作业
export const homeworkDelete = param => { return req.post('/homework/delete', param) }


//获取年级班级列表
export const gradeClassAllGradeClass = param => { return req.post('/gradeClass/allGradeClass', param) }

//通知列表
export const schoolNoticePage = param => { return req.post('/schoolNotice/page', param) }
//通知，校园风采删除公用
export const schoolNewsDelete = param => { return req.post('/schoolNews/delete', param) }

//发布通知
export const schoolNoticeSave = param => { return req.post('/schoolNotice/save', param) }
//新闻风采列表
export const schoolNewsPage = param => { return req.post('/schoolNews/page', param) }

//发布通知
export const schoolNewsSave = param => { return req.post('/schoolNews/save', param) }

//通知，风采草稿箱继续编辑
export const schoolNewsNewsInfo = param => { return req.post('/schoolNews/newsInfo', param) }

//教师组织架构
export const departmentDepartmentUsersTree = param => { return req.post('/department/departmentUsersTree', param) }

//获得默认审批人以及抄送人
export const approvalCopySettingGetApprovalCopy = param => { return req.post('/approvalCopySetting/getApprovalCopy', param) }



//查询服务器时间
export const currentTime = param => { return req.post('/weather/currentTime', param) }



//日历列表
export const kalendarWatch = param => { return req.post('/singIn/getSignInByMonth', param) }



//成绩管理模块
//导入成绩下拉列表
export const schoolTermSchoolTermInList = param => { return req.post('/schoolTerm/schoolTermInList', param) }

export const schoolTermSchoolTermList = param => { return req.post('/schoolTerm/schoolTermList', param) }
//考试类型下拉列表
export const examTypeExamTypeList = param => { return req.post('/examType/examTypeList', param) }

//考试类型列表
export const examTypeExamTypePage = param => { return req.post('/examType/examTypePage', param) }

//删除考试类型
export const examTypeDelete = param => { return req.post('/examType/delete', param) }

//保存、修改考试类型
export const examTypeSave = param => { return req.post('/examType/save', param) }

//学业成绩列表
export const teacherTeacherScoreList = param => { return req.post('/teacher/teacherScoreList', param) }

//学业成绩删除
export const classScoreStatisClassScoreDelete = param => { return req.post('/classScoreStatis/classScoreDelete', param) }

//班级总人数
export const teacherGetStudentCount = param => { return req.post('/teacher/getStudentCount', param) }

//成绩管理列表
export const classScoreStatisPage = param => { return req.post('/classScoreStatis/page', param) }

//成绩分科管理      (MarkList页面渲染 列表)
export const classStudentSubjectScoreClassSubjectScoreList = param => { return req.post('/classStudentSubjectScore/classSubjectScoreList', param) }

//成绩分科管理删除
export const classStudentSubjectScoreSubjectScoreDelete = param => { return req.post('/classStudentSubjectScore/subjectScoreDelete', param) }

//学生成绩分析
export const classSubjectScoreStageStatisClassSubjectScoreList = param => { return req.post('/classSubjectScoreStageStatis/classSubjectScoreList', param) }
export const classSubjectScoreStageStatisGetSubjectScore = param => { return req.post('/classSubjectScoreStageStatis/getSubjectScore', param) }

//班级科目成绩列表
export const classStudentSubjectScoreClassStudentSubjectScoreList = param => { return req.post('/classStudentSubjectScore/classStudentSubjectScoreList', param) };

//修改班级科目成绩
export const classStudentSubjectScoreUpdateScore = param => { return req.post('/classStudentSubjectScore/updateScore', param) }

//学生历史成绩
export const classStudentSubjectScoreStudentHistoryScoreList = param => { return req.post('/classStudentSubjectScore/studentHistoryScoreList', param) }

//科目成绩导出
export const studentScoreExportExportStudentSubjectScoreExportData = param => { return req.get('/studentScoreExport/exportStudentSubjectScoreExportData', param) }

//总成绩排名
export const classStudentScoreStatisStudentScoreRanking = param => { return req.post('/classStudentScoreStatis/studentScoreRanking', param) };
//成绩管理--删除
export const DeleteClassScore = param => { return req.post('/classScoreStatis/classScoreDelete', param) };

//总成绩列表评价学生
export const classStudentScoreStatisEvaluateStudent = param => { return req.post('/classStudentScoreStatis/evaluateStudent', param) };

//学生总排名成绩导出
export const studentScoreExportExportStudentScoreRankingExportData = param => { return req.get('/studentScoreExport/exportStudentScoreRankingExportData', param) };

//学生历史成绩导出
export const studentScoreExportExportStudentHistoryScoreExportData = param => { return req.get('/studentScoreExport/exportStudentHistoryScoreExportData', param) };

//成绩分析接口、各个阶段分数人数列表
// export const classSubjectScoreStageStatisClassSubjectScoreList = param => { return req.post('/classSubjectScoreStageStatis/classSubjectScoreList', param) };
//统计
// export const classSubjectScoreStageStatisGetSubjectScore = param => { return req.post('/classSubjectScoreStageStatis/getSubjectScore', param) };

//获取总成绩学生评价
export const classStudentScoreStatisGetEvaluateContent = param => { return req.post('/classStudentScoreStatis/getEvaluateContent', param) };

//查看通知树形结构
export const departmentNotifyDepartmentUsers = param =>{return req.post('/department/notifyDepartmentUsers',param)}
//家长的
export const notifyDetailNotifyUser = param =>{return req.post('/notifyDetail/notifyUser',param)}
//家长信息
export const ParentForm = param=>{return req.get('/parent/form',param)}
//查看会签图片
export const notifyDetailGetSingDetail = param =>{return req.post('/notifyDetail/getSingDetail',param)}


//发送通知班级
//获取班级科目列表
export const classSubjectClassSubjectListByClassId = param => { return req.post('/classSubject/classSubjectListByClassId', param) }

export const classStudentSubjectScoreSubjectListByTermAndExamTypeOnClassId = param =>{return req.post('/classStudentSubjectScore/subjectListByTermAndExamTypeOnClassId',param)}

//发送通知家长
export const classStudentSubjectScoreSendScore = param => { return req.postJson('/classStudentSubjectScore/sendScore', param) }

export const classStudentSubjectScoreSendScoreByQuartzTime = param =>{return req.postJson('/classStudentSubjectScore/sendScoreByQuartzTime',param)}

//主科目查询
export const gradeMainSubjectSetingClassSubjectList = param => { return req.post('/gradeMainSubjectSeting/classSubjectList', param) };

//设置主科目
export const gradeMainSubjectSetingSave = param => { return req.post('/gradeMainSubjectSeting/save', param) };

//科目成绩评价学生
export const classStudentSubjectScoreEvaluateStudent = param => { return req.post('/classStudentSubjectScore/evaluateStudent', param) };

//获取单科目学生评价
export const classStudentSubjectScoreGetEvaluateContent = param => { return req.post('/classStudentSubjectScore/getEvaluateContent', param) };


//意见反馈
export const FeebackSave = param => {return req.post('/feeback/save',param)}


//红包滚动
export const SendWxRedPacketGetReceiveRedPacket = param =>{return req.post('/sendWxRedPacket/getReceiveRedPacket',param)}

//红包操作统计
export const ClickLogSave = param =>{return req.post('/clickLog/save ',param)}

//点击红包领取
export const SendWxRedPacketSendRedPacket = param =>{return req.post('/sendWxRedPacket/sendRedPacket',param)}

//弹窗广告
export const SendWxRedPacketGetPopupAd = param =>{return req.post('/sendWxRedPacket/getPopupAd',param)}

//悬浮窗广告    
export const SendWxRedPacketSendRedPacketTime = param =>{return req.post('/sendWxRedPacket/sendRedPacketTime',param)}

//5月教师积分活动
export const activityBonusGetBonusRanking = param =>{return req.post('/activityBonus/getBonusRanking',param)}

//弹窗控制接口
export const adGetPopupAd = param =>{return req.post('/ad/getPopupAd',param)}
