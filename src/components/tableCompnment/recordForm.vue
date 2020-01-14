<template>
    <el-dialog width="700px" :visible.sync="isShowRecord" :before-close="handleClose">
        <el-table
                :data='redordData'
                :size='size'
                height="100%"
                :border  ='isBorder'
                v-loading='loading'
                :defaultSelections='defaultSelections'
                ref="redordTable">

            <!-- 数据栏 -->
            <el-table-column
                    v-for="item in redordCols"
                    :key="item.id"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :align="item.align"
                    :render-header="item.require?renderHeader:null"
            >
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
export default {
  name: 'operatingRecord',
  props: {
    that: { type: Object, default: this },
    // 表格型号：mini,medium,small
    size: {type: String, default: 'medium'},
    isBorder: {type: Boolean, default: true},
    loading: {type: Boolean, default: false},
    // 表格操作
    isHandle: {type: Boolean, default: false},
    tableHandles: {type: Array, default: () => []},
    // 表格数据
    redordData: {type: Array, default: () => []},
    // 表格列配置
    redordCols: {type: Array, default: () => []},
    isShowRecord: {type: Boolean, default: false},
    // 是否显示表格复选框
    isSelection: {type: Boolean, default: false},
    defaultSelections: {type: [Array, Object], default: () => null},
    // 是否显示表格索引
    isIndex: {type: Boolean, default: false},
    indexLabel: {type: String, default: '序号'},
    // 是否显示分页
    isPagination: {type: Boolean, efault: true},
    // 分页数据
    tablePage: {type: Object, default: () => ({pageSize: 10, pageNum: 1, total: 0})}
  },
  watch: {
    'defaultSelections' (val) {
      this.$nextTick(function () {
        if (Array.isArray(val)) {
          val.forEach(row => {
            this.$refs.redordTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.redordTable.toggleRowSelection(val)
        }
      })
    }
  },
  methods: {
    renderHeader (h, obj) {
      return h('span', {class: 'ces-table-require'}, obj.column.label)
    },
    handleClose () {
      // 分发自定义事件(事件名: closeTip)
      this.$emit('closeTip')
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
