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
  redordCols: [ // 操作记录表头
    {label: '操作人', prop: 'userName'},
    {label: '操作内容', prop: 'remarks'},
    {label: '操作时间', prop: 'inputTime'}
  ],
  redordData: [], // 操作记录数据
  // 待检测工单
  detectionOrderTableData: [],
  detectionOrderLongDatas: [],
  detectionOrderPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  // 待上传照片
  imgUploadTableData: [],
  imgUploadLongDatas: [],
  imgUploadPagination: {// 页数...
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  detectionImgUploadBtnArrList: [],
  onloadPicDialog: false,
  onloadPicRow: '',
  rowCarInfo: '',
  onloadPicFileList: [],
  onloadPicFileList1: [],
  onLoadPicPhotoList: [],
  conloadPicCarPhotoId: undefined,
  onloadPicFramePhotoId: undefined,
  onloadPics1: 0,
  onloadPics2: 0,
  progressBar: false,
  loadProgress: false,
  // 待编辑报告
  editDetectionTableData: [],
  editDetectionLongData: [],
  editDetectionPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  detectionOrderEditBtnArrList: [],
  showEditPage: false,
  firstReportRow: '', //点击的行数据
  refresh: false,
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
  viewPdf20: false,
  viewPdf30: false,
  viewPdf31: false,
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
  recheckPicLongData: [],
  recheckImgUploadBtnArrList: [],
  recheckonloadPicDialog: false,
  recheckonloadPicRow: '',
  recheckrowCarInfo: '',
  productItem: [],
  dataModel: [], //暂存计步器双休绑定
  frecheckrowFleList: [],
  recheckPicPhotoList: [],
  prodectArr: [],
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
  // 完成工单列表

  // 冻结工单列表
  frozenTableData: [],
  frozenPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  frozenLongData: [],
  frozenSearchData: {
    carNumber: null,
    carMsg: null,
    station: null,
    checkType: null
  },

  // 废弃工单列表
  discardTableData: [],
  discardPagination: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
  discardLongData: [],
  discardSearchData: {
    carNumber: null,
    carMsg: null,
    station: null,
    checkType: null
  },
}
