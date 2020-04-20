/*
直接更新state的多个方法的对象
 */
import {
  RECEIVE_TABLEDATA,
  RECEIVE_IMG_UPLOAD_TABLEDATA,
  RECEIVE_EDIT_ORDER_TABLEDATA,
  RECEIVE_DETECTION_ORDER_TABLEDATA,
  RECEIVE_DETECTION_VERIFY_TABLEDATA,
  RECEIVE_ENSURE_ORDER_TABLEDATA,
  RECEIVE_TREAT_ORDER_TABLEDATA,
  RECEIVE_RECHECKPIC_ORDER_TABLEDATA,
  RECEIVE_EDIT_RECHECK_ORDER_TABLEDATA,
  RECEIVE_WAIT_VERIFY_REPORT_ORDER_TABLEDATA,
  RECEIVE_FROZEN_ORDER_TABLEDATA,
  RECEIVE_DISCARD_ORDER_TABLEDATA,
  RECEIVE_IMG_UPLOAD_D_TABLEDATA,
  RECHECK_IMG_UPLOAD_D_TABLEDATA,
  RECEIVE_RECHECKPIC_ORDER_P_TABLEDATA,
  RECEIVE_ENSURE_ORDER_DIA_TABLEDATA,
  RECEIVE_DETECTION_ORDER_EDIT_TABLEDATA,
  RECEIVE_IMG_UPLOAD_FINUPLOAD,
  RECEIVE_DETECTION_ORDER_REFRESH,
  RECEIVE_RECHECK_PIC_FINUPLOAD
} from './mutation_types'
export default {
  [RECEIVE_TABLEDATA] (state, {tableData, pagination, longDatas, checkButtonList, detectionOrderBtnArrList}) { // 完成工单
    // console.log(checkButtonList)
    state.tableData = tableData
    state.pagination = pagination
    state.longDatas = longDatas
    state.checkButtonList = checkButtonList
    state.detectionOrderBtnArrList = detectionOrderBtnArrList
  },

  [RECEIVE_IMG_UPLOAD_TABLEDATA] (state, {tableData, pagination, longDatas, detectionImgUploadBtnArrList}) { // 待上传照片
    state.imgUploadTableData = tableData
    state.imgUploadPagination = pagination
    state.imgUploadLongDatas = longDatas
    state.detectionImgUploadBtnArrList = detectionImgUploadBtnArrList
    state.searchData.carNumber = ''
  },

  [RECEIVE_EDIT_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas, detectionOrderEditBtnArrList}) { // 待编辑报告
    state.editDetectionTableData = tableData
    state.editDetectionPagination = pagination
    state.editDetectionLongData = longDatas
    state.detectionOrderEditBtnArrList = detectionOrderEditBtnArrList
    state.searchData.carNumber = ''
  },

  [RECEIVE_DETECTION_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 待检测工单
    state.detectionOrderTableData = tableData
    state.detectionOrderPagination = pagination
    state.detectionOrderLongDatas = longDatas
    state.searchData.carNumber = ''
  },

  [RECEIVE_DETECTION_VERIFY_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 待审核报告
    state.verifyDetectionOrderTableData = tableData
    state.verifyDetectionOrderPagination = pagination
    state.verifyDetectionOrderLongDatas = longDatas
    state.searchData.carNumber = ''
  },

  [RECEIVE_ENSURE_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas, ensureBtnArrList}) { // 治疗单确认
    state.ensureOrderTableData = tableData
    state.ensureOrderPagination = pagination
    state.ensureOrderLongDatas = longDatas
    state.ensureOrderBtnArrList = ensureBtnArrList
    state.searchData.carNumber = ''
  },

  [RECEIVE_TREAT_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 待复查工单
    state.treatTableData = tableData
    state.treatPagination = pagination
    state.treatLongData = longDatas
    state.searchData.carNumber = ''
  },

  [RECEIVE_RECHECKPIC_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas, recheckImgUploadBtnArrList}) { // 复查照片上传
    state.recheckPicTableData = tableData
    state.recheckPicPagination = pagination
    state.recheckPicLongData = longDatas
    state.searchData.carNumber = ''
    state.recheckImgUploadBtnArrList = recheckImgUploadBtnArrList
  },

  [RECEIVE_EDIT_RECHECK_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 复查报告编辑
    state.editTecheckTableData = tableData
    state.editTecheckPagination = pagination
    state.editTecheckLongData = longDatas
    state.searchData.carNumber = ''
  },

  [RECEIVE_WAIT_VERIFY_REPORT_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 复查报告待审
    state.waitVerifyReportTableData = tableData
    state.waitVerifyReportPagination = pagination
    state.waitVerifyReportLongData = longDatas
    state.searchData.carNumber = ''
  },

  [RECEIVE_FROZEN_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 冻结工单列表
    state.frozenTableData = tableData
    state.frozenPagination = pagination
    state.frozenLongData = longDatas
  },

  [RECEIVE_DISCARD_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 废弃工单列表
    console.log(tableData, pagination, longDatas)
    state.discardTableData = tableData
    state.discardPagination = pagination
    state.discardLongData = longDatas
  },

  [RECEIVE_IMG_UPLOAD_D_TABLEDATA] (state, {row, result, fileList, fileList1, photoList, onloadPicCarPhotoId, onloadPicFramePhotoId, onloadPics1, onloadPics2}) { //待上传照片 编辑照片/上传照片
    state.onloadPicDialog = true
    state.onloadPicRow = row
    state.rowCarInfo = result
    state.onloadPicFileList = fileList
    state.onloadPicFileList1 = fileList1
    state.onLoadPicPhotoList = photoList
    state.onloadPicCarPhotoId = onloadPicCarPhotoId
    state.onloadPicFramePhotoId = onloadPicFramePhotoId
    state.onloadPics1 = onloadPics1
    state.onloadPics2 = onloadPics2
  },

  [RECHECK_IMG_UPLOAD_D_TABLEDATA] (state, {row, result, fileList, photoList, prodectArr, recheckPicCarPhotoId, recheckPics1, recheckPics2}) {
    state.recheckonloadPicDialog = true
    state.recheckonloadPicRow = row
    state.recheckrowCarInfo = result
    state.frecheckrowFleList = fileList
    state.recheckPicPhotoList = photoList
    state.prodectArr = prodectArr
    state.recheckPicCarPhotoId = recheckPicCarPhotoId
    state.recheckPics1 = recheckPics1
    state.recheckPics2 = recheckPics2
  },

  [RECEIVE_RECHECKPIC_ORDER_P_TABLEDATA] (state, {productItem, dataModel}) {
    state.productItem = productItem
    state.dataModel = dataModel
  },

  [RECEIVE_ENSURE_ORDER_DIA_TABLEDATA] (state,{viewPdf20, viewPdf30, viewPdf31}) { //治疗单确认的报告解读弹窗
    state.viewPdf20 = viewPdf20
    state.viewPdf30 = viewPdf30
    state.viewPdf31 = viewPdf31
  },

  [RECEIVE_DETECTION_ORDER_EDIT_TABLEDATA] (state, {showEditPage, firstReportRow}) { // 待编辑报告界面
    state.showEditPage = showEditPage
    state.firstReportRow = firstReportRow
  },

  [RECEIVE_IMG_UPLOAD_FINUPLOAD](state, {progressBar,loadProgress, row}) { // 待上传照片  完成上传
    state.progressBar = progressBar
    state.loadProgress = loadProgress
    state.onloadPicRow = row
  },

  [RECEIVE_DETECTION_ORDER_REFRESH](state, {refresh}) {
    state.refresh = refresh
  },

  [RECEIVE_RECHECK_PIC_FINUPLOAD](state, {progressBarRecheck,loadProgressRecheck, row}) { // 复查照片上传  完成上传
    state.progressBarRecheck = progressBarRecheck
    state.loadProgressRecheck = loadProgressRecheck
    state.recheckonloadPicRow = row
  },
}
