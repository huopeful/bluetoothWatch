<template>
  <div class="dashboard-editor-container">
    <div id="map-container">
      <button class="btnDemo">11</button>
    </div>
  </div>
</template>

<script>
import { getLocation } from "@/api/location";
export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    var layer;
    var floorControl;
    var polygonMarker;
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
      themeID: 1004, //请确保主题目录下存在该主题的数据包
      // token应该填写在esmap官网创建该地图时所填写的token，每个地图ID对应一个唯一的token
      token: "escope",
      // defaultCenter:{x:0,y:0},
      viewMode: esmap.ESViewMode.MODE_3D, //初始二维还是三维状态
      visibleFloors: [1, 2, 3] //初始显示楼层  如果使用默认的,首次加载会有人浮在空中的bug
    });
    map.openMapById("test666");

    var ctlOpt = new esmap.ESControlOptions({
      position: esmap.ESControlPositon.RIGHT_TOP,
      //注意：imgURL参数是static目录下图片的路径
      imgURL: "static/esmap/resource/style/wedgets/img/"
    });
    // 地图加载完成事件
    map.on("loadComplete", function() {
      //创建楼层控件
      floorControl = new esmap.ESScrollFloorsControl(map, ctlOpt);
      var floor = map.getFloor(map.focusFloorNum);
      console.log(map.focusFloorNum);
      layer = floor.getOrCreateLayerByName(
        "poly",
        esmap.ESLayerType.POLYGON_MARKER
      );
      //创建自定义形状标注
      function addMyPolygonMaker() {
        //创建PolygonMarker自定义形状的顶点数组
        var coords = [
          { x: map.center.x, y: map.center.y, z: 1 },
          { x: map.center.x + 5, y: map.center.y + 5, z: 1 },
          { x: map.center.x + 5, y: map.center.y + 10, z: 1 }
        ];
        polygonMarker = new esmap.ESPolygonMarker({
          //设置透明度
          alpha: 0.5,
          //设置边框线的宽度
          lineWidth: 1,
          //设置高度
          height: 1,
          //设置多边形坐标点
          points: coords
        });
        layer.addMarker(polygonMarker);
      }
      addMyPolygonMaker();
    });

    // 监听点击地图上面房间 标记...事件
    map.on("mapClickNode", function(event) {
      console.log(event); //此处打印处如上图（比如点击中房间）所示的调试信息
      console.log(event.hitCoord); // 点击的xy坐标
      console.log(esmap.ESNodeType); // 点击的元素类型
      if (
        event.nodeType == esmap.ESNodeType.NONE ||
        event.nodeType == esmap.ESNodeType.FLOOR
      ) {
        return;
      }
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

    // 监听楼层改变事件
    map.on("focusFloorNumChanged", function(e) {});
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  height: calc(100vh - 100px);
  width: 100%;
  background-color: rgb(240, 242, 245);
  position: relative;
}
#map-container {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  .btnDemo {
    position: absolute;
    left: 2%;
    bottom: 5%;
  }
}
</style>
