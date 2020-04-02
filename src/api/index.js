import net from "../assets/js/public";
import da from "element-ui/src/locale/lang/da";

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
export const getUploadImgBtnPhotoData = ({params}) => net.request('admin/car/queryCarTestingPhoto', 'post', params) // 获取 待上传照片 界面中 “编辑检测照片” 按钮的该行的照片数据

export const getSelectData = (url,{orgId}) => net.request(url, 'post', {orgId}) // 获取 拆装工程师  检测工程师   跟单员

export const getProductData = () => net.request('admin/product/selectProductList', 'post', {}) // 获取产品信息

export const getSearchProductData = (jobId) => net.request('admin/order/queryProductInfoList', 'post', jobId) // 查询产品用量

export const saveProductData = (params,data) => net.request('admin/order/writeProductInfo', 'post', params, data) // 保存产品用量

export const startEnsureOrder = (params) => net.request('admin/order/confirmedTreatment', 'post', params) // 确认治疗

export const stopEnsureOrder = (params) => net.request('admin/order/noTreatment', 'post', params) // 不治疗

export const getFirstReportEdir = (params) => net.request('admin/car/queryById', 'post', params) // 待编辑报告 编辑报告 按钮

export const startTeaet = (params) => net.request('admin/order/reExamination', 'post', params) // 开始复查

export const submitDimensionality = (params) => net.request('/admin/order/editJobValue', 'post', params) //待编辑报告,待审核界面  保存综合维度

export const queryByIdFirstReport = (params) => net.request('admin/car/queryById', 'post', params) //待编辑报告 获取车辆信息
export const getArea = () => net.request('admin/select/getArea', 'post') //待编辑报告  获取 区
export const getProvince = (params) => net.request('admin/select/getProvince', 'post', params) //待编辑报告  获取 省系
export const getCity = (params) => net.request('admin/select/getCity', 'post', params) //待编辑报告  获取 市县
export const getCarBrand = () => net.request('admin/select/getCarBrand', 'post') //待编辑报告  获取 汽车品牌
export const getCarFactory = (params) => net.request('admin/select/getCarFactory', 'post', params) //待编辑报告  获取 主机厂商
export const getCarSeries = (params) => net.request('admin/select/getCarSeries', 'post', params) //待编辑报告  获取 车系
export const getCarModel = (params) => net.request('admin/select/getCarModel', 'post', params) //待编辑报告  获取 车型
export const getCarMileage = (params) => net.request('admin/select/getCarMileage', 'post', params) //待编辑报告  获取 里程区间
export const getExplain = (params, data) => net.request('admin/select/getExplain', 'post', params, data) //待编辑报告  选择模板
export const getEngineType = (params, data) => net.request('admin/select/getEngineType', 'post', params, data) //待编辑报告  获取 发动机
export const getOptionByCarId = (params) => net.request('admin/select/getOptionByCarId', 'post', params) //待编辑报告  获取 部位
export const queryTestingWeb = (params) => net.request('admin/order/queryTestingWeb', 'post', params) //待编辑报告  打印、预览
export const queryCarTestingPhoto = (params) => net.request('admin/car/queryCarTestingPhoto', 'post', params) //待编辑报告  中间数据 检测部位数据
export const webMatchFirstReport = (params, data) => net.request('admin/image/polling/webMatch', 'post', params, data) //待编辑报告  中间右边数据
export const ensureEdit = (params) => net.request('admin/order/editJobMile', 'post', params) //待编辑报告  确认编辑里程
export const webSelect = (params, data) => net.request('admin/image/polling/webSelect', 'post', params, data) //待编辑报告  右边查询数据

export const imgUnqualified = (params, data) => net.request('admin/order/unqualified', 'post', params, data) //待编辑报告  照片不合格
export const submitReport = (params, data) => net.request('admin/order/writePresentation', 'post', params, data) //待编辑报告  提交报告


export const finshUpload = (params) => net.request('admin/order/completionTest', 'post', params) //待上传照片  完成上传
export const deletePhoto = (params, data) => net.request('admin/order/deletePhoto', 'post', params, data) //待上传照片  移除图片
export const ensureUploadImgList = (params, data) => net.request('admin/order/uploadPhotoList', 'post', params, data) //待上传照片  确认上传


export const startVeriftById = (params) => net.request('admin/car/queryById', 'post', params) //待审核界面  开始审核
export const veriftToExamine = (params, data) => net.request('admin/order/toExamine', 'post', params, data) //待审核界面  审核通过
export const veriftPresentation = (params, data) => net.request('admin/order/updatePresentation', 'post', params, data) //待审核界面  编辑并通过
export const veriftRepulse = (params) => net.request('admin/order/repulseStep1', 'post', params) //待审核界面  打回


export const uploadSecondPhotoList = (params, data) => net.request('admin/order/uploadSecondPhotoList', 'post', params, data) //复查照片上传  确认上传的回调
export const deleteRecheckPhoto = (params, data) => net.request('admin/order/deleteRecheckPhoto', 'post', params, data) //复查照片上传  删除照片


export const writeRecheckExamination = (params) => net.request('admin/order/writeRecheckExamination', 'post', params) //复查报告编辑  保存数据
export const selectGetResult = (params, data) => net.request('admin/select/getResult', 'post', params, data) //复查报告编辑  选择模板


export const editAuditingRecheck = (params, data) => net.request('admin/order/editAuditingRecheck', 'post', params, data) //复查报告审核  编辑并通过
export const auditingRecheck = (params) => net.request('admin/order/auditingRecheck', 'post', params) //复查报告审核  审核通过
export const repulseReport = (params) => net.request('admin/order/repulseStep2', 'post', params) //复查报告审核  打回