<!--
<template>
    <div class="tabletemplate">
        &lt;!&ndash; 动态显示隐藏列功能 &ndash;&gt;
        <el-dropdown
        v-if="selectColumns"
        :hide-on-click="false"
        @visible-change="dropdownSelectShow"
        class="el-dropdown-selectColumn"
        trigger="click"
        >
            <span class="dropdown-button" :style="theme.sysTheme.styleLevel4">
                <i
                    class="icon iconfont iconcaidan1"
                    :style="theme.sysTheme.colorLevel3"
                ></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="text-align: center;">
                &lt;!&ndash; <CheckboxGroup v-model="tableColumnsCheckedShow" @on-change="changeTableColumns"> &ndash;&gt;
                <div class="dropdowntable" style="text-align: left;">
                    <el-dropdown-item v-for="(item, index) in tableColumns" :key="index">
                        &lt;!&ndash; <Checkbox :label="item.title">{{item.title}}</Checkbox> &ndash;&gt;
                        <template>
                            <el-checkbox
                                :checked="item.isShow"
                                v-model="item.isShow"
                                @change="checkChange(item)"
                            >{{ item.title }}
                            </el-checkbox>
                        </template>
                    </el-dropdown-item>
                </div>
                &lt;!&ndash; <el-button
                  type="primary"
                  style="margin: auto;padding: 5px 15px;"
                  @click="buttonclick(tableColumns)"
                >确定</el-button> &ndash;&gt;
                &lt;!&ndash; </CheckboxGroup> &ndash;&gt;
            </el-dropdown-menu>
        </el-dropdown>

        <el-table
            :data="tableData"
            stripe
            border
            v-loading="loading"
            highlight-current-row
            :header-cell-style="{'background-color': headerBackColor,color: '#333'}"
            :cell-style="{'background-color': '#ffffff','border-color': cellBorderColor}"
            :row-style="{ border: 'none' }"
            show-overflow-tooltip
            style="width: 100%;margin-top: 0.24rem;"
            @selection-change="handleSelectionChange"
            ref="multipleTable"
        >
            &lt;!&ndash;选择&ndash;&gt;
            <el-table-column
                v-if="selectionShow"
                type="selection"
                align="center"
                :width="selectionWith"
                ></el-table-column>
            // 单选框，多选单选只能选则显示一个或者都不显示       // selectionShow  表格是够显示多选框
            <el-table-column v-if="radioShow && !selectionShow" :width="radioWidth">
                <template slot-scope="scope">
                    <el-radio
                        v-model="radioVal"
                        @change.native="getRow(scope.row)"
                    ></el-radio>
                </template>
            </el-table-column>
            &lt;!&ndash;序号 自定义列序号&ndash;&gt;
            <el-table-column
                v-if="indexShow"
                type="index"
                align="center"
                label="序号"
                fixed="left"
                :width="indexWidth"
            >
                <template slot-scope="scope">
                    <span>{{ (page - 1) * size + scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            &lt;!&ndash; :width="column.width ? column.width: ''" &ndash;&gt;
            &lt;!&ndash; 表格数据列 &ndash;&gt;
            <el-table-column
                align="center"
                v-for="column in tableColumns"
                v-if="selectColumns ? column.isShow || !isshowShow : true"
                :key="column.key"
                :label="column.title"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                  <span
                      v-if="scope.row.activeStatus === '在线'"
                      style="color:#13CE66"
                  >{{ scope.row.activeStatus }}</span
          >
                    &lt;!&ndash; <span v-else-if="scope.row.accessCode">
                      <span v-if="scope.row.accessCode === '3'"
                        >高于{{ scope.row.additionalRule }}分钟不得分</span
                      >
                      <span v-else-if="scope.row.accessCode === '4'">无</span>
                      <span v-else>低于{{ scope.row.additionalRule }}%不得分</span>
                    </span> &ndash;&gt;
                    <span v-else>{{ scope.row[column.key] }}</span>
                </template>
            </el-table-column>
            &lt;!&ndash;操作&ndash;&gt; // 操作按钮是否显示
            <el-table-column
            v-if="tableOperationShow"
            :width="operationColumnWidth"
            label="操作"
            align="center"
            fixed="right"
            >
            &lt;!&ndash; 操作列按钮的个数，名称，功能都是可以自定义的 &ndash;&gt;
            <template slot-scope="scope">
                &lt;!&ndash; <div class="tablecloumnview"> &ndash;&gt;
                <span
                        class="font-small font-color-light operationSpan"
                        v-if="viewDetail"
                        @click="tableOperationBtn1Handle(scope.row)"
                >{{ tableOperationText1 }}</span
                >
                <span
                        class="font-small font-color-light operationSpan"
                        v-if="linkLogin"
                        @click="tableOperationBtn2Handle(scope.row)"
                >{{ tableOperationText2 }}</span
                >
                <span
                        class="font-small font-color-light operationSpan"
                        v-if="linkLogout"
                        @click="tableOperationBtn3Handle(scope.row)"
                >{{ tableOperationText3 }}</span
                >
                &lt;!&ndash; </div> &ndash;&gt;
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
  import { mapGetters } from "vuex";
  // import createUpDeleteGive from "@/components/buttons/createUpDelGive"; // 按钮组件，很简单不做介绍
  export default {
    name: "tabletemplate",
    components: {
      // createUpDeleteGive
    },
    props: {
      headerBackColor: { // 表头背景颜色
        type: String,
        default: "#F5F5F5"
      },
      cellBackColor: { // 表格单元格背景颜色
        type: String,
        default: "#FFFFFF"
      },
      cellBorderColor: { // 表格单元格边框颜色
        type: String,
        default: "#E6E6E6"
      },
      selectColumns: { // 是否显示动态列功能，默认显示
        // 动态列功能
        type: Boolean,
        default: true
      },
      tableData: { // 表格数据
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
      tableColumns: { // 表格列数据
        type: Array,
        required: true,
        default: function() {
          return [];
        }
      },
      isshowShow: {
        // 是否控制列的动态显示 默认控制
        type: Boolean,
        default: true
      },
      page: {
        type: Number,
        default: 1
      },
      size: {
        type: Number,
        default: 10
      },
      selectionWith: {
        type: Number,
        required: false,
        default: 50
      },
      radioWidth: {
        type: Number,
        required: false,
        default: 40
      },
      operationColumnWidth: {
        // 表格操作列宽度
        type: Number,
        required: false,
        default: 100
      },
      indexWidth: {
        type: Number,
        required: false,
        default: 55
      },
      selectionShow: {
        // 多选   默认显示多选
        type: Boolean,
        default: true
      },
      radioShow: {
        // 单选 使用单选应将多选置为false
        type: Boolean,
        default: false
      },
      indexShow: {
        // 序号列
        type: Boolean,
        default: true
      },
      tableOperationShow: {
        // 最后操作列
        type: Boolean,
        required: false,
        default: false
      },
      linkLogin: {
        type: Boolean,
        required: false,
        default: false
      },
      linkLogout: {
        type: Boolean,
        required: false,
        default: false
      },
      viewDetail: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      },
      tableOperationText1: {
        type: String,
        default: "查看详情"
      },
      tableOperationText2: {
        type: String,
        default: "链路登录"
      },
      tableOperationText3: {
        type: String,
        default: "链路注销"
      }
    },
    data() {
      return {
        tableColumnsCheckedShow: [],
        radioVal: -1
      };
    },
    methods: {
      handleSelectionChange(val) {
        // console.log(val);
        this.$emit("handleSelectionChange", val);
      },
      tableOperationBtn1Handle(row) {
        this.$emit("tableOperationBtn1Handle", row);
      },
      tableOperationBtn2Handle(row) {
        this.$emit("tableOperationBtn2Handle", row);
      },
      tableOperationBtn3Handle(row) {
        this.$emit("tableOperationBtn3Handle", row);
      },
      checkChange(val) {
        console.log("checkChange");
        // console.log(val);
      },
      getRow(row) {
        // console.log(row);
        this.$emit("giveTableRowData", row);
      },
      buttonclick(row) {},
      reset() {
        this.radioVal = -1;
        this.$refs["multipleTable"].clearSelection();
      },
      dropdownSelectShow(val) {
        if (val === true) {
          // var mo = function(e) {
          //   e.preventDefault();
          // };
          // document.body.style.overflow = "hidden";
          // document.addEventListener("touchmove", mo, false); //禁止页面滑动
          var scorllbar = document.querySelector(".form-table-content");
          scorllbar.addEventListener(
            "scorll",
            function(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log("页面滚动事件");
              scorllbar.scrollTop = 0;
            },
            { passive: false }
          );
        }
      }
    },
    mounted() {},
    computed: {
      ...mapGetters(["currentNav", "theme"])
    }
  };
</script>
-->


<!--
<template>
    <div class="table">
        <el-table id="iTable" v-loading.iTable="options.loading" :data="list" :stripe="options.stripe"
                  ref="mutipleTable"
                  @selection-change="handleSelectionChange">
            &lt;!&ndash;region 选择框&ndash;&gt;
            <el-table-column v-if="options.mutiSelect" type="selection" style="width: 55px;">
            </el-table-column>
            &lt;!&ndash;endregion&ndash;&gt;
            &lt;!&ndash;region 数据列&ndash;&gt;
            <template v-for="(column, index) in columns">
                <el-table-column :prop="column.prop"
                                 v-if="column.isShow"
                                 :key='column.label'
                                 :label="column.label"
                                 :align="column.align"
                                 :width="column.width">
                    <template slot-scope="scope">
                        <template v-if="!column.render">
                            <template v-if="column.formatter">
                                <span v-html="column.formatter(scope.row, column)"></span>
                            </template>
                            <template v-else>
                                <span>{{scope.row[column.prop]}}</span>
                            </template>
                        </template>
                        <template v-else>
                            <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index"></expand-dom>
                        </template>
                    </template>
                </el-table-column>
            </template>
            &lt;!&ndash;endregion&ndash;&gt;
            &lt;!&ndash;region 按钮操作组&ndash;&gt;
            <el-table-column ref="fixedColumn" label="操作" align="center" :width="operates.width" :fixed="operates.fixed"
                             v-if="operates.list.filter(_x=>_x.show === true).length > 0">
                <template slot-scope="scope">
                    <div class="operate-group">
                        <template v-for="(btn, key) in operates.list">
                            <span class="item" v-if="btn.show" :key='btn.id'>
                                <el-button type="danger" :class="btn.className" size="mini" :disabled="btn.disabled"
                                           @click.native.prevent="btn.method(key,scope.row)">{{ btn.label }}
                                </el-button>
                            </span>
                        </template>
                    </div>
                </template>
            </el-table-column>
            &lt;!&ndash;endregion&ndash;&gt;
        </el-table>
        <div v-if="pageShow">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="1"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next"
                    :total="total"
                    background>
            </el-pagination>
        </div>
    </div>
</template>
&lt;!&ndash;endregion&ndash;&gt;
<script>
  export default {
    data(){
      return{

      }
    },
    props: {
      list: {
        type: Array,
        default: []
      }, // 数据列表
      columns: {
        type: Array,
        default: []
      }, // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽,isShow:是否显示
      operates: {}, // 操作按钮组 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
      options: {
        type: Object,
        default: {
          stripe: false, // 是否为斑马纹 table
          highlightCurrentRow: false // 是否要高亮当前行
        },
      }, // table 表格的控制参数
      total: {                // 所有条数
        type: Number,
        default: ()=>0
      },
      pageShow: {             //是否显示跳转页
        type: Boolean,
        default: true
      }
    },
//组件
    components: {
      expandDom: {
        functional: true,
        props: {
          row: Object,
          render: Function,
          index: Number,
          column: {
            type: Object,
            default: null
          }
        },
        render: (h, ctx) => {
          const params = {
            row: ctx.props.row,
            index: ctx.props.index
          }
          if (ctx.props.column) params.column = ctx.props.column
          return ctx.props.render(h, params)
        }
      }
    },
// 数据
    data () {
      return {
        pageIndex: 1,
        multipleSelection: [] // 多行选中
      }
    },
    mounted () {
    },
    computed: {
    },
    methods: {

      // 多行选中
      handleSelectionChange (val) {
        this.multipleSelection = val
        this.$emit('handleSelectionChange', val)
      },
      // 显示 表格操作弹窗
      showActionTableDialog () {
        this.$emit('handelAction')
      },
      handleSizeChange(val) {   //每页显示多少条
        this.$emit('sizeChange', val)
      },
      handleCurrentChange(val) {  //当前多少页
        this.$emit('currentPage', val)
      },
      clearSelection(){   //清除表格chekbox
        this.$refs.mutipleTable.clearSelection();
      }
    }
  }
</script>
<style >
    /*#iTable{*/
        /*.item{*/
            /*!*margin: 0px 2px;*!*/
            /*margin-right: 2px;*/
        /*}*/
    /*}*/
</style>
-->


<!--
<template>
    <div>
        <el-table
                v-loading="dataSource.loading"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                @sort-change="handleSort"
                :class="{ 'no-data': !dataSource.data || !dataSource.data.length }"
                v-bind="dataSource.autoHeight ? dataSource : Object.assign({ height }, dataSource)"
                ref="table"
        >
            &lt;!&ndash; 是否有多选 &ndash;&gt;
            <el-table-column
                    v-if="dataSource.isSelection"
                    :selectable="dataSource.selectable"
                    type="selection"
                    :width="dataSource.selectionWidth || 55">
            </el-table-column>
            &lt;!&ndash; 是否需要序号 &ndash;&gt;
            <el-table-column
                    v-if="dataSource.isIndex"
                    type="index"
                    label="序号"
                    width="55">
            </el-table-column>

            <template v-for="item in dataSource.cols">
                &lt;!&ndash; 表格的列展示 特殊情况处理 比如要输入框 显示图片 &ndash;&gt;
                <el-table-column
                        v-if="item.isTemplate"
                        :key="item.prop"
                        v-bind="item">
                    <template slot-scope="scope">
                        &lt;!&ndash; 比如要输入框 显示图片等等 自己定义 &ndash;&gt;
                        <slot :name="item.prop" :scope="scope"></slot>
                    </template>
                </el-table-column>
                &lt;!&ndash; 图片带tooltip &ndash;&gt;
                <el-table-column
                        v-if="item.isImagePopover"
                        :key="item.prop"
                        v-bind="item">
                    <template slot-scope="scope">
                        <el-popover
                                placement="right"
                                title=""
                                trigger="hover">
                            <div
                                    class="image-popover"
                                    :style="{'background-image': `url('${scope.row[scope.column.property]}')`}"></div>
                            <div
                                    slot="reference"
                                    class="reference-img"
                                    :style="{'background-image': `url('${scope.row[scope.column.property]}')`}"></div>
                            &lt;!&ndash; <img slot="reference" :src="scope.row[scope.column.property]" width="40px" height="40px"> &ndash;&gt;
                        </el-popover>
                    </template>
                </el-table-column>
                &lt;!&ndash; 大部分适用 &ndash;&gt;
                <el-table-column
                        v-if="!item.isImagePopover && !item.isTemplate && !item.invisible"
                        v-bind="item.isCodeTableFormatter ? Object.assign({ formatter: typeFormatter }, item) : item"
                        :key="item.prop">
                </el-table-column>
            </template>
            &lt;!&ndash; 是否有操作列 &ndash;&gt;
            &lt;!&ndash; 没有数据时候不固定列 &ndash;&gt;
            <el-table-column
                    :show-overflow-tooltip="dataSource.operation.overflowTooltip"
                    v-if="dataSource.isOperation"
                    v-bind="dataSource.data && dataSource.data.length ? { fixed: 'right' } : null"
                    style="margin-right:20px"
                    class-name="handle-td"
                    label-class-name="tc"
                    :width="dataSource.operation.width"
                    :label="dataSource.operation.label"
            >
                &lt;!&ndash; UI统一一排放3个，4个以上出现更多 &ndash;&gt;
                <template slot-scope="scope">
                    &lt;!&ndash; 三个一排的情况，去掉隐藏的按钮后的长度 &ndash;&gt;
                    <template
                            v-if="dataSource.operation.data.length < 4">
                        <el-button
                                v-for="(item,index) in dataSource.operation.data"
                                v-bind="item"
                                :key="item.label"
                                type="text"
                                size="small"
                                @click.native.prevent="handleRow(scope.$index, scope.row, item.label)">
                            {{ item.label }}
                        </el-button>
                    </template>
                    &lt;!&ndash; 4个以上的情况 &ndash;&gt;
                    <template v-else>
                        &lt;!&ndash; 三个一排 &ndash;&gt;
                        <el-button
                                v-for="(item,index) in dataSource.operation.data.slice(0,3)"
                                :key="item.label"
                                type="text"
                                size="small"
                                @click.native.prevent="handleRow(scope.$index, scope.row, item.label)">
                            {{ item.label }}
                        </el-button>
                        &lt;!&ndash; 三个以上出现更多 &ndash;&gt;
                        <el-dropdown >
                            <i class='iconmore pointer iconfont'></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                        v-for="(item,index) in dataSource.operation.data.slice(3,dataSource.operation.data.length)"
                                        :key="item.label"
                                        @click.native.prevent="handleRow(scope.$index, scope.row, item.label)"> {{ item.label }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  export default {
    // 接收父组件传递过来的值
    props: {
      //  表格数据和表格部分属性的对象
      dataSource: {
        type: Object,
      }
    },
    watch: {
      'dataSource.cols': { // 监听表格列变化
        deep: true,
        handler () {
          // 解决表格列变动的抖动问题
          this.$nextTick(this.$refs.table.doLayout)
        }
      }
    }
  }
</script>-->



<!--表格组件 -->
<template>
    <section class="ces-table-page">
        <!-- 表格操作按钮 -->
        <section class="ces-handle" v-if='isHandle'>
            <el-button
                v-for='item in tableHandles'
                :key='item.label'
                :size="size || item.size"
                :type="item.type"
                :icon='item.icon'
                @click="item.handle(that)">{{item.label}}
            </el-button>
        </section>
        <!-- 数据表格 -->
        <section class="ces-table">
            <el-table
                 :data='tableData'
                 :size='size'
                  height="100%"
                 style="width: 100%;height: 100%"
                 :border  ='isBorder'
                 @select='select'
                @select-all='selectAll'
                v-loading='loading'
                :defaultSelections='defaultSelections'
                ref="cesTable">
                // 复选框
                <!--<el-table-column v-if="isSelection" type="selection" align="center" ></el-table-column>-->
                // 序号
                <!--<el-table-column v-if="isIndex" type="index" :label="indexLabel" align="center" width="50"></el-table-column>-->
                <!-- 数据栏 -->
                <el-table-column
                     v-for="item in tableCols"
                     :key="item.id"
                     :prop="item.prop"
                     :label="item.label"
                     :width="item.width"
                     :align="item.align"
                     :render-header="item.require?renderHeader:null"
                >
                    <template slot-scope="scope" >
                        <!--数据换行-->
                        <div v-if="item.type === 'longData'">
                            <div v-for="longDataItem in longDatas" :key="longDataItem.id">
                                <div v-if="longDataItem.id === scope.row.id">
                                    <p v-for="item in longDataItem.note" :key="item.id">{{item}}</p>
                                </div>
                            </div>
                        </div>

                        <!-- 按钮--><!--一个单元格多个按钮         显示 / 隐藏           -->
                        <div v-for="btnItem in newBtnList" :key="btnItem.id">
                            <template v-if="item.type==='button' && btnItem.id === scope.row.id" >
                                <el-button v-for="btn in btnItem.btnList" :key="btn.label"
                                           :disabled="btn.disabled && btn.disabled(scope.row)"
                                           :type="btn.type"
                                           :size="size || btn.size"
                                           :icon="btn.icon"
                                           @click="btn.handle(that,scope.row)"
                                           v-show="btn.isShow"
                                >{{btn.label}}
                                </el-button>
                            </template>
                        </div>
                        <!--一个单元格一个按钮         显示      -->
                        <template v-if="item.type === 'Button'">
                            <el-button v-for="btnItem in item.btnList" :key="btnItem.label"
                                    :disabled="btnItem.disabled && btnItem.disabled(scope.row)"
                                   :type="btnItem.type"
                                   :size="size || btnItem.size"
                                   :icon="btnItem.icon"
                                   @click="btnItem.handle(that,scope.row)">{{btnItem.label}}
                            </el-button>
                        </template>

                        <!--@click="btn.handle(scope.row,btn.jobID)"-->
                        <template v-if="item.type === 'checkButton'">
                             <div v-for="btnItem in checkButtonList" :key="btnItem.id">
                                <template v-if="btnItem.id === scope.row.id" >
                                    <el-button v-for="btn in btnItem.btnList" :key="btn.id"
                                               :disabled="btn.disabled && btn.disabled(scope.row)"
                                               :type="btn.type"
                                               :size="size || btn.size"
                                               :icon="btn.icon"
                                               @click="btn.handle(that,scope.row)"
                                               v-show="btn.isShow"
                                    >{{btn.label}}
                                    </el-button>
                                </template>
                            </div>
                        </template>

                        <template v-if="item.type === 'reviewButton'">
                             <div v-for="btnItem in reviewButtonList" :key="btnItem.id">
                                <template v-if="btnItem.id === scope.row.id" >
                                    <el-button v-for="btn in btnItem.btnList" :key="btn.id"
                                               :disabled="btn.disabled && btn.disabled(scope.row)"
                                               :type="btn.type"
                                               :size="size || btn.size"
                                               :icon="btn.icon"
                                               @click="btn.handle(that,scope.row)"
                                               v-show="btn.isShow"
                                    >{{btn.label}}
                                    </el-button>
                                </template>
                            </div>
                        </template>
                        <!-- @click="btn.handle(btn.allData,btn.jobID)"-->
                        <template v-if="item.type === 'remarkButton'">
                             <div v-for="btnItem in remarkButtonList" :key="btnItem.id">
                                <template v-if="btnItem.id === scope.row.id" >
                                    <el-button v-for="btn in btnItem.btnList" :key="btn.id"
                                               :disabled="btn.disabled && btn.disabled(scope.row)"
                                               :type="btn.type"
                                               :size="size || btn.size"
                                               :icon="btn.icon"
                                               @click="btn.handle(that,scope.row)"
                                               v-show="btn.isShow"
                                    >{{btn.label}}
                                    </el-button>
                                </template>
                            </div>
                        </template>

                        <!-- html -->
                        <span v-if="item.type==='html'" v-html="item.html(scope.row)"></span>
                        <!-- 输入框 -->
                        <el-input v-if="item.type==='input'" v-model="scope.row[item.prop]" :size="size || btn.size"
                              :disabled="item.isDisabled && item.isDisabled(scope.row)"
                              @focus="item.focus && item.focus(scope.row)">
                        </el-input>
                        <!-- 下拉框 -->
                        <el-select v-if="item.type==='select'" v-model="scope.row[item.prop]" :size="size || btn.size"  :props="item.props"
                                   :disabled="item.isDisabled && item.isDisabled(scope.row)"
                                   @change='item.change && item.change(that,scope.row)'>
                        <el-option v-for="op in item.options" :label="op.label" :value="op.value" :key="op.value"></el-option>
                        </el-select>
                        <!-- 单选 -->
                        <el-radio-group v-if="item.type==='radio'" v-model="scope.row[item.prop]"
                                        :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size"
                                        @change='item.change && item.change(that,scope.row)'>
                            <el-radio v-for="ra in item.radios" :label="ra.value" :key="ra.value">{{ra.label}}</el-radio>
                        </el-radio-group>
                        <!-- 复选框 -->
                        <el-checkbox-group v-if="item.type==='checkbox'" v-model="scope.row[item.prop]"
                                           :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size"
                                           @change='item.change && item.change(that,scope.row)'>
                            <el-checkbox v-for="ra in item.checkboxs" :label="ra.value" :key='ra.value'>{{ra.label}}</el-checkbox>
                        </el-checkbox-group>
                        <!-- 评价 -->
                        <el-rate v-if="item.type==='rate'" v-model="scope.row[item.prop]"
                                 :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size"
                                 @change='item.change && item.change(scope.row)'></el-rate>
                        <!-- 开关 -->
                        <el-switch v-if="item.type==='switch'" v-model="scope.row[item.prop]" :size="size || btn.size"
                                   :active-value='item.values&&item.values[0]'
                                   :inactive-value='item.values&&item.values[1]'
                                   :disabled="item.isDisabled && item.isDisabled(scope.row)"
                                   @change='item.change && item.change(scope.row)'></el-switch>
                        <!-- 图像 -->
                        <img v-if="item.type==='image'" :src="scope.row[item.prop]" @click="item.handle && item.handle(scope.row)"/>
                        <!-- 滑块 -->
                        <el-slider v-if="item.type==='slider'" v-model="scope.row[item.prop]"
                                   :disabled="item.isDisabled && item.isDisabled(scope.row)" :size="size || btn.size"
                                   @change='item.change && item.change(scope.row)'></el-slider>
                        <!-- 默认 -->
                        <span v-if="!item.type"
                              :style="item.itemStyle && item.itemStyle(scope.row)" :size="size || btn.size"
                              :class="item.itemClass && item.item.itemClass(scope.row)">{{(item.formatter && item.formatter(scope.row)) || scope.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </section>
        <!-- 分页 -->
        <section class="ces-pagination"  v-if='isPagination'>
            <el-pagination style='display: flex;justify-content: center;height: 100%;align-items: center;margin-top: 20px;'
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   background
                   layout="total,sizes ,prev, pager, next, jumper"
                   :page-size="tablePage.pageSize"
                   :current-page="tablePage.pageNum"
                   :total="tablePage.total"
            ></el-pagination>
        </section>
    </section>
</template>

<script>

  export default {
    props:{
      that: { type: Object, default: this },
      // 表格型号：mini,medium,small
      size:{type:String,default:'medium'},
      isBorder:{type:Boolean,default:true},
      loading:{type:Boolean,default:false},
      // 表格操作
      isHandle:{type:Boolean,default:false},
      tableHandles:{type:Array,default:()=>[]},
      // 表格数据
      tableData:{ type:Array,default:()=>[]},
      // 表格列配置
      tableCols:{ type:Array,default:()=>[]},
      //按钮列配置
      newBtnList : { type:Array,default:()=>[]},
      checkButtonList : { type:Array,default:()=>[]},
      reviewButtonList : { type:Array,default:()=>[]},
      remarkButtonList : { type:Array,default:()=>[]},
      // 是否显示表格复选框
      isSelection:{type:Boolean,default:false},
      defaultSelections:{ type:[Array,Object], default:()=>null},
      // 是否显示表格索引
      isIndex:{type:Boolean,default:false},
      indexLabel: {type:String,default:'序号'},
      // 是否显示分页
      isPagination:{type:Boolean,default:true},
      // 分页数据
      tablePage:{ type:Object,default:()=>({pageSize:10,pageNum:1,total:0})},
      //多行数据
      longDatas: { type:Array,default:()=>[]},


    },
    data(){
      return {
      }
    },
    watch:{
      'defaultSelections'(val) {
        this.$nextTick(function(){
          if(Array.isArray(val)){
            val.forEach(row=>{
              this.$refs.cesTable.toggleRowSelection(row)
            })
          }else{
            this.$refs.cesTable.toggleRowSelection(val)
          }
        })
      }
    },
    methods:{
      // 表格勾选
      select(rows,row){
        this.$emit('select',rows,row);
      },
      // 全选
      selectAll(rows){
        this.$emit('select',rows)
      },
      //
      handleCurrentChange(val){
        this.tablePage.pageNum = val;
        this.$emit('CurrentChange',val);
      },
      handleSizeChange(val) {
        this.tablePage.pageSize = val;
        this.$emit('SizeChange',val);
      },

      // tableRowClassName({rowIndex}) {
      //     if (rowIndex % 2 === 0) {
      //         return "stripe-row";
      //     }
      //     return "";
      // }
      renderHeader(h,obj) {
        return h('span',{class:'ces-table-require'},obj.column.label)
      },
    },
  }
</script>
<style>
    .ces-table-require::before{
        content:'*';
        color:red;
    }
    .el-table__row td {
        text-align: center;
    }
    .has-gutter tr th {
        text-align: center;
    }
    .el-table__body-wrapper {
        height: 100% !important;
    }
    .el-button {
        margin: 0 10px 10px 0 !important;
    }

</style>



<!--
<template>
    <div class="table">
        <el-table id="iTable" v-loading.iTable="options.loading" :data="list" :stripe="options.stripe"
                  ref="mutipleTable" @selection-change="handleSelectionChange" border>
            &lt;!&ndash;选择框&ndash;&gt;
            <el-table-column v-if="options.mutiSelect" type="selection" style="width: 55px;">
            </el-table-column>
            &lt;!&ndash;end&ndash;&gt;
            &lt;!&ndash;数据列&ndash;&gt;
            <template v-for="(column, index) in columns">
                <el-table-column :prop="column.prop" :key='column.label' :label="column.label" :align="column.align"
                                 :width="column.width">
                    <template slot-scope="scope">
                        <template v-if="!column.render">
                            <template v-if="column.formatter">
                                <span v-html="column.formatter(scope.row, column)"></span>
                            </template>
                            <template v-else>
                                <span>{{scope.row[column.prop]}}</span>
                            </template>
                        </template>
                        <template v-else>
                            <expand-dom :column="column" :row="scope.row" :render="column.render" :index="index">
                            </expand-dom>
                        </template>
                    </template>
                </el-table-column>
            </template>
            &lt;!&ndash;end&ndash;&gt;
            &lt;!&ndash;按钮操作组&ndash;&gt;
            <el-table-column ref="fixedColumn" label="操作" align="center" :width="operates.width" :fixed="operates.fixed"
                             v-if="operates.list.filter(_x=>_x.show === true).length > 0">
                <template slot-scope="scope">
                    <div class="operate-group">
                        <template v-for="(btn, key) in operates.list">
                            <div class="item" v-if="btn.show" :key='btn.id'>
                               &lt;!&ndash; <span :style="btn.style" size="mini" :class="btn.class" :plain="btn.plain"
                                      @click="btn.method(key,scope.row)">{{ btn.label }}
                                </span>&ndash;&gt;
                                 <el-button :type="btn.type" size="mini" :icon="btn.icon" :disabled="btn.disabled"
                                    :plain="btn.plain" @click.native.prevent="btn.method(key,scope.row)">{{ btn.label }}
                                </el-button>
                            </div>
                        </template>
                    </div>
                </template>
            </el-table-column>
            &lt;!&ndash;end&ndash;&gt;
        </el-table>
    </div>
</template>
&lt;!&ndash;end&ndash;&gt;
<script>
  import { mapGetters } from 'vuex';
  export default {
    props: {
      list: {
        type: Array,
        default: []
      }, // 数据列表
      columns: {
        type: Array,
        default: []
      }, // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
      operates: {}, // 操作按钮组 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
      options: {
        type: Object,
        default: {
          stripe: false, // 是否为斑马纹 table
          highlightCurrentRow: false // 是否要高亮当前行
        },
      } // table 表格的控制参数
    },
    //组件
    components: {
      expandDom: {
        functional: true,
        props: {
          row: Object,
          render: Function,
          index: Number,
          column: {
            type: Object,
            default: null
          }
        },
        render: (h, ctx) => {
          const params = {
            row: ctx.props.row,
            index: ctx.props.index
          }
          if (ctx.props.column) params.column = ctx.props.column
          return ctx.props.render(h, params)
        }
      }
    },
    // 数据
    data() {
      return {
        pageIndex: 1,
        multipleSelection: [], // 多行选中

      }
    },
    mounted() { },
    computed: {},
    methods: {

      // 多行选中
      handleSelectionChange(val) {
        this.multipleSelection = val
        this.$emit('handleSelectionChange', val)
      },
      // 显示 表格操作弹窗
      showActionTableDialog() {
        this.$emit('handelAction')
      }
    },

  }
</script>
<style>
    .operate-group {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
</style>

-->
