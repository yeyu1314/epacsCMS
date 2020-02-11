import {getCheckout, editDetectionOrder, getDetectionOrderListData, getFrozenOrder, getDiscardOrder, getUploadImgBtnData,
  getSelectData} from '../../api'
import {
  RECEIVE_IMG_UPLOAD_TABLEDATA,
  RECEIVE_TABLEDATA,
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
  RECHECK_IMG_UPLOAD_D_TABLEDATA
} from "./mutation_types";
import router from '../../router'
import moment from 'moment'
import {Message, MessageBox} from 'element-ui'

export default {
  // 完成工单
  async getDataList ({commit, state}) {
    const record = (jobId, step) => {
      console.log('点击啦!!!!', jobId, step)
      const param = {
        jobId: jobId,
        step: step
      }
      getCheckout(param).then(res => {
        console.log(res)
      }).catch(res => {
        console.log(res)
      })
    }
    const showCheck = (that, row) => { // 点击查看检测报告
      console.log('aaa', that, row)
      record(row.jobId, 1)
      router.push({
        path: '/article_list',
        name: '文章列表',
        params: {
          operId: 1,
          row: row,
          pageNo: state.pageNo,
          pageSize: state.pageSize,
          carNumber: state.searchData.carNumber,
          enter: true,
          print: true
        }
      })
    }
    await getDetectionOrderListData(
      {pageNo: state.pageNo, pageSize: state.pageSize},
      {
        type: 9,
        carNumber: state.searchData.carNumber,
        orgName: state.searchData.station,
        seriesName: state.searchData.carMsg,
        checkType: state.searchData.checkType
      }
    ).then(res => {
      console.log(res)
    }).catch(res => {
      console.log('完成工单列表', res)
      if (res.data.retcode === 1) {
        const tableData = res.data.data.rows // 表格数据
        // console.log(tableData)
        const pagination = { // 分页数据
          pageSize: res.data.data.pageSize,
          pageNum: res.data.data.pageNo,
          total: res.data.data.total
        }
        let longDatas = []
        let checkButtonArr = []
        let checkArr = []
        const checkButtonList = []// 二维数组
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
          if (tableData[i].checkType === 1 || tableData[i].checkType === 3) { // 控制显示隐藏的条件    1---检测 2----治疗  3 ----检测+治疗
            checkButtonArr.push({id: tableData[i].jobId, type: 'primary', label: '查看检测报告', isShow: true, size: 'small ', handle: (that, row) => { showCheck(that, row) }})
          } else {
            checkButtonArr.push({id: tableData[i].jobId, type: 'primary', label: '查看检测报告', isShow: false})
          }
        }
        checkButtonArr.forEach((c) => {
          if (checkArr.length === 1) { // 如果小数组已经满了，创建一个新的  （两个为一组）
            checkArr = []
          }
          if (checkArr.length === 0) { // 如果minArr是空的，将小数组保存到大数组中
            checkButtonList.push({
              id: c.id,
              btnList: checkArr
            })
          }
          checkArr.push(c)// 将当前分类保存到小数组中
        })
        commit(RECEIVE_TABLEDATA, {tableData, pagination, longDatas, checkButtonList})// 提交一个mutation
      }
    })
  },
  // 待检测工单
  async getDetectionOrderList ({commit, state}) {
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 1,carNumber:state.searchData.carNumber}).then(res => {
      console.log('待检测工单', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
        }
        commit(RECEIVE_DETECTION_ORDER_TABLEDATA, {tableData, pagination, longDatas})
      }
    }).catch(res => {
      console.log('待检测工单', res)
    })
  },
  // 待上传照片 
  async getDetectionImgUploadList ({commit, state}) {
    const showEditTest = (that, row) => { // 上传照片
      console.log(that, row)
      getUploadImgBtnData({carId: row.carId}).then(res => {
        console.log(res)
        if(res.retcode === 1){
          const result = res.data
          commit(RECEIVE_IMG_UPLOAD_D_TABLEDATA, {row, result})// 提交一个mutation
        }
      })
      getSelectList(1, row.orgId)
      getSelectList(2, row.orgId)
      getSelectList(3, row.orgId)
    }
    const getSelectList = (index,orgId) => {
      console.log(index,orgId)
      let url;
      if (index === 1) {
        url = "admin/engineer/CZListByOrgId";
      }
      if (index === 2) {
        url = "admin/engineer/JCListByOrgId";
      }
      if (index === 3) {
        url = "admin/engineer/GDListByOrgId";
      }
      getSelectData(url,{orgId: orgId}).then(res => {
        console.log(res)
        // commit(RECEIVE_IMG_UPLOAD_D_TABLEDATA, {res})// 提交一个mutation
      }).catch(error => {
        console.log(error)
      })
    }
    const finshUpload = (that, row) => {
      console.log(that, row)
    }
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 2,carNumber:state.searchData.carNumber}).then(res => {
      console.log('待上传照片', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        let imgBtnArr = []
        let minArr = []
        let detectionImgUploadBtnArrList = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
          if (tableData[i].jobCode === 20) {
            imgBtnArr.push(
              {type: 'primary', label: '上传照片', isShow: true, handle: (that, row) => { showEditTest(that, row) }},
              {type: 'success', label: '完成', isShow: false}
            )
          } if (tableData[i].jobCode === 30 || tableData[i].jobCode === 31 || tableData[i].jobCode === 32) {
            imgBtnArr.push(
              {type: 'primary', label: '上传照片', isShow: true, handle: (that, row) => { showEditTest(that, row) }},
              {type: 'success', label: '完成', isShow: true, handle: (that, row) => { finshUpload(that, row) }}
            )
          }
        }
        imgBtnArr.forEach((c, index) => {
          if (minArr.length === 2) {
            minArr = []
          }
          if (minArr.length === 0) {
            detectionImgUploadBtnArrList.push({
              jobId: tableData[index / 2].jobId,
              btnList: minArr
            })
          }
          minArr.push(c) // 将当前分类保存到小数组中
        })
        commit(RECEIVE_IMG_UPLOAD_TABLEDATA, {tableData, pagination, longDatas, detectionImgUploadBtnArrList})// 提交一个mutation
      }
    }).catch(res => {
      console.log('待上传照片', res)
    })
  },
  // 待编辑报告
  async getDetectionOrderEditList ({commit, state}) {
    const showEditTest = (that, row) => { // 开始编辑
      console.log('点击啦!!!!', that, row, row.jobId)
      editDetectionOrder({jobId: row.jobId, version: row.version})
        .then(res => {
          console.log(res)
        }).catch(res => {
          console.log(res)
          if (res.data.retcode === 1) {
            const data = state.detectionOrderBtnArrList
            Message.success('请再次点击进入报告编辑')
            for (let i = 0; i < data.length; i++) {
              if (row.jobId === data[i].jobId) {
                data[i].btnList[0].isShow = false
                data[i].btnList[1].isShow = true
              }
            }
            // getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 3})
          }
        })
    }
    const starEdit = (that, row) => { // 编辑检测报告
      console.log(that, row)
    }
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 3,carNumber:state.searchData.carNumber}).then(res => {
      console.log('待编辑报告数据',res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        let btnArr = []
        let minArr = []
        let detectionOrderEditBtnArrList = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
          if (tableData[i].jobCode === 100) {
            btnArr.push(
              {type: 'success', label: '开始编辑', isShow: true, handle: (that, row) => { showEditTest(that, row) }},
              {type: 'warning', label: '编辑检测报告', isShow: false, handle: (that, row) => { starEdit(that, row) }}
            )
          } if (tableData[i].jobCode === 210 || tableData[i].jobCode === 220 || tableData[i].jobCode === 221) {
            btnArr.push(
              {type: 'success', label: '开始编辑', isShow: false, handle: (that, row) => { showEditTest(that, row) }},
              {type: 'warning', label: '编辑检测报告', isShow: true, handle: (that, row) => { starEdit(that, row) }}
            )
          }
        }
        btnArr.forEach((c, index) => {
          if (minArr.length === 2) {
            minArr = []
          }
          if (minArr.length === 0) {
            detectionOrderEditBtnArrList.push({
              jobId: tableData[index / 2].jobId,
              btnList: minArr
            })
          }
          minArr.push(c) // 将当前分类保存到小数组中
        })
        commit(RECEIVE_EDIT_ORDER_TABLEDATA, {tableData, pagination, longDatas, detectionOrderEditBtnArrList})// 提交一个mutation
      }
    }).catch(res => {
      console.log('待编辑报告数据', res)
    })
  },
  // 待审核报告
  async getDetectionVerifyList ({commit, state}) {
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 4,carNumber:state.searchData.carNumber}).then(res => {
      console.log('待审核报告', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
        }
        commit(RECEIVE_DETECTION_VERIFY_TABLEDATA, {tableData, pagination, longDatas})
      }
    }).catch(res => {
      console.log('待审核报告', res)
    })
  },
  // 治疗单确认
  async getEnsureOrderList ({commit, state}) {
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 5,carNumber:state.searchData.carNumber}).then(res => {
      console.log('治疗单确认', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        let btnArr = []
        let minArr = []
        let ensureBtnArrList = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
          if (tableData[i].avgValue === 3) {
            btnArr.push(
              {type: 'success', label: '报告解读', isShow: true, handle: (that, row) => { showEditTest(that, row) }},
              {type: 'warning', label: '车主答疑', isShow: true, handle: (that, row) => { starEdit(that, row) }}
            )
          } if (tableData[i].avgValue === 2) {
            btnArr.push(
              {type: 'success', label: '报告解读', isShow: true, handle: (that, row) => { showEditTest(that, row) }},
              {type: 'warning', label: '车主答疑', isShow: false, handle: (that, row) => { starEdit(that, row) }}
            )
          }
        }
        btnArr.forEach((c, index) => {
          if (minArr.length === 2) {
            minArr = []
          }
          if (minArr.length === 0) {
            ensureBtnArrList.push({
              jobId: tableData[index / 2].jobId,
              btnList: minArr
            })
          }
          minArr.push(c)
        })
        commit(RECEIVE_ENSURE_ORDER_TABLEDATA, {tableData, pagination, longDatas, ensureBtnArrList})
      }
    }).catch(res => {
      console.log('治疗单确认', res)
    })
  },
 // 待复查工单
  async getTreatOrderEditList({commit, state}) {
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 6,carNumber:state.searchData.carNumber}).then(res => {
      console.log('待复查工单', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
        }
        commit(RECEIVE_TREAT_ORDER_TABLEDATA, {tableData, pagination, longDatas})
      }
    }).catch(res => {
      console.log('待复查工单error', res)
    })
  },
  // 复查照片上传
  async getRecheckPicList ({commit, state}) {
    const showEditTest = (that, row) => { // 上传照片
      console.log(that, row)
      getUploadImgBtnData({carId: row.carId}).then(res => {
        console.log(res)
        if(res.retcode === 1){
          const result = res.data
          commit(RECHECK_IMG_UPLOAD_D_TABLEDATA, {row, result})// 提交一个mutation
        }
      })
      getSelectList(1, row.orgId)
      getSelectList(2, row.orgId)
      getSelectList(3, row.orgId)
    }
    const getSelectList = (index,orgId) => {
      console.log(index,orgId)
      let url;
      if (index === 1) {
        url = "admin/engineer/CZListByOrgId";
      }
      if (index === 2) {
        url = "admin/engineer/JCListByOrgId";
      }
      if (index === 3) {
        url = "admin/engineer/GDListByOrgId";
      }
      getSelectData(url,{orgId: orgId}).then(res => {
        console.log(res)
        // commit(RECEIVE_IMG_UPLOAD_D_TABLEDATA, {res})// 提交一个mutation
      }).catch(error => {
        console.log(error)
      })
    }
    const finshUpload = (that, row) => {
      console.log(that, row)
    }
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 7,carNumber:state.searchData.carNumber}).then(res => {
      console.log('复查照片上传', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        let imgBtnArr = []
        let minArr = []
        let recheckImgUploadBtnArrList = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          tableData[i].explain = tableData[i].jobCode === 632 ? '照片不合格' : '正常'
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
          if (tableData[i].jobCode === 600) {
            imgBtnArr.push(
              {type: 'primary', label: '上传照片', isShow: true, handle: (that, row) => { showEditTest(that, row) }},
              {type: 'success', label: '完成', isShow: false}
            )
          } if (tableData[i].jobCode === 630 || tableData[i].jobCode === 631 || tableData[i].jobCode === 632) {
            imgBtnArr.push(
              {type: 'primary', label: '上传照片', isShow: true, handle: (that, row) => { showEditTest(that, row) }},
              {type: 'success', label: '完成上传', isShow: true, handle: (that, row) => { finshUpload(that, row) }}
            )
          }
        }
        imgBtnArr.forEach((c, index) => {
          if (minArr.length === 2) {
            minArr = []
          }
          if (minArr.length === 0) {
            recheckImgUploadBtnArrList.push({
              jobId: tableData[index / 2].jobId,
              btnList: minArr
            })
          }
          minArr.push(c) // 将当前分类保存到小数组中
        })
        console.log(longDatas)
        commit(RECEIVE_RECHECKPIC_ORDER_TABLEDATA, {tableData, pagination, longDatas, recheckImgUploadBtnArrList})
      }
    }).catch(error => {
      console.log('复查照片上传error', error)
    })
  },
  // 复查报告编辑
  async getEditRecheckList ({commit, state}) {
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 8,carNumber:state.searchData.carNumber}).then(res => {
      console.log('复查报告编辑', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
        }
        commit(RECEIVE_EDIT_RECHECK_ORDER_TABLEDATA, {tableData, pagination, longDatas})
      }
    }).catch(error => {
      console.log('复查报告编辑error', error)
    })
  },
  //复查报告待审
  async getWaitVerifyReportList ({commit, state}) {
    await getDetectionOrderListData({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 10,carNumber:state.searchData.carNumber}).then(res => {
      console.log('复查报告待审', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
        }
        commit(RECEIVE_WAIT_VERIFY_REPORT_ORDER_TABLEDATA, {tableData, pagination, longDatas})
      }
    }).catch(error => {
      console.log('复查报告待审error', error)
    })
  },
  // 冻结工单列表
  async getFrozenList ({commit, state}) {
    await getFrozenOrder({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 11}).then(res => {
      console.log('冻结工单列表', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          tableData[i].frozenStatusLaber = tableData[i].frozenStatus==1?"系统冻结":tableData[i].frozenStatus==2?"人工冻结":"其他"
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName,
              tableData[i].seriesName,
              tableData[i].modelName
            ]
          })
        }
        commit(RECEIVE_FROZEN_ORDER_TABLEDATA, {tableData, pagination, longDatas})
      }
    }).catch(error => {
      console.log('冻结工单列表error', error)
    })
  },
  // 废弃工单列表
  async getDiscaedList ({commit, state}) {
    await getDiscardOrder({pageNo: state.pageNo, pageSize: state.pageSize}, {type: 12}).then(res => {
      console.log('废弃工单列表', res)
      if (res.retcode === 1) {
        const tableData = res.data.rows
        const pagination = { // 分页数据
          pageSize: res.data.pageSize,
          pageNum: res.data.pageNo,
          total: res.data.total
        }
        let longDatas = []
        for (let i = 0; i < tableData.length; i++) {
          tableData[i].checkTypeLaber = tableData[i].checkType === 1 ? '检测' : (tableData[i].checkType === 3 ? '治疗+检测' : '治疗') // 业务类型
          tableData[i].inputTime = moment(tableData[i].inputTime).format('YYYY-MM-DD HH:MM')
          tableData[i].frozenStatusLaber = tableData[i].frozenStatus==1?"系统冻结":tableData[i].frozenStatus==2?"人工冻结":"其他"
          longDatas.push({ // 车辆信息
            jobId: tableData[i].jobId,
            note: [
              tableData[i].factoryName ? tableData[i].factoryName : '',
              tableData[i].seriesName ? tableData[i].seriesName : '',
              tableData[i].modelName ? tableData[i].modelName : ''
            ]
          })
        }
        commit(RECEIVE_DISCARD_ORDER_TABLEDATA, {tableData, pagination, longDatas})
      }
    }).catch(error => {
      console.log('废弃工单列表error', error)
    })
  },

  
  
}
