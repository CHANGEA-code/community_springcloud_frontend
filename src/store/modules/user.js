import { getUserInfo, login, logout } from "@/api/auth/auth";
import { getToken, setToken, removeToken } from "@/utils/auth";

const state = {
    token: getToken(), // token
    user: "", // 用户对象
};

const mutations = {
    SET_TOKEN_STATE: (state, token) => {
        state.token = token;
    },
    SET_USER_STATE: (state, user) => {
        state.user = user;
    },
};

const actions = {
    // 用户登录
    login({ commit }, userInfo) {
        const { username, password, rememberMe } = userInfo;
        return new Promise((resolve, reject) => {
            login({ userName: username.trim(), password: password, rememberMe: rememberMe })
                .then((response) => {
                    console.log("res")
                    const { data } = response;
                    console.log(data.user)
                    setToken(data.token);
                    //信息放到store状态管理中
                    commit("SET_TOKEN_STATE", data.token);
                    resolve();
                })
                .catch((error) => {
                    console.log("err")
                    reject(error);
                });
        });
    },
    // 获取用户信息
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getUserInfo()
                .then((response) => {
                    const { data } = response;
                    if (!data) {
                        commit("SET_TOKEN_STATE", "");
                        commit("SET_USER_STATE", "");
                        removeToken();
                        resolve();
                        reject("Verification failed, please Login again.");
                    }
                    commit("SET_USER_STATE", data.user);
                    console.log("getInfo");
                    console.log(data);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    // 注销
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then((response) => {
                    console.log(response);
                    commit("SET_TOKEN_STATE", "");
                    commit("SET_USER_STATE", "");
                    removeToken();
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};