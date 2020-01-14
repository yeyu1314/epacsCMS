/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-11-29 09:29:49 
 * @Last Modified by: caohenghui
 * @Last Modified time: 2018-11-29 09:30:19
 */

import Vue from 'vue';
import Vuex from 'vuex';
import state from './rootState.js';
Vue.use(Vuex);
const store = new  Vuex.Store({
    state
})
export default store;