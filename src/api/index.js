import net from "../assets/js/public";

// export const getlistData = (param,data) => net.request("admin/order/queryListPage", "post", param, data)
// export const getOpaction = ({id}) => net.request("admin/order/queryOrderById", "post", {id})

// export const getRemarkData = ({id}) => net.request("admin/order/queryProductInfoList","post",{id})


export const getlistData = (param, data) => net.request('admin/order/queryListPage', 'post', param, data) // 获取完成工单列表

export const getRemarkData = ({id}) => net.request('admin/order/queryProductInfoList', 'post', {id}) // 获取备注

export const getCode = ({userPhone}) => net.request('admin/log/getSmsCode', 'post', {userPhone}) // 获取短信验证码

export const logIn = (params) => net.request('admin/log/webLogin', 'post', params) // 登录

export const getCheckout = (params) => net.request('admin/order/OperationMark', 'post', params) // 跳转到检测报告界面

export const getOperatingRecord = ({id}) => net.request('admin/order/queryOrderById', 'post', {id}) // 获取操作记录

export const frozenOrder = (params) => net.request('admin/abnormalOrder/frozenByUser', 'post', params) // 冻结工单

export const editDetectionOrder = (params) => net.request('admin/order/startPractice', 'post', params) // 编辑报告

// 获取 待检测工单 /待上传照片/ 待编辑报告 / 待审核报告 / 治疗单确认 / 待复查工单 / 完成工单列表
export const getDetectionOrderListData = (param, data) => net.request('admin/order/queryListPage', 'post', param, data)


