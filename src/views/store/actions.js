import {getCheckout, editDetectionOrder, getDetectionOrderListData, getFrozenOrder, getDiscardOrder, getUploadImgBtnData,
  getSelectData, getProductData, getSearchProductData, getUploadImgBtnPhotoData} from '../../api'
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
  RECHECK_IMG_UPLOAD_D_TABLEDATA,
  RECEIVE_RECHECKPIC_ORDER_P_TABLEDATA,
  RECEIVE_ENSURE_ORDER_DIA_TABLEDATA,
  RECEIVE_DETECTION_ORDER_EDIT_TABLEDATA,
  RECEIVE_IMG_UPLOAD_FINUPLOAD,
  RECEIVE_DETECTION_ORDER_REFRESH
} from "./mutation_types";
import net from "../../assets/js/public"
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
      getUploadImgBtnData({carId: row.carId}).then(res => {
        if(res.retcode === 1){
          const result = res.data
          let fileList = []
          const photoList = []
          commit(RECEIVE_IMG_UPLOAD_D_TABLEDATA, {row, result, fileList, photoList})// 提交一个mutation
        }
      })
      getSelectList(1, row.orgId)
      getSelectList(2, row.orgId)
      getSelectList(3, row.orgId)
    }

    const EditImg = (that, row) => { // 编辑照片
      console.log(that, row)
      getUploadImgBtnData({carId: row.carId}).then(res => {
        console.log(res)
        if(res.retcode === 1){
          const result = res.data
          const params = {
            jobId: row.jobId,
            step: 1
          }
          getUploadImgBtnPhotoData({params}).then( res => {
            console.log(res)
            const data = res.data
            for (let i = 0; i < result.list.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (result.list[i].optionId == data[j].optionId) {
                  result.list[i]["isQualified"] = data[j].isQualified;
                  const obj = {};
                  if (data[j].photoId != null && data[j].photoId > 0) {
                    obj["url"] =
                        net.imageHP + "image/get?imageId=" + data[j].photoId;
                    result.list[i].list.push(obj);
                    result.list[i]["photoId"] = data[j].photoId;
                  } else {
                    result.list[i]["isQualified"] = data[j].isQualified;
                  }
                }
              }
            }
            let conloadPicCarPhotoId = ''
            let onloadPicFramePhotoId = ''
            let fileList = []
            let fileList1 = []
            let onloadPics1 = ''
            let onloadPics2 = ''
            let photoList = []
            for (let g = 0; g < data.length; g++) {
              const obj1 = {};
              if (data[g].photoId != null && data[g].photoId > 0) {
                obj1["url"] =net.imageHP + "image/getLarge?imageId=" + data[g].photoId;

                if (data[g].optionId === -1) {// 车牌号
                  conloadPicCarPhotoId = data[g].photoId;
                  fileList.push(obj1);
                  onloadPics1 = data[g].isQualified;
                }
                if (data[g].optionId === -11) {// 车架号
                  onloadPicFramePhotoId = data[g].photoId;
                  fileList1.push(obj1);
                  onloadPics2 = data[g].isQualified;
                }

                photoList.push({
                  optionId: data[g].optionId,
                  photoId: data[g].photoId
                });
                // console.log(this.photoList)
              } else {
                if (data[g].optionId == -1) {
                  onloadPics1 = data[g].isQualified;
                }
                if (data[g].optionId == -11) {
                  onloadPics2 = data[g].isQualified;
                }
              }
            }
            commit(RECEIVE_IMG_UPLOAD_D_TABLEDATA, {row, result, fileList, fileList1, photoList, conloadPicCarPhotoId, onloadPicFramePhotoId, onloadPics1, onloadPics2})// 提交一个mutation
          })

        }
      })
      getSelectList(1, row.orgId)
      getSelectList(2, row.orgId)
      getSelectList(3, row.orgId)
    }

    const finshUpload = (that, row) => { // 完成上传
      console.log(that, row)
      const progressBar = true
      const loadProgress = true
      commit(RECEIVE_IMG_UPLOAD_FINUPLOAD, {progressBar,loadProgress, row})// 提交一个mutation
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
              {type: 'primary', label: '编辑照片', isShow: true, handle: (that, row) => { EditImg(that, row) }},
              {type: 'success', label: '完成上传', isShow: true, handle: (that, row) => { finshUpload(that, row) }}
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
      editDetectionOrder({jobId: row.jobId, version: row.version})
        .then(res => {
          console.log(res)
          if (res.retcode === 1) {
            const data = state.detectionOrderBtnArrList
            Message.success('请再次点击进入报告编辑')
            for (let i = 0; i < data.length; i++) {
              if (row.jobId === data[i].jobId) {
                data[i].btnList[0].isShow = false
                data[i].btnList[1].isShow = true
              }
            }
            const refresh = true
            commit(RECEIVE_DETECTION_ORDER_REFRESH, {refresh}) // 提交更新界面
          }
        }).catch(error => {
          console.log(error)
          
        })
    }
    const starEdit = (that, row) => { // 编辑检测报告
      console.log(that, row)
      const showEditPage = true
      const firstReportRow = row
      commit(RECEIVE_DETECTION_ORDER_EDIT_TABLEDATA, {showEditPage, firstReportRow})
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
              {type: 'warning', label: '编辑检测报告', isShow: false, }
            )
          }
          if (tableData[i].jobCode === 210 || tableData[i].jobCode === 220 || tableData[i].jobCode === 221) {
            btnArr.push(
              {type: 'success', label: '开始编辑', isShow: false, },
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
    const isViewPdf20 = () => {
      const viewPdf20 = true
      commit(RECEIVE_ENSURE_ORDER_DIA_TABLEDATA, {viewPdf20})
    }
    const isViewPdf30 = () => {
      const viewPdf30 = true
      commit(RECEIVE_ENSURE_ORDER_DIA_TABLEDATA, {viewPdf30})
    }
    const isViewPdf31 = () => {
      const viewPdf31 = true
      commit(RECEIVE_ENSURE_ORDER_DIA_TABLEDATA, {viewPdf31})
    }
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
              {type: 'success', label: '报告解读', isShow: true, handle: (that, row) => { isViewPdf30(that, row) }},
              {type: 'warning', label: '车主答疑', isShow: true, handle: (that, row) => { isViewPdf31(that, row) }}
            )
          } if (tableData[i].avgValue === 2) {
            btnArr.push(
              {type: 'success', label: '报告解读', isShow: true, handle: (that, row) => { isViewPdf20(that, row) }},
              {type: 'warning', label: '车主答疑', isShow: false}
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
      getUploadImgBtnData({carId: row.carId}).then(res => {
        const fileList = []
        const photoList = []
        if(res.retcode === 1){
          const result = res.data
          commit(RECHECK_IMG_UPLOAD_D_TABLEDATA, {row, result, fileList, photoList})// 提交一个mutation
        }
      })
      getSelectList(1, row.orgId)
      getSelectList(2, row.orgId)
      getSelectList(3, row.orgId)
      getSelectList(4, row.orgId)
      // getProductInfo()
      searchProUse(row.jobId) // 查询产品用量
    }
    
    const finshUpload = (that, row) => { // 完成上传
      console.log(that, row)
    }
    
    const getSelectList = (index,orgId) => { // 获取诊断工程师 等 的下拉框的值
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
      if (index === 4) {
        url = "admin/engineer/ZLListByOrgId";
      }
      getSelectData(url,{orgId: orgId}).then(() => {
        // commit(RECEIVE_IMG_UPLOAD_D_TABLEDATA, {res})// 提交一个mutation
      }).catch(error => {
        console.log(error)
      })
    }
    // 获取产品信息
    // const getProductInfo = () => {
    //   getProductData().then(res => {
    //     let dataModel = []
    //     console.log('产品用量',res)
    //     if(res.retcode == 1) {
    //       const productItem = res.data
    //       for(let i = 0; i < productItem.length; i++){
    //         dataModel.push({
    //           value1: "",
    //           id: productItem[i].id
    //         })
    //       }
    //       console.log(dataModel)
    //       commit(RECEIVE_RECHECKPIC_ORDER_P_TABLEDATA, {productItem, dataModel})
    //     }
    //   }).catch(error => {
    //     console.log(error)
    //   })
    // }
    const searchProUse = (jobId) => { // 查询产品用量
      let dataModel = []
      getProductData().then(res => {
        if(res.retcode == 1) {
          const productItem = res.data
          for(let i = 0; i < productItem.length; i++){
            dataModel.push({
              value1: "",
              id: productItem[i].id
            })
          }
          commit(RECEIVE_RECHECKPIC_ORDER_P_TABLEDATA, {productItem, dataModel})
        }
      }).catch(error => {
        console.log(error)
      })
      getSearchProductData({jobId: jobId}).then(res => {
        if (res.retcode === 1) {
          const productItem = res.data.rows;
          for (let i = 0; i < productItem.length; i++) {
            if (productItem[i].number != 0) {
              // this.checkProList.push(data[i].productId);
              for (let j = 0; j < dataModel.length; j++) {
                if (dataModel[j].id == productItem[i].productId) {
                  dataModel[j]["value1"] = productItem[i].number;
                }
              }
            }
          }
          // commit(RECEIVE_RECHECKPIC_ORDER_P_TABLEDATA, {productItem, dataModel})
        } else {
          net.message(this, res.retmsg, "error");
        }
      })
    }

    const EditTest = (that, row) => { // 编辑照片
      console.log('编辑照片', that, row)
      getUploadImgBtnData({carId: row.carId}).then(rowRes => {
        if(rowRes.retcode === 1){
          const result = rowRes.data
          const params = {
            jobId: row.jobId,
            step: 2
          }
          getUploadImgBtnPhotoData({params}).then(res => {
            console.log('该行的图片信息',rowRes)
            console.log(res)
            const data = res.data
            for (var i = 0; i < result.list.length; i++) {
              for (var j = 0; j < data.length; j++) {
                if (result.list[i].optionId == data[j].optionId) {
                  result.list[i]["isQualified"] = data[j].isQualified;
                  var obj = {};
                  if (data[j].photoId != null && data[j].photoId > 0) {
                    obj["url"] =
                      net.imageHP + "image/get?imageId=" + data[j].photoId;
                      result.list[i].list.push(obj);
                      result.list[i]["photoId"] = data[j].photoId;
                  } else {
                    result.list[i]["isQualified"] = data[j].isQualified;
                  }
                }
              }
            }
            
            let carPhotoId = ''
            let fileList = []
            let s1 = ''
            let photoList = []
            for (let g = 0; g < data.length; g++) {
              if (data[g].photoId != null && data[g].photoId > 0) {
                let obj1 = {}
                obj1["url"] =net.imageHP + "image/get?imageId=" + data[g].photoId

                if (data[g].optionId == -2) { // 车牌
                  // this.carPhotoId = data[g].photoId;
                  // this.fileList.push(obj1);
                  // this.s1 = data[g].isQualified;
                  carPhotoId = data[g].photoId;
                  fileList.push(obj1);
                  s1 = data[g].isQualified;
                  console.log(fileList)
                }
                // if (data[g].optionId == -11) {
                //   this.framePhotoId = data[g].photoId;
                //   this.fileList1.push(obj1);
                //   this.s2 = data[g].isQualified;
                // }

                photoList.push({
                  optionId: data[g].optionId,
                  photoId: data[g].photoId
                });
              } else {
                if (data[g].optionId == -2) {
                  // this.s1 = data[g].isQualified;
                }
                if (data[g].optionId == -11) {
                  // this.s2 = data[g].isQualified;
                }
              }
            }
            console.log("result",result.list)
            console.log("carPhotoId",carPhotoId)
            console.log("fileList",fileList)
            console.log("s1",s1)
            commit(RECHECK_IMG_UPLOAD_D_TABLEDATA, {row, result, fileList, photoList})// 提交一个mutation

          })
        }
      })
      getSelectList(1, row.orgId)
      getSelectList(2, row.orgId)
      getSelectList(3, row.orgId)
      getSelectList(4, row.orgId)
      // getProductInfo()
      searchProUse(row.jobId) // 查询产品用量
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
              {type: 'primary', label: '编辑照片', isShow: true, handle: (that, row) => { EditTest(that, row) }},
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
