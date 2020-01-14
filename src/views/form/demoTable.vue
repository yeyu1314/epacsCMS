<template>
    <ces-table
            :that='that'
            size='small '
            :isSelection='true'
            :isIndex='true'
            :isHandle='true'
            :tableData='tableDataDemo'
            :tableCols='tableColsDemo'
            :newBtnList="newBtnListDemo"
            :isPagination='true'
            :tablePage='paginationDemo'
            :longDatas="longDatasDemo"
            :checkButtonList="checkButtonListDemo"
            :reviewButtonList="reviewButtonListDemo"
            :remarkButtonList="remarkButtonListDemo"
    >

    </ces-table>
</template>

<script>
  import cesTable from './compomentTable'
  import {mapActions,mapState} from 'vuex'
  import moment from 'moment'
  export default {
    name: "demoTable",
    components : {cesTable},
    data () {
      return  {

      }
    },
    created(){
        this.getData()
    },
    methods : {
      ...mapActions(['getData',])
    },
    computed : {
      ...mapState(['that', 'tableDataDemo', 'tableColsDemo','newBtnListDemo','paginationDemo','longDatasDemo',
        'checkButtonListDemo','reviewButtonListDemo','remarkButtonListDemo'
      ]),
    },
  };
</script>

<style scoped>

</style>
