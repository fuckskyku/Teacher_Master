/*
 * File: crumbs.js
 * Project: teacher
 * File Created: Thursday, 1st November 2018 11:45:15 am
 * Author: LGH (you@you.you)
 * -----
 * Last Modified: Monday, 5th November 2018 10:52:25 am
 * Modified By: LGH (you@you.you>)
 * -----
 * Copyright 2017 - 2018 Your Company, Your Company
 */

//配置面包屑导航持久化
//数据
const crumbs = {
    state: {
        crumbsList:[]
    },
    //提交方法
    mutations: {
        CrumbsList(state, change) {
            state.crumbsList = change;
        }
    },

    actions: {
        setCrumbsList(state, change) {
            state.commit("CrumbsList", change)
        },
    }
}
export default crumbs



