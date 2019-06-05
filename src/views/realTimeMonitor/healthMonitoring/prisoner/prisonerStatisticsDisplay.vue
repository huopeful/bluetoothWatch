<template> 
<div class='box'>
  <el-button type="primary" class='refresh' @click="refeshData">刷新为当前健康状态</el-button>
<div :id="id" :class="className" :style="{height:height,width:width}" v-loading="listLoading">
</div>
 
</div>
</template>
<script>
import echarts from "echarts";
import { getHealthDetail } from "@/api/health";
import resize from "../../../../components/Charts/mixins/resize.js";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "750px"
    }
  },
  data() {
    return {
      chart: null,
      timeArray: [],
      hbData:[ [],[],[]],
      starTime:'',
      endTime:'',
      listLoading: false
    };
  },
  mounted() {
    this.caculateTime();//计算心率血压的开始时间，结束时间
   /*  this.timeArray = this.caculateTimeInterval(); */
    this.getList();
    //this.hbData=this.generateNum();
    console.log('test',this.hbData);
  /*   console.log(this.timeArray, this.timeArray.length); */
     
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
        localStorage.removeItem('criminalId');

  },
  methods: {
    generateNum(b){
       var arr=[[],[],[]];
    for(var i=0;i<b.length;i++){
    arr[0].push(parseInt(b[i].heartbeat));
    arr[1].push(parseInt(b[i].lowblood));
    arr[2].push(parseInt(b[i].highblood));
    }
    return arr;
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return (
        y +
        "-" +
        this.add0(m) +
        "-" +
        this.add0(d) +
        " " +
        this.add0(h) +
        ":" +
        this.add0(mm) +
        ":" +
        this.add0(s)
      );
    },
    caculateTime() {
      var endTime=  Date.parse(new Date());
      // 七天内的心率血压
      var starTime= endTime-1*3600*1000;
      this.starTime=this.format(starTime);
      this.endTime=this.format(endTime);
      //this.starTime='2019-04-20 10:10:00'
      
    },
    refeshData(){
 this.caculateTime();//计算心率血压的开始时间，结束时间
   /*  this.timeArray = this.caculateTimeInterval(); */
    this.getList();
    },
    caculateTimeInterval(e) {
      /* var endTime =  Date.parse(new Date());
      var starTime= dataNow-24*3600*1000;
      var timeInterval = interval * 60 * 1000; */
      /* var starTime=this.starTime;
      var endTime=this.starTime;
      var timeArr = [];
      var interval=24*60*60*1000/length
      for (var i = 0; i < length; i++) {
        timeArr.unshift(this.format(endTime)); 
        endTime = endTime - interval;
      } */
      //timeArr.unshift(this.format(endTime));
      var timeArr = [];
      for (var i=0;i<e.length;i++){
        console.log('d',e[i].updatetime);
        timeArr.push(this.format(e[i].updatetime));
      }
      return timeArr;
    }, getList() {
      var that=this;
      that.listLoading = true;
      var formData = new FormData();
      formData.append('criminalId',localStorage.getItem('criminalId'));
      formData.append('starTime',this.starTime);
      formData.append('endTime',this.endTime);
      //this.listQuery.sort = "";
      getHealthDetail(formData).then(response => {
        that.timeArray = that.caculateTimeInterval(response.data);
        that.hbData=that.generateNum(response.data);
        console.log('c',that.hbData);
        console.log('b',that.timeArray);
        that.initChart();
        // Just to simulate the time of the request
        setTimeout(() => {
          that.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      var that = this;
      this.chart.setOption({
        backgroundColor: "#394056",
        title: {
          top: 20,
          text: '健康监控：心率（次/分）|血压低压（mmHg）|血压高压（mmHg）',
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            color: "#F1F1F3"
          },
          left: "1%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B"
            }
          }
        },
        legend: {
          top: 20,
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ["心率", "血压低压","血压高压"],
          right: "4%",
          textStyle: {
            fontSize: 12,
            color: "#F1F1F3"
          }
        },
        grid: {
          top: 100,
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#57617B"
              }
            },
            data: that.timeArray
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#57617B"
              }
            },
            axisLabel: {
              margin: 30,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: "#57617B"
              }
            }
          }
        ],
        series: [
          {
            name: "心率",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(137, 189, 27, 0.3)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(137, 189, 27, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(137,189,27)",
                borderColor: "rgba(137,189,2,0.27)",
                borderWidth: 12
              }
            },
            data:that.hbData[0]
          },
          {
            name: "血压低压",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 120, 212, 0.3)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 120, 212, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(0,120,212)",
                borderColor: "rgba(0,120,212,0.2)",
                borderWidth: 12
              }
            },
            data:that.hbData[1]
          
          }, {
            name: "血压高压",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(138, 120, 212, 0.3)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(138, 120, 212, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(138,120,212)",
                borderColor: "rgba(138,120,212,0.2)",
                borderWidth: 12
              }
            },
            data:that.hbData[2]
          
          }
        ]
      });
    }
  }
};
</script>
<style scoped>
.refresh.el-button{
margin-bottom:20px;
}
</style>
