import store from '../store/Store'
/**
 *权限控制方法
 *
 */
function hasAuthority() {
    //以后做权限表使用的.目前用不上
    // let Authority = store.state.AuthorityShow.Authority;
    
    // let userAuthority = store.state.AuthorityShow.userAuthority;

    if (store.state.controlShow.isHeadTeacher == 0) {
        //普通教师
        // console.log('普通教师')
        return false
    } else if (store.state.controlShow.isHeadTeacher == 1) {
        // console.log('班主任')
        return true
    }

    // return false

    // store.state.AuthorityShow.Authority.forEach(item => {
    //   console.log(item)
    // });
};

export default hasAuthority;
