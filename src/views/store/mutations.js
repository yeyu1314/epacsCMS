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
  RECEIVE_DETECTION_ORDER_EDIT_TABLEDATA
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

  [RECEIVE_IMG_UPLOAD_D_TABLEDATA] (state, {row, result}) {
    state.onloadPicDialog = true
    state.onloadPicRow = row
    state.rowCarInfo = result
  },

  [RECHECK_IMG_UPLOAD_D_TABLEDATA] (state, {row, result, fileList, photoList}) {
    state.recheckonloadPicDialog = true
    state.recheckonloadPicRow = row
    state.recheckrowCarInfo = result
    state.frecheckrowFleList = fileList
    state.photoList = photoList
    console.log(row)
    console.log(result)
    console.log(fileList)
  },

  [RECEIVE_RECHECKPIC_ORDER_P_TABLEDATA] (state, {productItem, dataModel}) {
    state.productItem = productItem
    state.dataModel = dataModel
  },

  [RECEIVE_ENSURE_ORDER_DIA_TABLEDATA] (state,{viewPdf20, viewPdf30, viewPdf31}) { //治疗单确认的报告解读弹窗
    console.log(viewPdf20)
    state.viewPdf20 = viewPdf20
    state.viewPdf30 = viewPdf30
    state.viewPdf31 = viewPdf31
  },

  [RECEIVE_DETECTION_ORDER_EDIT_TABLEDATA] (state, {showEditPage, firstReportRow}) { // 待编辑报告界面
    console.log(showEditPage)
    state.showEditPage = showEditPage
    state.firstReportRow = firstReportRow
  }
}
