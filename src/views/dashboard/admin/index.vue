<template>
  <div class="dashboard-editor-container">
    <!-- github -->
    <!-- <github-corner class="github-corner" /> -->

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->
    <div id="map-container"></div>
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>-->

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>-->

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
// import PanelGroup from './components/PanelGroup'
// import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145]
//   },
//   messages: {
//     expectedData: [200, 192, 120, 144, 160, 130, 140],
//     actualData: [180, 160, 151, 106, 145, 150, 130]
//   },
//   purchases: {
//     expectedData: [80, 100, 121, 104, 105, 90, 100],
//     actualData: [120, 90, 100, 138, 142, 130, 130]
//   },
//   shoppings: {
//     expectedData: [130, 140, 141, 142, 145, 150, 160],
//     actualData: [120, 82, 91, 154, 162, 140, 130]
//   }
// }

export default {
  name: "DashboardAdmin",
  components: {
    // GithubCorner,
    // PanelGroup,
    // LineChart,
    // RaddarChart,
    // PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },

  data() {
    return {
      // lineChartData: lineChartData.newVisitis
    };
  },
  mounted() {
    window.map = new esmap.ESMap({
      container: document.getElementById("map-container"), //地图初始化的容器
      //引入static目录下的地图和主题文件夹所在位置
      // 注意：
      // 1. 此处路径是文件夹的文件夹的位置，而不是文件的位置
      // 2. 引入的文件夹目录下应创建一个和 地图ID/主题名称 相同的文件夹放置数据
      //    例如: 地图ID是 test666 ；主题名称是 1004；那么目录结构应该是：
      // 地图数据目录   static/esmap/mapData/test666/test666.esmap
      // 主题目录      static/esmap/theme/1004/1004.theme
      mapDataSrc: "static/esmap/mapData/", //地图数据所在目录
      mapThemeSrc: "static/esmap/theme/", //地图主题所在目录
      themeID: 1002, //请确保主题目录下存在该主题的数据包
      // token应该填写在esmap官网创建该地图时所填写的token，每个地图ID对应一个唯一的token
      token: "escopebeidoutongxin",
      // defaultCenter:{x:0,y:0},
      viewMode: esmap.ESViewMode.MODE_3D, //初始二维还是三维状态
      visibleFloors: [1, 2, 3] //初始显示楼层  r如果使用默认的,首次加载会有人浮在空中的bug
    });
    map.openMapById("50015");

    var ctlOpt = new esmap.ESControlOptions({
      position: esmap.ESControlPositon.RIGHT_TOP,
      //注意：imgURL参数是static目录下图片的路径
      imgURL: "static/esmap/resource/style/wedgets/img/"
    });

    map.on("loadComplete", function() {
      //创建楼层控件
      var floorControl = new esmap.ESScrollFloorsControl(map, ctlOpt);
      //添加标注
      var lm = new esmap.ESLocationMarker({
        person: "1号",
        url: "static/image/user.png",
        size: 150,
        height: 30
      });
      console.log(lm);
      map.addLocationMarker(lm);
      //  原点 (map.center.x,map.center.y)
      lm.setPosition({
        x: map.center.x + 5,
        y: map.center.y,
        fnum: 1,
        height: 1 //离地面的偏移量
      });

      //添加标注
      var lm2 = new esmap.ESLocationMarker({
        url: "static/image/user.png",
        size: 100,
        height: 30
      });
      console.log(lm2);
      map.addLocationMarker(lm2);
      lm2.setPosition({
        x: 12684905.855303619,
        y: 2576353.5387200904,
        fnum: 1,
        height: 1 //离地面的偏移量
      });
    });
    map.on("mapClickNode", function(event) {
      console.log(event); //此处打印处如上图（比如点击中房间）所示的调试信息
      if (
        event.nodeType == esmap.ESNodeType.NONE ||
        event.nodeType == esmap.ESNodeType.FLOOR
      )
        return;
      var model = event;
      // if (!startPick) return;
      if (event.nodeType != esmap.ESNodeType.MODEL)
        model.o3d_.flash({
          scale: 1.3,
          time: 0.3
        }); //闪烁
      switch (event.nodeType) {
        case esmap.ESNodeType.MODEL: //返回房间信息
          map.storeSelect(model); //高亮
          console.log("返回房间信息");
          break;
        case esmap.ESNodeType.TEXT_MARKER: //返回文字POI信息
          console.log("返回文字POI信息");
          break;
        case esmap.ESNodeType.FACILITY: //返回图片POI信息
          console.log("返回图片POI信息");
          break;
        case esmap.ESNodeType.IMAGE_MARKER: //返回自写定义的图片信息
          console.log("返回自写定义的图片信息");
          break;
        case esmap.ESNodeType.MODEL3D: //返回三维模型信息
          console.log("返回三维模型信息");
          break;
        case esmap.ESNodeType.LINE: //返回线信息
          console.log("返回线信息");
          break;
      }
    });
  },
  methods: {
    // handleSetLineChartData(type) {
    //   this.lineChartData = lineChartData[type]
    // }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  // height: 800px;
  // height: 100%;
  height: calc(100vh - 100px);
  width: 100%;
  // height: auto;
  // padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  // .github-corner {
  //   position: absolute;
  //   top: 0px;
  //   border: 0;
  //   right: 0;
  // }

  // .chart-wrapper {
  //   background: #fff;
  //   padding: 16px 16px 0;
  //   margin-bottom: 32px;
  // }
}
#map-container {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}
</style>
