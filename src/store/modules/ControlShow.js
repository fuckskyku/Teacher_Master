//数据
const controlShow = {

    state: {
        //控制导入显示(1,2,3) 1第一步，2第二步，3完成
        leading_in: 1,

        //控制头部导航显示还想影藏(0,1,2) 
        headerNav: 1,

        //控制首页显示标题还是面包屑(0,1)
        classShow: 1,
        
        //控制教师是否是班主任
        isHeadTeacher: 0,
    },

    //提交方法
    mutations: {
        leading_in(state, change) {
            state.leading_in = change;
        },
        headerNav(state, change) {
            state.headerNav = change;
        },
        classShow(state, change) {
            state.classShow = change;
        },
        isHeadTeacher(state, change) {
            state.isHeadTeacher = change;
        }
    },
    
    actions: {
        setleading_in(state, change) {
            state.commit("leading_in", change)
        },
        setheaderNav(state, change) {
            state.commit("headerNav", change)
        },
        setclassShow(state, change) {
            state.commit("classShow", change)
        },
        setisHeadTeacher(state, change) {
            state.commit("isHeadTeacher", change)
        }
    }
}

export default controlShow