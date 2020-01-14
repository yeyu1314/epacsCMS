/*
 * @Author: mikey.zhaopeng
 * @Date: 2018-11-28 11:22:51
 * @Last Modified by: caohenghui
 * @Last Modified time: 2019-08-26 15:03:20
 */
import $http from "axios";

// 本地测试服务
let baseUrl = "http://127.0.0.1:8080/";
let signUrl = "http://127.0.0.1:80/";
let imgUrl = "http://127.0.0.1:8081/image/get?imageId=";
let bigImg = "http://127.0.0.1:8081/image/getLarge?imageId=";
let imageHP = "http://127.0.0.1:8081/";
let wsUrl = "ws://127.0.0.1:8080/";


let axios = $http;

// 添加请求拦截器
$http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
function getCookie(name) {
    console.log("获取cookieTTT");
    var arr1, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    arr1 = document.cookie.match(reg)
    if (arr1)
        return unescape(arr1[2]);
    else
        return null;
}
function delCookie(name) {
    console.log(name)
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
// 添加响应拦截器
$http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    var status = error.response.status;
    if (status == 401) {
        delCookie("signInfo")
        sessionStorage.clear();
        window.location.href = signUrl;
        return false;
    }
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default {
    /**
     *
     * @param {接口地址} url
     * @param {请求方式} method
     * @param {参数}  data
     */
    request(url, method, params, data) {
        var addr = baseUrl + url;
        var param = params || (params = {});
        var sign = JSON.parse(this.getCookie("signInfo"));
        var token;
        if (sign) {
            token = sign.token;
        }
        return new Promise((resolve, reject) => {
            $http.request({
                method: method,
                url: addr,
                data: data,
                params: param,
                headers: {
                    "token": token
                }
            }).then(res => {
                let _res = res.data;
                resolve(_res);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    baseUrl,
    axios,
    signUrl,
    imgUrl,
    imageHP,
    bigImg,
    wsUrl,
    /**
     *
     * @param {接口地址} url
     * @param {请求方式} method
     * @param {参数}  data
     */
    request2(url, method, params, data) {
        var addr = imageHP + url;
        var param = params || (params = {});
        var sign = JSON.parse(this.getCookie("signInfo"));
        var token;
        if (sign) {
            token = sign.token;
        }
        // console.log(token)
        return new Promise((resolve, reject) => {
            $http.request({
                method: method,
                url: addr,
                data: data,
                params: param,
                headers: {
                    "token": token
                }
            }).then(res => {
                let _res = res.data;
                resolve(_res);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    //提示
    message(_this, title, type) {
        _this.$message({
            showClose: true,
            message: title,
            type: type
        });
        return false;
    },
    //格式化时间
    dateFormat(timestamp, sign) {
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        var s = ':' + (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        if (sign == 0) {
            return Y + M + D;

        } if (sign == 1) {
            return Y + M + D + h + m;

        } else {
            return Y + M + D + h + m + s;
        }
    },
    //时间转13转时间戳
    dateToTimestamp(val) {
        var date = new Date(val);
        // 有三种方式获取
        var time1 = date.getTime();
        return time1;
    },
    // 深拷贝数组
    copy(array) {
        let newArray = []
        for (let item of array) {
            newArray.push(item);
        }
        return newArray;
    },
    //是否有权限跳转下一级菜单
    isJump(val) {
        var list = JSON.parse(sessionStorage.getItem("navList")).data;
        var flag = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == 1001) {
                var subMenu = list[i].subMenu;
                console.log(subMenu)
                for (var j = 0; j < subMenu.length; j++) {
                    if (val == subMenu[j].subRouteName) {
                        flag = true;
                    }
                }
            }
        }
        return flag;
    },
    GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天前的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期
        var d = dd.getDate();
        return y + "" + (m < 10 ? ('0' + m) : m) + "" + (d < 10 ? ('0' + d) : d);
    },
    printServer(content, callback, w = null, h = null) {
        callback = callback || function () { };
        // Fixes dual-screen position                         Most browsers      Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
        w = +w === 0 ? width : w;
        h = +h === 0 ? height : h;
        const left = ((width / 2) - (w / 2)) + dualScreenLeft;
        const top = ((height / 2) - (h / 2)) + dualScreenTop;
        var myWindow = window.open("", "打印", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
        var style = "<style type='text/css'>table.gridtable {font-family: verdana,arial,sans-serif;font-size:11px;color:#333333;border-width: 1px;border-color: #666666;border-collapse: collapse;}table.gridtable th {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #dedede;}table.gridtable td {border-width: 1px;padding: 8px;border-style: solid;border-color: #666666;background-color: #ffffff;}</style>";
        myWindow.document.write(content + style);
        myWindow.focus();
        myWindow.document.close(); //关闭document的输出流, 显示选定的数据
        callback(myWindow)
        // myWindow.print();   //打印当前窗口
        // return myWindow;
    },
    // 存cookie
    setCookie(name, value, days) {
        var Days = days || 1;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookie(name) {
        var arr1, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        arr1 = document.cookie.match(reg);
        if (arr1) {
            return unescape(arr1[2]);
        }
        else
            return null;
    },
    delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}
