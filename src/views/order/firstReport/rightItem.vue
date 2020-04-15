<template>
    <div>
        <p style="text-align:center;font-weight: bold;">综合维度</p>
        <div class="searchCon" style="margin-bottom: 20px;">
            <el-select
                    v-model="dimensionalityValue"
                    clearable
                    placeholder="请选择报告综合维度"
                    @change="dimensionalityChange"
                    class="f_select"
            >
                <el-option
                        v-for="item in dimensionality"
                        :key="item.value"
                        :label="item.laber"
                        :value="item.value"
                />
            </el-select>
            <el-button type="primary" class="search" size="mini" @click="submitDimensionality">保存</el-button>
        </div>
        <p style="text-align:center;font-weight: bold;">关联车型数据</p>
        <div class="searchCon">
            <el-select
                    v-model="value6"
                    clearable
                    placeholder="请选择区"
                    @change="areaChange"
                    class="f_select"
            >
                <el-option
                        v-for="item in areaArr"
                        :key="item.id"
                        :label="item.areaName"
                        :value="item.id"
                />
            </el-select>
            <el-select
                    v-model="value7"
                    clearable
                    placeholder="请选择省份"
                    @change="provinceChange"
                    class="f_select"
            >
                <el-option
                        v-for="item in provinceArr"
                        :key="item.id"
                        :label="item.provinceName"
                        :value="item.id"
                />
            </el-select>
            <el-select v-model="value8" clearable placeholder="请选择市/县" class="f_select">
                    <el-option
                            v-for="item in cityArr"
                            :key="item.id"
                            :label="item.cityName"
                            :value="item.id"
                    />
                </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "rightItem",
        data() {
            return {
                dimensionality : [// 增和维度下拉框
                    {id:2,laber:'轻微轻度',value:2},
                    {id:3,laber:'中度以上',value:3}
                ],
                dimensionalityValue: '', //综合维度
                value1: "",
                hostData: [], //主机厂商
                value2: "",
                audiData: [], //车系
                value3: "",
                carTypeData: [], //车型
                value4: "",
                value5: "", //部位
                value6: -1, //区
                areaArr: [], // 区下拉框
                value7: -1, //省
                provinceArr: [],
                value8: -1, //市县
                cityArr: [],
            }
        },
        methods : {
            dimensionalityChange() {

            },
            submitDimensionality() {

            },
            areaChange () {

            },
            provinceChange() {

            }
        }
    }
</script>

<style lang="less" scoped>

</style>