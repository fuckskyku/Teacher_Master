//数据
const AuthorityShow = {
    state: {
        Authority: [
            "teacher:audit:menu",   // 审批管理	      
            "teacher:audit:info",   // 查看	          
            "teacher:audit:audit",   // 审批	          
            "teacher:carbonCopy:menu",   // 抄送我的管理	  
            "teacher:carbonCopy:info",   // 查看	          
            "teacher:homework:menu",   // 发布作业管理	  
            "teacher:homework:info",   // 查看              
            "teacher:homework:delete",   // 删除	          
            "teacher:homework:create",   // 发布作业          
            "teacher:notice:menu",   // 发布通知管理	  
            "teacher:notice:info",   // 查看              
            "teacher:notice:delete",   // 删除	          
            "teacher:notice:create",   // 发布通知          
            "teacher:new:menu",   // 发布新闻风采管理  
            "teacher:new:info",   // 查看	          
            "teacher:new:delete",   // 删除	          
            "teacher:new:create",   // 发布新闻风采	  
            "teacher:baseSetting:menu",   // 基础设置	      
            "teacher:classHomework:menu",   // 班级作业管理	  
            "teacher:classHomework:info",   // 查看              
            "teacher:classAttendance:menu",   // 班级考勤管理      
            "teacher:classAttendance:info",   // 查看              
            "teacher:classNotice:menu",   // 班级通知管理	  
            "teacher:classNotice:info",   // 查看              
            "teacher:classTeacherSj:menu",   // 班级教师科目管理  
            "teacher:classTeacherSj:update",   // 编辑              
            "teacher:classTeacherSj:create",   // 新增	          
            "teacher:classTeacherSj:delete",   // 删除	          
            "teacher:classStudent:menu",   // 班级学生管理	  
            "teacher:classStudent:update",   // 编辑	          
            "teacher:classStudent:create",   // 新增	          
            "teacher:classStudent:delete",   // 删除              
            "teacher:classStudent:info",   // 查看	          
            "teacher:classStudent:import",   // 导入	          
            "teacher:classParent:menu",   // 班级家长管理	  
            "teacher:classParent:update",   // 编辑	          
            "teacher:classParent:delete",   // 删除	          
            "teacher:classParent:smsNotice",   // 通知激活	      
        ],
        userAuthority: window.localStorage.getItem('login_userInfo') ? JSON.stringify(JSON.parse(window.localStorage.getItem('login_userInfo')).permissions) : null
    },

}

export default AuthorityShow