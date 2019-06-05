<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
    <!-- Form -->
    <el-dialog
      title="报警提示"
      :visible.sync="alarmArray[indexOfArray][0].dialogFormVisible"
      :close-on-click-modal="closeOnClickModal"
      :show-close="showClose"
      v-for="(valueOfArray,indexOfArray) in alarmArray"
      class="elDialog"
    >
      <div>
        <!--  <input type="text" id="ttsText"> -->
        <input
          type="button"
          id="tts_btn"
          @click="doTTS(indexOfArray)"
          value="播放"
          v-trigger
          v-startTrigger
          v-show="false"
        >
      </div>
      <div id="bdtts_div_id">
        <audio id="tts_autio_id" autoplay="autoplay"></audio>
      </div>
      <div class="formBoxAlarm">
        <el-form>
          <el-form-item label="当前提示不同时刻正在报警总数" class="totalAlarmNumRromItem">
            <el-input
              v-model="alarmArray.length"
              autocomplete="off"
              class="totalAlarmNum"
              width="50px"
              readonly="readonly"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          :model="alarmArray[indexOfArray][indexOfData]"
          v-for="(valueOfData,indexOfData) in alarmArray[indexOfArray]"
          class="elForm"
        >
          <el-form-item
            label="姓名"
            :label-width="formLabelWidth"
            v-if="alarmArray[indexOfArray][indexOfData].opinion==0&&alarmArray[indexOfArray][indexOfData].exceptionType!==0"
          >
            <el-input
              readonly="readonly"
              v-model="alarmArray[indexOfArray][indexOfData].userName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="身份证号"
            :label-width="formLabelWidth"
            v-if="alarmArray[indexOfArray][indexOfData].opinion==0&&alarmArray[indexOfArray][indexOfData].exceptionType!==0"
          >
            <el-input
              readonly="readonly"
              v-model="alarmArray[indexOfArray][indexOfData].cardId"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="异常描述"
            :label-width="formLabelWidth"
            class="borderBottom"
            v-if="alarmArray[indexOfArray][indexOfData].opinion==0&&alarmArray[indexOfArray][indexOfData].exceptionType!==0"
          >
            <el-input
              readonly="readonly"
              type="textarea"
              v-model="alarmArray[indexOfArray][indexOfData].describe"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button type="warning" @click="closeAlarm">一键关闭所有报警提示！</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { alarm } from "@/api/health";
