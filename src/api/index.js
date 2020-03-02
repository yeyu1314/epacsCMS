import net from "../assets/js/public";

// export const getlistData = (param,data) => net.request("admin/order/queryListPage", "post", param, data)
// export const getOpaction = ({id}) => net.request("admin/order/queryOrderById", "post", {id})

// export const getRemarkData = ({id}) => net.request("admin/order/queryProductInfoList","post",{id})


export const getRemarkData = ({id}) => net.request('admin/order/queryProductInfoList', 'post', {id}) // 获取备注

export const getCode = ({userPhone}) => net.request('admin/log/getSmsCode', 'post', {userPhone}) // 获取短信验证码

export const logIn = (params) => net.request('admin/log/webLogin', 'post', params) // 登录

export const getCheckout = (params) => net.request('admin/order/OperationMark', 'post', params) // 跳转到检测报告界面

export const getOperatingRecord = ({id}) => net.request('admin/order/queryOrderById', 'post', {id}) // 获取操作记录

export const frozenOrder = (params) => net.request('admin/abnormalOrder/frozenByUser', 'post', params) // 冻结工单

export const recoverOrder = (params) => net.request('admin/abnormalOrder/renewByUser', 'post', params) // 恢复工单

export const cancellationOrder = (params) => net.request('admin/abnormalOrder/discardByUser', 'post', params) // 作废工单

export const editDetectionOrder = (params) => net.request('admin/order/startPractice', 'post', params) // 编辑报告

// 获取 待检测工单 /待上传照片/ 待编辑报告 / 待审核报告 / 治疗单确认 / 待复查工单 / 完成工单列表
export const getDetectionOrderListData = (param, data) => net.request('admin/order/queryListPage', 'post', param, data)

export const getFrozenOrder = (params, data) => net.request('admin/abnormalOrder/frozenPage', 'post', params, data) // 冻结工单列表

export const getDiscardOrder = (params, data) => net.request('admin/abnormalOrder/discardPage', 'post', params, data) // 废弃工单列表

export const getStartTesting = (params) => net.request('admin/order/startTesting', 'post', params) // 开始检测

export const getUploadImgBtnData = ({carId}) => net.request('admin/car/queryById', 'post', {carId}) // 获取 待上传照片 界面中 “上传检测照片” 按钮的该行的数据

export const getSelectData = (url,{orgId}) => net.request(url, 'post', {orgId}) // 获取 拆装工程师  检测工程师   跟单员

export const getProductData = () => net.request('admin/product/selectProductList', 'post', {}) // 获取产品信息

export const getSearchProductData = (jobId) => net.request('admin/order/queryProductInfoList', 'post', jobId) // 查询产品用量

export const saveProductData = (params,data) => net.request('admin/order/writeProductInfo', 'post', params, data) // 保存产品用量

export const startEnsureOrder = (params) => net.request('admin/order/confirmedTreatment', 'post', params) // 确认治疗

export const stopEnsureOrder = (params) => net.request('admin/order/noTreatment', 'post', params) // 不治疗

export const getFirstReportEdir = (params) => net.request('admin/car/queryById', 'post', params) // 待编辑报告 编辑报告 按钮
