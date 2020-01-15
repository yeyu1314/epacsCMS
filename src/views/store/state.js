/*
  状态管理对象
*/
// let checkTypes = [{label: '全部', value: '0'}, {label: '检测', value: '1'}, {
//   label: '治疗',
//   value: '2'
// }, {label: '检测+治疗', value: '3'}]
// let checkTypeProps = {label: 'label', value: 'value'}
export default {
  tableData: [],
  pagination: {// 页数...
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  longDatas: [],
  pageNo: 1,
  pageSize: 10,
  searchData: {
    carNumber: null,
    carMsg: null,
    station: null,
    checkType: null
  },
  checkButtonList: [],
  detectionOrderBtnArrList: [],
  // 待编辑报告
  editDetectionTableData: [],
  editDetectionLongData: [],
  editDetectionPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  redordCols: [ // 操作记录表头
    {label: '操作人', prop: 'userName'},
    {label: '操作内容', prop: 'remarks'},
    {label: '操作时间', prop: 'inputTime'}
  ],
  redordData: [], // 操作记录数据
  // 完成工单列表
  detectionOrderEditBtnArrList: [],
  // 待上传照片
  imgUploadTableData: [],
  imgUploadLongDatas: [],
  imgUploadPagination: {// 页数...
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  detectionImgUploadBtnArrList: [],
  // 待检测工单
  detectionOrderTableData: [],
  detectionOrderLongDatas: [],
  detectionOrderPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  // 待审核报告
  verifyDetectionOrderTableData: [],
  verifyDetectionOrderLongDatas: [],
  verifyDetectionOrderPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  // 治疗单确认
  ensureOrderTableData: [],
  ensureOrderLongDatas: [],
  ensureOrderPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  ensureOrderBtnArrList: [],
  // 待复查工单
  treatTableData: [],
  treatPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  treatLongData: [],
  // 复查照片上传
  recheckPicTableData: [],
  recheckPicPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  recheckLongData: [],
  // 复查报告编辑
  editTecheckTableData: [],
  editTecheckPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  editTecheckLongData: [],
  // 复查报告待审
  waitVerifyReportTableData: [],
  waitVerifyReportPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  waitVerifyReportLongData: [],
}
