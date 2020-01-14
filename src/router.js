import Vue from 'vue'
import Router from 'vue-router'
import SignIn from './views/SignIn.vue'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('./views/privacy.vue')
  },
  {
    path: '/headpage',
    name: 'headpage',
    component: () => import('./views/Index.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./views/home.vue'),
    children: [{
      path: "/index",
      name: 'index',
      component: () => import('./views/Index.vue'),
    },
    { //用户列表
      path: "/userInfo",
      name: 'userInfo',
      component: () => import('./views/userInfo.vue'),
    },
    { //角色列表
      path: "/roleInfo",
      name: 'roleInfo',
      component: () => import('./views/roleInfo.vue'),
    },
    { //日志
      path: "/logInfo",
      name: 'logInfo',
      component: () => import('./views/log.vue'),
    },
    { //数据导入
      path: "/dataInport",
      name: 'dataInport',
      component: () => import('./views/dataInport.vue'),
    },
    { //历史数据检索
      path: "/historydata",
      name: 'historydata',
      component: () => import('./views/historydata.vue'),
    },
    {
      path: "/history",
      name: 'history',
      component: () => import('./views/history.vue'),
    },
    { //维修站列表
      path: "/organ",
      name: 'organ',
      component: () => import('./views/org/organList.vue'),
    },
    { //维修站用户
      path: "/orgUser",
      name: 'orgUser',
      component: () => import('./views/org/orgUser.vue'),
    },
    { //合同管理
      path: "/contract",
      name: 'contract',
      component: () => import('./views/org/contract.vue'),
    },
    { //车辆信息
      path: "/carInfo",
      name: 'carInfo',
      component: () => import('./views/carInfo.vue'),
    },
    { //区域信息
      path: "/areaInfo",
      name: 'areaInfo',
      component: () => import('./views/basedata/areaInfo.vue'),
    },
    { //车辆配置
      path: "/carConfig",
      name: 'carConfig',
      component: () => import('./views/basedata/carConfig.vue'),
    },
    { //车况模板
      path: "/carCondition",
      name: 'carCondition',
      component: () => import('./views/basedata/carConditon.vue'),
    },
    { //产品管理
      path: "/product",
      name: 'product',
      component: () => import('./views/basedata/product.vue'),
    },
    { //检测模板
      path: "/survey",
      name: 'survey',
      component: () => import('./views/basedata/survey.vue'),
    },
    {//检测说明
      path: "/explain",
      name: 'explain',
      component: () => import('./views/basedata/explain.vue'),
    },
    {//复查结果
      path: "/result",
      name: 'result',
      component: () => import('./views/basedata/result.vue'),
    },
      {                                                               //测试表格
        path: "/testTable",
        name: 'orderInport',
        component: () => import('./views/form/testTable.vue'),
      },
      {                                                               //测试表格
        path: "/demoTable",
        name: 'demoTable',
        component: () => import('./views/form/demoTable.vue'),
      },
    { //工单录入
      path: "/orderInport",
      name: 'orderInport',
      component: () => import('./views/order/orderInport.vue'),
    },
    { //检测报告
      path: "/firstReport",
      name: 'firstReport',
      component: () => import('./views/order/firstReport.vue'),
    },
    { //待检测工单
      path: "/waitOrder",
      name: 'waitOrder',
      component: () => import('./views/order/waitOrder.vue'),
    },
    { //上传检测照片
      path: "/onloadPic",
      name: 'onloadPic',
      component: () => import('./views/order/onloadPic.vue'),
    },
    { //待审核工单
      path: "/waitVerify",
      name: 'waitVerify',
      component: () => import('./views/order/waitVerify.vue'),
    },
    { //待确认治疗工单
      path: "/ensureOrder",
      name: 'ensureOrder',
      component: () => import('./views/order/ensureOrder.vue'),
    },
    { //带治疗工单
      path: "/treatOrder",
      name: 'treatOrder',
      component: () => import('./views/order/treatOrder.vue'),
    },
    { //上传复查照片
      path: "/recheckPic",
      name: 'recheckPic',
      component: () => import('./views/order/recheckPic.vue'),
    },
    { //已完成工单
      path: "/completeOrder",
      name: 'completeOrder',
      component: () => import('./views/order/completeOrder.vue'),
    },
    { //编辑复查报告
      path: "/editRecheck",
      name: 'editRecheck',
      component: () => import('./views/order/editRecheck.vue'),
    },
    { //冻结工单列表
      path: "/frozen",
      name: 'frozen',
      component: () => import('./views/order/frozenOrder.vue'),
    },
    { //废弃工单列表
      path: "/discard",
      name: 'discard',
      component: () => import('./views/order/discardOrder.vue'),
    },
    { //待审核复查报告
      path: "/waitVerifyReport",
      name: 'waitVerifyReport',
      component: () => import('./views/order/waitVerifyReport.vue'),
    },
    { //工单报表
      path: "/orderReport",
      name: 'orderReport',
      component: () => import('./views/report/orderReport.vue'),
    }, { //审核报表
      path: "/examineReport",
      name: 'examineReport',
      component: () => import('./views/report/examineReport.vue'),
    }, { //财务查询
      path: "/financeReport",
      name: 'financeReport',
      component: () => import('./views/report/financeReport.vue'),
    },
    { //AI模型接口
      path: "/modalUrlConfig",
      name: 'modalUrlConfig',
      component: () => import('./views/AI/modalUrlConfig.vue'),
    },
    { //影像数据审核
      path: "/examineImage",
      name: 'examineImage',
      component: () => import('./views/AI/examineImage.vue'),
    },
    { //AI算法
      path: "/getAlgorithm",
      name: 'getAlgorithm',
      component: () => import('./views/AI/getAlgorithm.vue'),
    },
    { //影像识别
      path: "/distinguish",
      name: 'distinguish',
      component: () => import('./views/AI/distinguish.vue'),
    },
    { //大数据管理
      path: "/bigdata",
      name: 'bigdata',
      component: () => import('./views/AI/bigdata.vue'),
    },
    { //AI图片管理
      path: "/imageManager",
      name: 'imageManager',
      component: () => import('./views/AI/imageManager.vue'),
    },
    { //首页图片管理
      path: "/bannerManager",
      name: 'bannerManager',
      component: () => import('./views/bannerManager.vue'),
    },
    { //月结算报表
      path: "/settleReport",
      name: 'settleReport',
      component: () => import('./views/report/settleReport.vue'),
    },
    { //查看检测报告
      path: "/InitSurvey",
      name: 'InitSurvey',
      component: () => import('./components/InitSurvey.vue'),
    },
    { //查看复查报告
      path: "/recheck",
      name: 'recheck',
      component: () => import('./components/recheck.vue'),
    },
    { //水印图片管理
      path: "/watermark",
      name: 'watermark',
      component: () => import('./views/watermark.vue'),
    },
    { //用户列表
      path: "/setproduct",
      name: 'setproduct',
      component: () => import('./views/setproduct.vue'),
    },
    { //拆装工程师管理
      path: "/engineer",
      name: 'engineer',
      component: () => import('./views/org/engineer.vue'),
    },
    { //集团管理
      path: "/groupInfoManage",
      name: 'groupInfoManage',
      component: () => import('./views/org/groupInfoManage.vue'),
    },
    {//月度营收
      path: '/monthRevenue',
      name: 'monthRevenue',
      component: () => import('./views/report/monthRevenue.vue'),
    },
    {//月度运营
      path: '/monthOperation',
      name: 'monthOperation',
      component: () => import('./views/report/monthOperation.vue'),
    },
    {//车型检测报告
      path: '/carModelAnalyze',
      name: 'carModelAnalyze',
      component: () => import('./views/report/carModelAnalyze.vue'),
    },
    {//检测中心运营
      path: '/queryAssessment',
      name: 'queryAssessment',
      component: () => import('./views/report/queryAssessment.vue'),
    },
    {//积碳维度报表
      path: '/queryExamine',
      name: 'queryExamine',
      component: () => import('./views/report/queryExamine.vue'),
    },
    {//集团周报不含治疗
      path: '/weekly1',
      name: 'weekly1',
      component: () => import('./views/report/weekly1.vue'),
    },
    {//集团周报含治疗
      path: '/weekly2',
      name: 'weekly2',
      component: () => import('./views/report/weekly2.vue'),
    },
    {//集团日报不含治疗
      path: '/daily1',
      name: 'daily1',
      component: () => import('./views/report/daily1.vue'),
    },
    {//集团日报含治疗
      path: '/daily2',
      name: 'daily2',
      component: () => import('./views/report/daily2.vue'),
    },
    {//检测中心统计日报
      path: '/JCReportDay',
      name: 'JCReportDay',
      component: () => import('./views/report/JCReportDay.vue'),
    },
    {//检测中心统计月报
      path: '/JCReportMonth',
      name: 'JCReportMonth',
      component: () => import('./views/report/JCReportMonth.vue'),
    },
    {// 数据中心统计日报
      path: '/DATAReportDay',
      name: 'DATAReportDay',
      component: () => import('./views/report/DATAReportDay.vue'),
    },
    {// 数据中心统计月报
      path: '/DATAReportMonth',
      name: 'DATAReportMonth',
      component: () => import('./views/report/DATAReportMonth.vue'),
    },
    { //对账查询
      path: "/financialRecord",
      name: 'financialRecord',
      component: () => import('./views/financials/financialRecord.vue'),
    },
    { //数据统计
      path: "/financialManage",
      name: 'financialManage',
      component: () => import('./views/financials/financialManage.vue'),
    },
    { //数据分析 基于财务数据
      path: "/financialAnalysis",
      name: 'financialAnalysis',
      component: () => import('./views/financials/financialAnalysis.vue'),
    },
    { //数据分析2 基于订单数据
      path: "/financialAnalysis2",
      name: 'financialAnalysis2',
      component: () => import('./views/financials/financialAnalysis2.vue'),
    },
    { //开站数据分析
      path: "/analysisOpen30Days",
      name: 'analysisOpen30Days',
      component: () => import('./views/financials/analysisOpen30Days.vue'),
    },
    { //月度汇总分析
      path: "/financialAnalysis3",
      name: 'financialAnalysis3',
      component: () => import('./views/financials/financialAnalysis3.vue'),
    },
    { //月度站点对比分析
      path: "/analysisMonthCompare",
      name: 'analysisMonthCompare',
      component: () => import('./views/financials/analysisMonthCompare.vue'),
    },
    { //站点累计数据 对比分析
      path: "/orgCountCompare",
      name: 'orgCountCompare',
      component: () => import('./views/financials/orgCountCompare.vue'),
    },
    
    ]
  },
  ]
})
