<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
    <div class="voicePlay" v-for="(value,index) in alarmArray" :style="'left:'+ left" v-if='alarmArray[index][0].dialogVisible'>
      <div class='shade' v-if='alarmArray[index][0].dialogVisible'></div>
      <div>
        <input type="text" id="ttsText">
        <input type="button" id="tts_btn" @click="doTTS(index)" value="播放">
      </div>
      <div id="bdtts_div_id">
        <audio id="tts_autio_id" autoplay="autoplay">
        </audio>
      </div>
      <div class='alarmMessage' >
        <el-form ref="alarmArray[index][index2]" :model="alarmArray[index][index2]" label-width="80px"  v-for="(value,index2) in alarmArray[index]" class='form'>
  <el-form-item label="姓名">
    <el-input v-model="alarmArray[index][index2].name"></el-input>
  </el-form-item>
        </el-form>
      </div>
      <div class="confirm" @click='confirm(index)'>确定</div>
    </div>
  </section>
</template>

<script>
import { alarm} from "@/api/health";
export default {
  name: "AppMain",
  data() {
    return {
      alarmArray:[],
      alarmData:[],
      form:{
        name:'李四',
      },
      // left:Math.random()*100,
      left:'50%',
      voiceArray: [
        { text: "巴士" },
        { text: "快车" },
        { text: "专车" },
        { text: "顺风车" },
        { text: "出租车" },
        { text: "代驾" }
      ],
      voice:'',
      times:0
    };
  },
  created() {
    this.getList();
    this.getList();
    this.getList();
  },
  mounted(){

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
    getVoice() {
      //获取声音文字信息
      // this.dialogFormVisible=true;
      this.doTTS();
    },
    doTTS(index) {
      var ttsDiv = document.getElementById("bdtts_div_id");
      var ttsAudio = document.getElementById("tts_autio_id");
      var ttsText = this.alarmArray[index][0].voice;
      

      // 这样就可实现播放内容的替换了
      ttsDiv.removeChild(ttsAudio);
      var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
      var sss =
        '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=' +
        ttsText +
        '" type="audio/mpeg">';
      var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
      var au2 = "</audio>";
      ttsDiv.innerHTML = au1 + sss + eee + au2;
      console.log(ttsDiv);
      ttsAudio = document.getElementById("tts_autio_id");
      ttsAudio.play();
    },
    open() {
      this.$alert("这是一段内容", "标题名称", {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "info",
            message: `action: ${action}`
          });
        }
      });
    },
    confirm(index,index2) {
      for(var i=0;i<this.alarmArray[index].length;i++){
this.alarmArray[index][i].dialogVisible=true;
      }
      
      this.alarmArray.shift();
      console.log('now',this.alarmArray);
     for(var i=0;i<this.alarmArray[0].length;i++){
this.alarmArray[0][i].dialogVisible=true;
      }
      
      
    },
    getList(){
       alarm().then(response => {
         //每次请求如果有数据的话才把报警信息放进数组
         if(response.data.length>1||response.data.length==1){
        //  暂时放在这区分第一次请求和第二次请求
         this.times=this.times+1;
         this.alarmData=response.data;
        //  把同一时间不同人的报警声音串联起来一起报警
         for(var i=0;i<response.data.length;i++){
           this.voice=this.voice+response.data[i].name+response.data[i].describe;
         }
          //  暂时放在这区分第一次请求和第二次请求
         this.voice=this.voice+this.times;
        //  确保不同时间的报警信息不一样（因为如果不这样可能最后得到的都是this.voice也就是最后一个人的报警信息）
         for(var i=0;i<response.data.length;i++){
          this.alarmData[i].voice=this.voice;
          // 关闭一个弹出以后才显示下一个弹窗
          if(this.alarmArray.length!==0){
if(this.alarmArray[0][0].dialogVisible==true){
          this.alarmData[i].dialogVisible=false;
          }else{
            this.alarmData[i].dialogVisible=true;
          }
          }else{
            this.alarmData[i].dialogVisible=true;
          }
          
         }
        //  每次重新请求是清空原来报警声音
         this.voice='';
        //  把不同时间所有人的报警信息放在一个数组里面
         
           this.alarmArray.push(this.alarmData);
           console.log('alarmArray',this.alarmArray);
         }
        
      });
    }
  }
};
</script>

 <style lang="scss" scoped>
// .app-main {
//   /* 50= navbar  50  */
//   min-height: calc(100vh - 50px);
//   width: 100%;
//   position: relative;
//   overflow: hidden;
// }

// .fixed-header + .app-main {
//   padding-top: 50px;
// }

// .hasTagsView {
//   .app-main {
//     /* 84 = navbar + tags-view = 50 + 34 */
//     min-height: calc(100vh - 84px);
//   }

//   .fixed-header + .app-main {
//     padding-top: 84px;
//   }
// }
// .voicePlay {
//   position: absolute;
//   margin-left: 500px;
//   width: 600px;
//   height: auto;
//   margin-left: -300px;
//   border: 1px solid lightgray;
//   min-height: 200px;
//   background-color: white;
//   top:30%;
//   z-index: 100;
// }
// .confirm {
//   position: absolute;
//   width: 40px;
//   height: 30px;
//   line-height: 30px;
//   text-align: center;
//   border: 1px solid lightgrey;
//   right: 20px;
//   bottom: 20px;
// }
// .shade{
//   background:rgba(54, 55, 58, 0.5);
//   position: fixed;
//   top:0;
//   bottom:-200px;
//   left:0;
//   right:0;
//   z-index: 0;
// }
// </style>

