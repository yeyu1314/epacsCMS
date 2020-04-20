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
        :border='isBorder'
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
          <template slot-scope="scope">
            <!--数据换行-->
            <div v-if="item.type === 'longData'">
              <div v-for="longDataItem in longDatas" :key="longDataItem.id">
                <div v-if="longDataItem.jobId === scope.row.jobId">
                  <p v-for="item in longDataItem.note" :key="item.id">{{item}}</p>
                </div>
              </div>
            </div>

            <!-- 按钮--><!--一个单元格多个按钮         显示 / 隐藏           -->
            <template v-if="item.type==='button'">
              <div v-for="btnItem in newBtnList" :key="btnItem.id">
                <template v-if="btnItem.jobId === scope.row.jobId">
                  <el-button v-for="btn in btnItem.btnList" :key="btn.label"
                             :disabled="btn.disabled && btn.disabled(scope.row)"
                             :type="btn.type"
                             :size="btn.size || size"
                             :icon="btn.icon"
                             @click="btn.handle(that,scope.row)"
                             v-show="btn.isShow"
                  >{{btn.label}}
                  </el-button>
                </template>
              </div>
            </template>
            <!--一个单元格一个按钮         显示      -->
            <template v-if="item.type === 'Button'">
              <div v-for="btnItem in item.btnList" :key="btnItem.label" style="display: inline-flex">
                <el-button
                  :disabled="btnItem.disabled && btnItem.disabled(scope.row)"
                  :type="btnItem.type"
                  :size="btnItem.size || size"
                  :icon="btnItem.icon"
                  @click="btnItem.handle(that,scope.row)">{{btnItem.label}}
                </el-button>
              </div>
            </template>

            <!--@click="btn.handle(scope.row,btn.jobID)"-->
            <template v-if="item.type === 'checkButton'">
              <div v-for="btnItem in checkButtonList" :key="btnItem.id">
                <template v-if="btnItem.id === scope.row.id" >
                  <el-button v-for="btn in btnItem.btnList" :key="btn.id"
                             :disabled="btn.disabled && btn.disabled(scope.row)"
                             :type="btn.type"
                             :size="btn.size || size"
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
                <template v-if="btnItem.id === scope.row.id">
                  <el-button v-for="btn in btnItem.btnList" :key="btn.id"
                             :disabled="btn.disabled && btn.disabled(scope.row)"
                             :type="btn.type"
                             :size="btn.size || size"
                             :icon="btn.icon"
                             @click="btn.handle(that,scope.row)"
                             v-show="btn.isShow"
                  >{{btn.label}}
                  </el-button>
                </template>
              </div>
            </template>

            <template v-if="item.type === 'remarkButton'">
              <div v-for="btnItem in remarkButtonList" :key="btnItem.id">
                <template v-if="btnItem.id === scope.row.id">
                  <el-button v-for="btn in btnItem.btnList" :key="btn.id"
                             :disabled="btn.disabled && btn.disabled(scope.row)"
                             :type="btn.type"
                             :size="btn.size || size"
                             :icon="btn.icon"
                             @click="btn.handle(btn.allData,btn.jobID)"
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
            <el-select v-if="item.type==='select'" v-model="scope.row[item.prop]" :size="size || btn.size"
                       :props="item.props"
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
    <section class="ces-pagination" v-if='isPagination'>
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
  name: 'tableForm',
  props: {
    that: {type: Object, default: this},
    // 表格型号：mini,medium,small
    size: {type: String, default: 'medium'},
    isBorder: {type: Boolean, default: true},
    loading: {type: Boolean, default: false},
    // 表格操作
    isHandle: {type: Boolean, default: false},
    tableHandles: {type: Array, default: () => []},
    // 表格数据
    tableData: {type: Array, default: () => []},
    // 表格列配置
    tableCols: {type: Array, default: () => []},
    // 按钮列配置
    newBtnList: {type: Array, default: () => []},
    checkButtonList: {type: Array, default: () => []},
    reviewButtonList: {type: Array, default: () => []},
    remarkButtonList: {type: Array, default: () => []},
    // 是否显示表格复选框
    isSelection: {type: Boolean, default: false},
    defaultSelections: {type: [Array, Object], default: () => null},
    // 是否显示表格索引
    isIndex: {type: Boolean, default: false},
    indexLabel: {type: String, default: '序号'},
    // 是否显示分页
    isPagination: {type: Boolean, default: true},
    // 分页数据
    tablePage: {type: Object, default: () => ({pageSize: 10, pageNum: 1, total: 0})},
    // 多行数据
    longDatas: {type: Array, default: () => []}

  },
  data () {
    return {}
  },
  watch: {
    'defaultSelections' (val) {
      this.$nextTick(function () {
        if (Array.isArray(val)) {
          val.forEach(row => {
            this.$refs.cesTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.cesTable.toggleRowSelection(val)
        }
      })
    }
  },
  methods: {
    // 表格勾选
    select (rows, row) {
      this.$emit('select', rows, row)
    },
    // 全选
    selectAll (rows) {
      this.$emit('select', rows)
    },
    //
    handleCurrentChange (val) {
      this.tablePage.pageNum = val
      this.$emit('CurrentChange', val)
    },
    handleSizeChange (val) {
      this.tablePage.pageSize = val
      this.$emit('SizeChange', val)
    },

    // tableRowClassName({rowIndex}) {
    //     if (rowIndex % 2 === 0) {
    //         return "stripe-row";
    //     }
    //     return "";
    // }
    renderHeader (h, obj) {
      return h('span', {class: 'ces-table-require'}, obj.column.label)
    }
  }
}
</script>

<style scoped>
  .ces-table-require::before {
    content: '*';
    color: red;
  }
  .el-table__row td {
    text-align: center;
  }
  .has-gutter tr th {
    text-align: center;
  }
  .el-button {
    margin: 0 10px 10px 0 !important;
  }
  .el-table td, .el-table th {
    text-align: center !important;
  }
  .el-table__body-wrapper {
    height: 100% !important;
  }
</style>