import { setTimeout, setInterval } from "timers";
import Vue from "vue";
export default {
  name: "AppMain",
  data() {
    return {
      alarmArray: [],
      alarmData: [],
      formLabelWidth: "120px",
      closeOnClickModal: false,
      showClose: false,
      // left:Math.random()*100,
      voice: "",
      dialogFormVisible: true,
      timer: -1,
      // times: 0,
      mockResponseData: []
    };
  },
  created() {
    this.getList();
    // setTimeout(this.getList,1000);
    // this.getList();
    this.timer = setInterval(this.getList, 60000);
  },
  mounted() {
    // this.getList();
    // setTimeout(this.getList,1000);
    // 暂时注释掉，因为一直在请求
    // this.timer = setInterval(this.getList, 60000);
  },
  beforeDestroy() {
    let timer = this.timer;
    clearTimeout(timer);
  },
  //定义自动触发一次自动播报
  directives: {
    startTrigger: {
      bind: function(el, bindings) {
        el.click();
      }
    },
    trigger: {
      update: function(el, bindings) {
        el.click();
      }
    }
  },

  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    }
  },
  methods: {
    doTTS(indexOfArray) {
      // 以下注释掉的是用的百度语音接口，替换成responsivevoice.js
      // var ttsDiv = document.getElementById("bdtts_div_id");
      // var ttsAudio = document.getElementById("tts_autio_id");
      // 把每次请求回来的报警信息串联起来
      if (this.alarmArray.length > 0) {
        for (var i = 0; i < this.alarmArray[indexOfArray].length; i++) {
          this.judgeWhetherDeal(
            this.alarmArray[indexOfArray][i].exceptionType,
            i
          );
          if (
            this.alarmArray[indexOfArray][i].exceptionType !== 0 &&
            this.alarmArray[indexOfArray][i].opinion == 0
          ) {
            this.voice =
              this.voice +
              this.alarmArray[indexOfArray][i].userName +
              this.alarmArray[indexOfArray][i].describe;
          }
        }
        for (var i = 0; i < this.alarmArray[indexOfArray].length; i++) {
          this.alarmArray[indexOfArray][i].voice = this.voice;
        }
        this.voice = this.alarmArray[indexOfArray][0].voice;
        // console.log("a", this.times);
      }
      // 以下注释掉的是用的百度语音接口，替换成responsivevoice.js
      // var ttsText = this.voice;
      // // 这样就可实现播放内容的替换了
      // ttsDiv.removeChild(ttsAudio);
      // var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
      // var sss =
      //   '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=' +
      //   ttsText +
      //   '" type="audio/mpeg">';
      // var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
      // var au2 = "</audio>";
      // ttsDiv.innerHTML = au1 + sss + eee + au2;
      // console.log(ttsDiv);
      // ttsAudio = document.getElementById("tts_autio_id");
      // ttsAudio.play();
      responsiveVoice.speak(this.voice, "Chinese Female");
      this.voice = "";
    },

    confirm() {
      this.dialogVisible();
    },
    getList() {
      var that = this;
      alarm().then(response => {
        this.alarmData = response.data;
        // response.data没有数据的时候不进行下一步
        if (response.data.length > 0) {
          // 判断是不是请求的列表都是已经处理过的报警，如果是的话就直接返回
          var isAllDeal = true;
          for (var i = 0; i < response.data.length; i++) {
            if (
              response.data[i].opinion == 0 &&
              response.data[i].exceptionType !== 0
            ) {
              isAllDeal = false;
            }
          }
          if (isAllDeal == true) {
            return;
          }
          for (var i = 0; i < response.data.length; i++) {
            this.judgeWhetherDeal(response.data[i].exceptionType, i);
            // 如果是第一次请求或者是把所有弹框关闭后出现的第一条数据，就让它弹框出现，其他的后面的先都不出现
            if (this.alarmArray.length != 0) {
              this.alarmData[i].dialogFormVisible = false;
            } else {
              this.alarmData[i].dialogFormVisible = true;
            }
          }
          // 把每次请求获得的数据放到一个数组里面
          this.alarmArray.push(this.alarmData);
        }
        console.log("alarmArray", this.alarmArray);
      });
    },
    dialogVisible() {
      var that = this;
      // 点击确定的时候把alarmArray里面的第一条数据删除掉
      this.alarmArray.shift();
      console.log("confirma", this.alarmArray);
      if (this.alarmArray.length != 0) {
        // 删除掉一条以后把数组里面第一条数据的dialogFormVisible变为true
        for (var i = 0; i < this.alarmArray[0].length; i++) {
          // Vue.set(this.alarmArray[0][i],'dialogFormVisible',true); 解决一下问题并没起作用
          // this.$forceUpdate()解决this.alarmArray的值虽然发生变化，但是页面确不改变的问题
          this.alarmArray[0][i].dialogFormVisible = true;
          this.$forceUpdate();
        }

        console.log("confirmb", this.alarmArray);
      }
    },
    // 关闭所有报警
    closeAlarm() {
      this.alarmArray = [];
      this.$forceUpdate();
    },
    judgeWhetherDeal(deal, index) {
      // 1心率异常，2血压异常，3心率和血压异常，4设备低电量，5心率异常设备低电量，6血压异常设备低电量，7心率和血压异常，设备低电量
      if (deal == 0) {
        this.alarmData[index].describe = "";
      } else if (deal == 1) {
        this.alarmData[index].describe = "心率异常";
      } else if (deal == 2) {
        this.alarmData[index].describe = "血压异常";
      } else if (deal == 3) {
        this.alarmData[index].describe = "心率和血压异常";
      } else if (deal == 4) {
        this.alarmData[index].describe = "设备低电量";
      } else if (deal == 5) {
        this.alarmData[index].describe = "心率异常设备低电量";
      } else if (deal == 6) {
        this.alarmData[index].describe = "血压异常设备低电量";
      } else if (deal == 7) {
        this.alarmData[index].describe = "心率和血压异常，设备低电量";
      }
    }
  }
};
</script>

 <style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
.borderBottom {
  border-bottom: 1px solid lightgray;
  padding-bottom: 30px;
}
/* .el-input__inner.totalAlarmNum{
  width:40px;
  text-align: center;
} */
.totalAlarmNumRromItem {
  padding: 20px;
  display: flex;
  position: absolute;
  right: 30px;
  top: 0;
  .totalAlarmNum {
    width: 40px;
  }
}
.formBoxAlarm {
  max-height: 550px;
  overflow: auto;
}
</style>

