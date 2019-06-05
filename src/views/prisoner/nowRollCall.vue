<template>
  <div class="container">
    <div class="rollPositionBox">
      <div class="rollPositionBoxLeft">
        <div class="pentagonTop">
          <div class="pentagonBottom"></div>
          <div class="pentagonText">实到</div>
        </div>
      </div>
      <div class="rollPositionBoxLeft rollPositionBoxRight">
        <div class="pentagonTop">
          <div class="pentagonBottom"></div>
          <div class="pentagonText">会见</div>
        </div>
      </div>
       <div class="rollPositionBoxLeft rollPositionBoxTop">
        <div class="pentagonTop">
          <div class="pentagonBottom"></div>
          <div class="pentagonText">留医</div>
        </div>
      </div>
       <div class="rollPositionBoxLeft rollPositionBoxBottom">
        <div class="pentagonTop">
          <div class="pentagonBottom"></div>
          <div class="pentagonText">其他</div>
        </div>
      </div>
      <div class='rollPositionBoxCenter'>应到</div>
    </div>
    <div class="tab-container">
      <!-- <el-tag>mounted times ：{{ createdTimes }}</el-tag>
      <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />-->
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
        <el-tab-pane
          v-for="item in tabMapOptions"
          :key="item.key"
          :label="item.label"
          :name="item.key"
        >
          <keep-alive>
            <tab-pane v-if="activeName==item.key" :type="item.key" @create="showCreatedTimes"/>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import tabPane from "./components/TabPaneNowRollCall.vue";

export default {
  name: "NowRollCall",
  components: { tabPane },
  data() {
    return {
      tabMapOptions: [
        { label: "实到", key: "CN" },
        { label: "会见", key: "US" },
        { label: "留医", key: "JP" },
        { label: "其他", key: "EU" },
        { label: "未绑定", key: "aa" },
        { label: "无信号", key: "bb" }
      ],
      activeName: "CN",
      createdTimes: 0
    };
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1;
    }
  }
};
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
.rollPositionBox {
  position: relative;
  min-width: 300px;
  height: 360px;
  border: 1px solid gray;
  margin: 30px;
  border-radius: 50%;
  background-color: #5edfdf;
  margin: 60px;
  margin-right: 30px;
  margin-top:90px;
}
.container {
  display: flex;
  flex-direction: row;
}
.rollPositionBoxLeft {
  position: absolute;
  top: 50%;
  margin-top: -45px;
  margin-left: -44px;
  text-align: center;
  width: 88px;
  height: 90px;
  color: white;
  line-height: 90px;
  z-index: 100;
}
.pentagonTop {
  position: absolute;
  width: 0;
  height: 40px;
  border-left: 44px solid transparent;
  border-right: 44px solid transparent;
  border-bottom: 40px solid #035c03;
  z-index: 0;
}
.pentagonBottom {
  position: absolute;
  top: 40px;
  left: -44px;
  width: 88px;
  border-width: 50px 18px 0;
  border-style: solid;
  border-color: #035c03 transparent;
  z-index: 0;
}
.pentagonText {
  position: absolute;
  top: 0;
  left: -44px;
  width: 88px;
  text-align: center;
}
.rollPositionBoxRight{
  right:0;
  margin-right:-44px;
}
.rollPositionBoxTop{
  top:0;
  margin-top:-45px;
  left:50%;
  margin-left:-44px;
}
/* .rollPositionBoxTop .pentagonTop,.pentagonBottom{
border-color:rebeccapurple transparent;
} */
.rollPositionBoxLeft.rollPositionBoxBottom{
  top:100%;
  margin-top:-45px;
  left:50%;
  margin-left:-44px;
}
.rollPositionBoxCenter{
  position: absolute;
  width:100px;
  height:120px;
  line-height: 120px;
  text-align: center;
  color:white;
  border-radius: 50%;
  background-color: #035c03;
  top:50%;
  left:50%;
  margin-top:-60px;
  margin-left:-50px;
  z-index: 1;
  /* border: 1px solid white; */

}

.rollPositionBoxLeft:hover .pentagonTop{
border-bottom-color: #047904;
}
.rollPositionBoxLeft:hover .pentagonBottom{
border-color: #047904 transparent;
}
.rollPositionBoxCenter:hover{
background-color: #047904;
}
</style>
