<template> 
<div :id="id" :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from "echarts";
import resize from "../../components/Charts/mixins/resize.js";

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
      default: "800px"
    }
  },
  data() {
    return {
      chart: null,
      timeArray: [],
      hbData:[ [],[],[]],
    };
  },
  mounted() {
    this.timeArray = this.caculateTime(30);
    this.hbData=this.generateNum();
    console.log(this.hbData);
  /*   console.log(this.timeArray, this.timeArray.length); */
     this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    generateNum(){
       var arr=[[],[],[]];
    for(var i=0;i<48;i++){
    arr[0].push(parseInt(Math.random()*40+50, 10));
    arr[1].push(parseInt(Math.random()*30+70, 10));
    arr[2].push(parseInt(Math.random()*30+70, 10))
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
       /*  y +
        "-" + */
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
    caculateTime(interval) {
      var dataNow =  Date.parse(new Date());
      var timeInterval = interval * 60 * 1000;
      var timeArr = [];
      for (var i = 0; i < 24*60/interval; i++) {
        timeArr.unshift(this.format(dataNow)); 
        dataNow = dataNow - timeInterval;
      }
      return timeArr;
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      var that = this;
      this.chart.setOption({
        backgroundColor: "#394056",
        title: {
          top: 20,
          text: '点名统计',
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
          data: ["就医趋势", "会见趋势", "实到情况"],
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
            name: "次",
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
            name: "就医趋势",
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
            name: "会见趋势",
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
          },{
            name: "实到情况",
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
                      color: "rgba(0, 136, 212, 0.3)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 136, 212, 0)"
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
                color: "rgb(0,136,212)",
                borderColor: "rgba(0,136,212,0.2)",
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
