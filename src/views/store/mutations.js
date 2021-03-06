/*
直接更新state的多个方法的对象
 */
import {
  RECEIVE_TABLEDATA,
  RECEIVE_IMG_UPLOAD_TABLEDATA,
  RECEIVE_EDIT_ORDER_TABLEDATA,
  RECEIVE_DETECTION_ORDER_TABLEDATA,
  RECEIVE_DETECTION_VERIFY_TABLEDATA,
  RECEIVE_ENSURE_ORDER_TABLEDATA
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
  },

  [RECEIVE_EDIT_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas, detectionOrderEditBtnArrList}) { // 待编辑报告
    state.editDetectionTableData = tableData
    state.editDetectionPagination = pagination
    state.editDetectionLongData = longDatas
    state.detectionOrderEditBtnArrList = detectionOrderEditBtnArrList
  },

  [RECEIVE_DETECTION_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 待检测工单
    state.detectionOrderTableData = tableData
    state.detectionOrderPagination = pagination
    state.detectionOrderLongDatas = longDatas
  },

  [RECEIVE_DETECTION_VERIFY_TABLEDATA] (state, {tableData, pagination, longDatas}) { // 待审核报告
    state.verifyDetectionOrderTableData = tableData
    state.verifyDetectionOrderPagination = pagination
    state.verifyDetectionOrderLongDatas = longDatas
  },

  [RECEIVE_ENSURE_ORDER_TABLEDATA] (state, {tableData, pagination, longDatas, ensureBtnArrList}) { // 治疗单确认
    state.ensureOrderTableData = tableData
    state.ensureOrderPagination = pagination
    state.ensureOrderLongDatas = longDatas
    state.ensureOrderBtnArrList = ensureBtnArrList
  }
}
