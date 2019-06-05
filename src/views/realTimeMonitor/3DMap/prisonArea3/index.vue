<template>
    <div class="dashboard-editor-container">
        <div id="map-container"></div>
    </div>
</template>

<style lang="scss">
.popMarker {
    border: 1px solid #000;
    width: 300px;
    height: 230px;
    box-sizing: border-box;
    /* padding: 5px; */
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    p {
        width: 100%;
        box-sizing: border-box;
        padding-left: 20px;
        /* text-align: center; */
    }
    .myPopClose {
        position: absolute;
        top: 0;
        right: 0;
        width: 43px;
        height: 25px;
        text-align: center;
        background-color: honeydew;
        color: red;
        cursor: pointer;
    }
    button {
        width: 100px;
    }
}
</style>

<script>
import { getLocation, getInfo } from "@/api/location";

export default {
    name: "DashboardAdmin",
    components: {},

    data() {
        return {
            tm: "",
            layer: "",
            floorLayer: "",
            floorControl: "",
            coordIndex: 0,
            line: "",
            coordsData: [],
            timer: -1,
            prisonerTimer: null,
            coord: "",
            im: "",
            popMarker: "",
            prisonerId: '',
            prisonerName: "张三",
            prisonerHeartRate: "0",
            highblood: "0",
            lowblood: "0"
        };
    },
    // 清除定时器
    beforeDestroy() {
        let prisonerTimer = this.prisonerTimer
        clearTimeout(prisonerTimer)
    },
    mounted() {
        var _this = this;
        var coord;
        /**
         * createPerson 创建地图上的图片标记(人)
         * map: 地图对象
         * layer: 图片标记对象
         * floor: 楼层
         * x,y: 坐标
         * id: 人员id
         */
        function createPerson(map, layer, floor, x, y, id) {
            if (
                map == undefined ||
                layer == undefined ||
                floor == undefined ||
                x == undefined ||
                y == undefined ||
                id == undefined
            ) {
                console.log("漏传参数");
                return;
            }
            if (
                typeof floor != "number" ||
                typeof x != "number" ||
                typeof y != "number"
            ) {
                console.log("floor x y参数格式不是number类型");
                return;
            }
            _this.im = new esmap.ESImageMarker({
                // 后台搞错xy轴  前端调换
                x: map.center.x - 7.2 + x,
                y: map.center.y + 19.5 - y, //如果不添加x和y，则默认坐标在地图中心。
                url: "static/image/user.png", //图片标注的图片地址
                size: 64, //图片大小 或者 size:{w:32,h:64},
                spritify: true, //跟随地图缩放变化大小，默认为true，可选参数
                height: 1.2, //距离地面高度
                showLevel: 20, //地图缩放等级达到多少时隐藏,可选参数
                seeThrough: true, //是否可以穿透楼层一直显示,可选参数
                //angle:30,  	//如果设置了就是固定marker角度，与地图一起旋转。(size需要重新设置)
                // pId: id, //id，可自定义
                name: id, //name可自定义
                personId: id
            });
            layer.addMarker(_this.im); //将imageMarker添加到图层
            let floorLayer = map.getFloor(floor); //获取第一层的楼层对象
            floorLayer.addLayer(layer); //将图层添加到楼层对象
        }

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
            visibleFloors: [1, 2, 3] //初始显示楼层  如果使用默认的,首次加载会有人浮在空中的bug
        });
        map.openMapById("50015");
        var ctlOpt = new esmap.ESControlOptions({
            position: esmap.ESControlPositon.RIGHT_TOP,
            //注意：imgURL参数是static目录下图片的路径
            imgURL: "static/esmap/resource/style/wedgets/img/"
        });
        // 图片标记
        _this.layer = new esmap.ESLayer(esmap.ESLayerType.IMAGE_MARKER);
        // 地图加载完成事件
        map.on("loadComplete", function() {
            //创建楼层控件
            _this.floorControl = new esmap.ESScrollFloorsControl(map, ctlOpt);
        });

        // 监听点击地图上面房间 标记...事件
        map.on("mapClickNode", function(event) {
            // console.log(event); //此处打印处如上图（比如点击中房间）所示的调试信息
            // console.log(esmap.ESNodeType);
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
                    console.log(event);
                    if (_this.timer != -1) {
                        return;
                    }
                    _this.prisonerId = model.name_;
                    _this.coordIndex = 0;
                    _this.getPrisonerInfo(_this.prisonerId, request => {
                        if (request.code != 200) {
                            this.$message.error('请求失败');
                            return
                        }
                        _this.prisonerName = request.name;
                        if (request.data[0] == null) {
                            _this.prisonerHeartRate = '无信号'
                            _this.highblood = '无信号'
                            _this.lowblood = '无信号'
                        } else {
                            _this.prisonerHeartRate = request.data[0].heartbeat
                            _this.highblood = request.data[0].highblood
                            _this.lowblood = request.data[0].lowblood
                        }
                        //添加信息窗
                        var popMarker2 = new esmap.ESPopMarker({
                            mapCoord: {
                                //设置弹框的x轴
                                x: event.x_,
                                //设置弹框的y轴
                                y: event.y_,
                                height: 2, //控制信息窗的高度
                                //设置弹框位于的楼层
                                fnum: 1
                            },
                            className: "myPopMarker", //自定义popMarker样式。在css里配置
                            //设置弹框的宽度
                            width: 300,
                            //设置弹框的高度
                            height: 200,
                            marginTop: 10, //弹框距离地面的高度
                            //设置弹框的内容
                            content: `<div class="popMarker">
                                          <p>姓名 : ${_this.prisonerName}</p>
                                          <p>心率 : ${_this.prisonerHeartRate}</p>
                                          <p>低压 : ${_this.lowblood}</p>
                                          <p>高压 : ${_this.highblood}</p>
                                          <button class='viewingPath'>查看轨迹</button>
                                          <div class="myPopClose">关闭</div>
                                      </div>`,
                            closeCallBack: function() {
                                // alert('信息窗关闭了！');
                            },
                            created: function(e) {
                                //创建完成钩子
                                let closeBtn = document.querySelector(".myPopClose");
                                closeBtn.onclick = function() {
                                    _this.popMarker.hide();
                                };
                                let viewingPath = document.querySelector(".viewingPath");
                                viewingPath.onclick = function() {
                                    _this.$router.push({
                                        path: `/realTimeMonitor/3DMap/prisonArea3/${_this.prisonerId}`,
                                        query: { prisonerName: _this.prisonerName, id: _this.prisonerId, x: map.center.x, y: map.center.y }
                                    });
                                };
                            }
                        });
                        _this.popMarker = popMarker2;
                        _this.im.data_.popMarker = _this.popMarker;
                    });
                    if (_this.popMarker != "") {
                        _this.popMarker.close();
                    }
                    break;
                case esmap.ESNodeType.MODEL3D: //返回三维模型信息
                    console.log("返回三维模型信息");
                    break;
                case esmap.ESNodeType.LINE: //返回线信息
                    console.log("返回线信息");
                    break;
            }
        });

        // 监听楼层改变事件 渲染犯人坐标
        map.on("focusFloorNumChanged", function(e) {
            _this.floor = e;
            _this.getLocationList(e, response => {
                _this.layer.removeAll();
                if (response.success) {
                    let data = response.data;
                    for (let item of data) {
                        if (Object.prototype.toString.call(item) === "[object Object]") {
                            createPerson(map, _this.layer, e, item.x, item.y, item.identity);
                        }
                    }
                } else {
                    _this.$message.error('请求出错');
                }
            });
        });
    },
    methods: {
        getLocationList(floor, fun) {
            this.prisonerTimer = setInterval(() => {
                getLocation({ mapId: floor }).then(response => {
                    fun(response);
                });
            }, 1000);
        },

        getPrisonerInfo(id, fun) {
            getInfo({ criminalId: id }).then(response => {
                fun(response);
            });
        }
    }
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
}
</style>
