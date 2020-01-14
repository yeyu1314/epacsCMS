<template>
  <div id="warpping" style="width: 100%;height:100%;overflow: hidden;">
    <curnav></curnav>
    <div id="content">
      <transition>
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import net from "../assets/js/public";
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {
    var userInfo = JSON.parse(sessionStorage.getItem("signInfo"));
    var userId = userInfo.id;
    var token = userInfo.token;
    var url = net.wsUrl+"websocket/"+userId+"/"+token ;
    var ws = new WebSocket(url);
    ws.onopen = function()
    {
      ws.send("hello");
    };
    var _this = this;
    ws.onmessage = function(evt){
      sessionStorage.setItem("msgSign",1);
      var msg = JSON.parse(evt.data).msgContent;
      _this.$notify({
          title: '最新消息',
          message: msg,
          duration: 0,
          type: 'success'
      });
    };
    ws.onclose = function(){
      sessionStorage.setItem("msgSign",0);
      // _this.$notify({
      //     title: '最新消息',
      //     message: "登录状态已失效，请重新登录",
      //     duration: 0,
      //     type: 'warning',
      //     onClick:_this.onClick()
      // });
    };
    ws.onerror = function(){
      // _this.$notify.error({
      //     title: '最新消息',
      //     message: msg,
      //     duration: 0,
      //     type: 'warning'
      // });
    };
    
  },
  methods: {
    onClick(){
      var sign = sessionStorage.getItem("msgSign");
      if(sign == 0 ){
        window.location.href = net.signUrl;
      }
      if(sign == 0 ){
        this.$router.push({ path: "/completeOrder" });
      }
    }
  },
  components: {
    curnav: resolve => {
      require(["../components/indexnav"], resolve);
    }
  }
};
</script>
<style scoped>
#warping {
  width: 100%;
  overflow: hidden;
}
#content {
  /* position: absolute;
  top: 70px;
  left: 240px; */
  box-sizing: border-box;
  padding: 60px 10px 50px 230px;
  width: 100%;
  height: 100%;
  overflow: auto;
}
#content::-webkit-scrollbar-y {
  display: none;
}
</style>
