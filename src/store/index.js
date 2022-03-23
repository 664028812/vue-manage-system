import { createStore } from "vuex";
import { Login } from "../api/Captch";
export default createStore({
  state: {
    //在state中定义数据
    tagsList: [],
    collapse: false,
    userInfo: {
      uID: "",
      uLoginName: "",
      uRealName: "",
      uStatus: "",
      uRemark: "",
      name: "",
      sex: "",
      age: "",
      birth: "",
      addr: "",
    },
    token: "",
  },
  mutations: {
    //mutations是一个对象里。面的方法 都是同步事务，
    //是更改state初始状态的唯一合法方法，
    //具体的用法就是给里面的方法传入参数state或额外的参数
    delTagsItem(state, data) {
      state.tagsList.splice(data.index, 1);
    },
    setTagsItem(state, data) {
      state.tagsList.push(data);
    },
    clearTags(state) {
      state.tagsList = [];
    },
    closeTagsOther(state, data) {
      state.tagsList = data;
    },
    closeCurrentTag(state, data) {
      for (let i = 0, len = state.tagsList.length; i < len; i++) {
        const item = state.tagsList[i];
        if (item.path === data.$route.fullPath) {
          if (i < len - 1) {
            data.$router.push(state.tagsList[i + 1].path);
          } else if (i > 0) {
            data.$router.push(state.tagsList[i - 1].path);
          } else {
            data.$router.push("/");
          }
          state.tagsList.splice(i, 1);
          break;
        }
      }
    },
    // 侧边栏折叠
    handleCollapse(state, data) {
      state.collapse = data;
    },

    // 用户信息相关
    setUserInfo(state, userInfo) {
      // 这里的 `state` 对象是模块的局部状态
      state.userInfo = userInfo;
    },
    setToken(state, token) {
      // 这里的 `state` 对象是模块的局部状态
      state.token = token;
    },

    LoginOut(state) {
      state.token = "";
      sessionStorage.clear();
      router.push({ name: "Login", replace: true });
      window.location.reload();
    },
    ResetUserInfo(state, userInfo = {}) {
      state.userInfo = { ...state.userInfo, ...userInfo };
    },
  },
  actions: {
    //给action注册事件处理函数，当这个函数被触发时候，
    //将状态提交到mutations中处理。
    //actions里面自定义的函数接收一个context参数和要变化的形参
    async GetUserInfo({ commit }) {
      const res = await getUserInfo();
      if (res.code === 0) {
        commit("setUserInfo", res.data.userInfo);
      }
      return res;
    },
    async LoginIn({ commit, dispatch, rootGetters, getters }, loginInfo) {
      const res = await Login(loginInfo);
      if (res.code === 0) {
        commit("setUserInfo", res.data.UserInfo); //设置用户信息
        commit("setToken", res.data.token); //设置 token
        await dispatch("router/SetAsyncRouter", {}, { root: true });
        const asyncRouters = rootGetters["router/asyncRouters"];
        asyncRouters.forEach((asyncRouter) => {
          router.addRoute(asyncRouter);
        });
        // const redirect = router.history.current.query.redirect
        // console.log(redirect)
        // if (redirect) {
        //     router.push({ path: redirect })
        // } else {
        router.push({ name: getters["userInfo"].authority.defaultRouter });
        // }
        return true;
      }
    },
  },
  modules: {},
  getters: {
    //Getter相当于vue中的computed计算属性，
    //getter 的返回值会根据它的依赖被缓存起来，
    //且只有当它的依赖值发生了改变才会被重新计算，
    //Getters 可以用于监听、state中的值的变化，返回计算后的结果
    userInfo(state) {
      return state.userInfo;
    },
    token(state) {
      return state.token;
    },
  },
  //dispatch：含有异步操作，例如向后台提交数据，写法： this.$store.dispatch('action方法名',值)
  //commit：同步操作，写法：this.$store.commit('mutations方法名',值)
});
