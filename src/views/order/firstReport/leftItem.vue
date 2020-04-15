<template>
    <div>
        <p style="margin:190px 0 0 0;font-size: 20px;">*检测结果模板</p>
        <div class="radio-box">
            <p class="radio-title">进气道</p>
            <el-radio-group v-model="radio1" class="radio-content" @change="radio1Change">
                <el-radio v-for="(item,i) in radio1Item" :key="i" :label="item" :title='item'>{{item}}</el-radio>
            </el-radio-group>
        </div>
        <div class="radio-box">
            <p class="radio-title">进气阀</p>
            <el-radio-group v-model="radio2" class="radio-content" @change="radio2Change">
                <el-radio v-for="(item,i) in radio2Item" :key="i" :label="item" :title='item'>{{item}}</el-radio>
            </el-radio-group>
        </div>
        <div class="radio-box">
            <p class="radio-title">喷油嘴</p>
            <el-radio-group v-model="radio3" class="radio-content" @change="radio3Change">
                <el-radio v-for="(item,i) in radio3Item" :key="i" :label="item" :title='item'>{{item}}</el-radio>
            </el-radio-group>
        </div>
        <div class="radio-box">
            <p class="radio-title">活塞顶</p>
            <el-radio-group v-model="radio4" class="radio-content" @change="radio4Change">
                <el-radio v-for="(item,i) in radio4Item" :key="i" :label="item" :title='item'>{{item}}</el-radio>
            </el-radio-group>
        </div>
        <div class="radio-box">
            <p class="radio-title">缸壁</p>
            <el-radio-group v-model="radio5" class="radio-content" @change="radio5Change">
                <el-radio v-for="(item,i) in radio5Item" :key="i" :label="item" :title='item'>{{item}}</el-radio>
            </el-radio-group>
        </div>
        <el-input
                class="repostCon"
                type="textarea"
                :autosize="{ mixRows: 6}"
                placeholder="请选择检测结果"
                v-model="opinion"
                style="width:217px;"
                disabled
        />
        <div class="arrow" @click="adviseArrow">
            <img src="../../../assets/img/1.png" alt />
        </div>
        <div class="ctroArrow">
            <span style="font-size: 14px;    height: 36px;line-height: 36px;">箭头：</span>
            <el-tooltip :content="isShowArrow" placement="top" class="derail">
                <el-switch
                        v-model="isShowArrow"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="不打印"
                        inactive-value="打印"
                        active-text="不打印"
                        inactive-text="打印"
                >></el-switch>
            </el-tooltip>
        </div>
    </div>
</template>

<script>
    export default {
        name: "leftItem",
        data() {
            return {
                radio1: '',
                radio1Item : ["进气道露出金属光泽；","进气道部分区域露出金属光泽；","进气道没有金属光泽露出；"],
                radio2 : '',
                radio2Item : ["进气阀阀杆和阀座露出金属色泽；","进气阀阀杆露出金属色泽，阀座无金属色泽露出；","进气阀阀杆和阀座无金属色泽露出；"],
                radio3 : '',
                radio3Item : ["喷油嘴及喷孔可见；","喷油嘴喷孔部分可见；","喷油嘴喷孔不可见；"],
                radio4 : '',
                radio4Item : ["活塞顶大部分区域露出金属色泽；","活塞顶部分区域有金属色泽露出；","活塞顶没有金属色泽露出；"],
                radio5 : '',
                radio5Item : ["缸壁未见异常划痕。","缸壁有轻微划痕。","缸壁有深度划痕。"],
                opinion: "",
                isShowArrow: "不打印", //打印是否显示箭头
            }
        },
        methods : {
            radio1Change(val) {
                this.radio1 = val
                this.opinion = this.radio1+this.radio2+this.radio3+this.radio4+this.radio5;
            },
            radio2Change(val) {
                this.radio2 = val
                this.opinion = this.radio1+this.radio2+this.radio3+this.radio4+this.radio5;
            },
            radio3Change(val) {
                this.radio3 = val
                this.opinion = this.radio1+this.radio2+this.radio3+this.radio4+this.radio5;
            },
            radio4Change(val) {
                this.radio4 = val
                this.opinion = this.radio1+this.radio2+this.radio3+this.radio4+this.radio5;
            },
            radio5Change(val) {
                this.radio5 = val
                this.opinion = this.radio1+this.radio2+this.radio3+this.radio4+this.radio5;
            },
            adviseArrow() {
                // this.advise = this.opinion;
                this.Bus.$emit('listenToA', this.opinion)
                console.log(this.opinion)
            },
        }
    }
</script>

<style lang="less" scoped>
    .ctroArrow {
        display: flex;
        margin-top: 15px;
        margin-left: 20px;
        p {
            font-size: 14px;
        }
        .derail {
            margin-top: 8px;
            margin-left: 10px;
        }
    }
</style>