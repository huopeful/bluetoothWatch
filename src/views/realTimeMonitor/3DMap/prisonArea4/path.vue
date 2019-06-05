<template>
    <div class="dashboard-editor-container">
        <div id="map-container">
            <div id="select">
                <el-select v-model="selectDate" clearable placeholder="请选择日期" @change="changeDate">
                    <el-option v-for="item in dateList" :key="item.id" :label="item.shard" :value="item.shard"></el-option>
                </el-select>
            </div>
            <div id="slider">
                <el-slider v-model="timeInterval" range show-stops :min="0" :max="24" @change="changeTimeInterval"></el-slider>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.popMarker {
    border: 1px solid #000;
    width: 300px;
    height: 200px;
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

#select {
    position: absolute;
    left: 2%;
    top: 5%;
    z-index: 999;
}

#slider {
    position: absolute;
    left: 25%;
    top: 5%;
    z-index: 999;
    width: 50%;
}
</style>

<script>
import { getLocation, getTrajectory, getTrajectoryDateList } from "@/api/location";

export default {
    name: "DashboardAdmin",
    components: {},

    data() {
        return {
            dateList: [],
            selectDate: '',
            tm: "",
            layer: "",
            floorlayer: "",
            floorControl: "",
            coordIndex: 1,
            line: "",
            coordsData: [],
            timer: -1,
            coord: "",
            im: "",
            popMarker: "",
            prisonerId: "",
            prisonerName: "",
            prisonerHeartRate: "0",
            prisonerBloodPressure: "0",
            centere: '',
            // date: '2019_05_09',
            date: '',
            timeInterval: [0, 0],
            lastpoint: {},
            linecnt: 0,
            startTimeStamp: '',
            endTimeStamp: '',
            map: ''
        };
    },
    created() {
        this.prisonerName = this.$route.query.prisonerName;
        this.prisonerId = this.$route.query.id;
        this.x = this.$route.query.x;
        this.y = this.$route.query.y;
        this.getDateList()
    },
    mounted() {
        var _this = this;
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
        _this.map = map
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
        _this.render({ id: _this.prisonerId })
    },
    beforeDestroy() {
        // this.layer.removeAll();
        this.map.clearAllLineMark()
        clearInterval(this.timer);
    },
    methods: {
        getLocationList(floor, fun) {
            getLocation({ mapId: floor }).then(response => {
                fun(response);
            });
        },
        changeDate(val) {
            this.date = val;
            this.coordIndex = 1
            this.render({ id: this.prisonerId, date: val, startTime: this.startTimeStamp, endTime: this.endTimeStamp })
        },
        // 改变时间轴
        changeTimeInterval(val) {
            if (this.date == '') {
                this.$message({
                    message: '请先选择日期',
                    type: 'warning'
                });
                return
            } else {
                let date = this.date.replace(/_/g, "-")
                let startTime = date + ` ${val[0]}:00:00`
                let endTime = date + ` ${val[1]}:00:00`
                this.startTimeStamp = new Date(startTime).getTime();
                this.endTimeStamp = new Date(endTime).getTime();
                this.coordIndex = 1
                let data = {
                    id: this.prisonerId,
                    date: this.date,
                    startTime: this.startTimeStamp,
                    endTime: this.endTimeStamp
                }
                this.render(data)
            }

        },
        // 画线 begin
        drawLine(points) {
            let _this = this
            //配置线标注样式
            var lineStyle = {
                lineWidth: 3,
                alpha: 0.8,
                offsetHeight: 1,
                lineType: esmap.ESLineType.FULL
            };
            if (points.length && points.length <= 1) return;
            // map.clearLineMarkById("routes");
            //创建线标注对象
            _this.line = new esmap.ESLineMarker("routes", points, lineStyle);
            //调用地图的画线方法
            map.drawLineMark(_this.line);
        },
        updateCoord() {
            let _this = this
            var points = [];
            //实时刷新轨迹线
            var lastfnum = 0;
            _this.timer = setInterval(updated, 100);

            function updated() {
                if (_this.coordIndex >= _this.coordsData.length) {
                    //数据用完了，关掉定时器，清0
                    clearInterval(_this.timer);
                    _this.timer = -1;
                    if (lastfnum > 0)
                        map
                        .getFloor(lastfnum)
                        .removeLayersByTypes(esmap.ESLayerType.TEXT_MARKER);
                    return;
                }
                if (_this.coordIndex == 1) {
                    _this.lastpoint = _this.coordsData[0]
                    console.log(_this.lastpoint);
                }
                _this.coord = _this.coordsData[_this.coordIndex]; //取坐标点
                if (lastfnum != _this.coord.fnum) {
                    //切换层的时候先要清除之前层的Marker
                    if (lastfnum > 0)
                        map
                        .getFloor(lastfnum)
                        .removeLayersByTypes(esmap.ESLayerType.TEXT_MARKER);
                    _this.CreateMarker(
                        _this.coord.x,
                        _this.coord.y,
                        _this.coord.fnum,
                        _this.layer,
                        _this.floorlayer
                    );
                    lastfnum = _this.coord.fnum;
                }

                _this.tm.moveTo({
                    x: _this.coord.x,
                    y: _this.coord.y,
                    time: 0
                });
                if (_this.lastpoint) {
                    //判断是否与前一个点一样的坐标
                    if (Math.abs(_this.lastpoint.x - _this.coord.x) < 0.0001 && Math.abs(_this.lastpoint.y - _this.coord.y) < 0.0001) {
                        _this.coordIndex++;
                        return
                    } else {
                        _this.drawLine([_this.lastpoint, _this.coord], ++_this.linecnt);
                    }
                }
                _this.lastpoint = _this.coord;
                _this.coordIndex++;
            }
        },
        CreateMarker(x, y, fnum) {
            let _this = this
            //标注起始坐标点， 所在楼层
            _this.layer = new esmap.ESLayer("textMarker");
            _this.floorlayer = map.getFloor(fnum); // 所在楼层
            _this.tm = new esmap.ESTextMarker({
                x: x, //gpos1.x - 16
                y: y, //gpos1.y + 25
                name: _this.prisonerName,
                showLevel: 20,
                height: 0.5,
                image: "static/image/user.png",
                imageAlign: "bottom",
                imageSize: 50,
                seeThrough: true,
                spritify: true, //是否跟随地图缩放默认为true
                fillcolor: "1,6,7", //填充色
                fontsize: "8.0", //字体大小
                strokecolor: "255,255,0" //边框色
            });
            _this.layer.addMarker(_this.tm);
            _this.floorlayer.addLayer(_this.layer);
        },
        render(data) {
            let _this = this
            clearInterval(_this.timer);
            _this.map.clearAllLineMark()
            _this.layer.removeAll();
            // map.clearLineMarkById("routes");
            // 获取轨迹
            getTrajectory(data).then(response => {
                if (response.success) {
                    if (response.data.length == 0) {
                        _this.$message({
                            message: '没有数据',
                            type: 'warning'
                        });
                    } else {
                        for (let item of response.data) {
                            if (Object.prototype.toString.call(item) === "[object Object]") {
                                let x = _this.x - 7.2 + item.x
                                let y = +_this.y + 19.5 - +item.y
                                item.fnum = 1;
                                item.z = 1;
                                item.x = x;
                                item.y = y;
                                // item.offset = 2; //偏移量
                            }
                        }
                        _this.coordsData = response.data;
                        _this.updateCoord();
                    }
                } else {
                    console.log("请求出错");
                }
            });
        },
        getDateList() {
            getTrajectoryDateList().then(response => {
                if (response.success) {
                    this.dateList = response.data
                } else {
                    this.$message.error('获取时间列表失败');
                }
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
