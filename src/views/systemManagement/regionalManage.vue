<template>
  <div class="formBox">
    <h3>区域注册:</h3>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="floor">
        <el-input v-model="form.floor" label-width="50px"></el-input>
      </el-form-item>
      <div class="border"></div>
      <div class="macMessage">
        <el-button @click="handleAddMac">添加一条mac信息</el-button>
        <el-button @click="handleDeleteMac">删除一条mac信息</el-button>
      </div>
    </el-form>
    <el-form ref="btsMaps[item-1]" :model="btsMaps.value" label-width="80px" v-for="item in addMac">
      <el-form-item label="mac">
        <el-input v-model="btsMaps[item-1].mac"></el-input>
      </el-form-item>
      <el-form-item label="x">
        <el-input v-model="btsMaps[item-1].x"></el-input>
      </el-form-item>
      <el-form-item label="y">
        <el-input v-model="btsMaps[item-1].y"></el-input>
      </el-form-item>
      <el-form-item label="z">
        <el-input v-model="btsMaps[item-1].z"></el-input>
      </el-form-item>
    </el-form>
    <div class="border"></div>
    <el-form ref="translate" :model="translate" label-width="80px">
      <el-form-item label="dx">
        <el-input v-model="translate.dx"></el-input>
      </el-form-item>
      <el-form-item label="dy">
        <el-input v-model="translate.dy"></el-input>
      </el-form-item>
      <el-form-item label="dz">
        <el-input v-model="translate.dz"></el-input>
      </el-form-item>
      <el-form-item label="flipx">
        <el-input v-model="translate.flipX"></el-input>
      </el-form-item>
      <el-form-item label="flipy">
        <el-input v-model="translate.flipY"></el-input>
      </el-form-item>
      <el-form-item label="flipz">
        <el-input v-model="translate.flipZ"></el-input>
      </el-form-item>
      <el-form-item label="xoy">
        <el-input v-model="translate.xoy"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即注册</el-button>
      </el-form-item>
      <div class="border"></div>
    </el-form>
    <el-form :inline="true" label-width="100px">
      <h3>区域删除:</h3>
      <el-form-item label="floor">
        <el-input
          v-model="floor"
          label-width="50px"
          @blur="handleGetlogiclist"
          placeholder="请先填写floor"
        ></el-input>
      </el-form-item>
      <el-form-item label="mapId">
        <el-select v-model="mapId" placeholder="mapId">
          <el-option :label="key" :value="key" v-for="(value,key,index) in mapIdObj"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleDeleteRegional">删除楼层地图区域</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { logicarea, clearArea, logiclist } from "@/api/systemManagement";
export default {
  name: "RegionalManage",
  data() {
    return {
      form: {
        floor: ""
        /*  mac: "",
        x: "",
        y: "",
        z: "" */
      },
      btsMaps: [],
      translate: {
        dx: "",
        dy: "",
        dz: "",
        flipX: "",
        flipY: "",
        flipZ: "",
        xoy: ""
      },
      addMac: [],
      index: 0,
      mapId: "",
      mapIdObj: {},
      floor: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    onSubmit() {
      logicarea({
        floor: this.form.floor,
        btsMaps: this.btsMaps,
        translate: this.translate
      })
        .then(response => {
          this.$notify({
            title: "成功",
            message: "创建成功",
            type: "success",
            duration: 2000
          });
        })
        .catch(err => {
          this.$notify({
            title: "失败",
            message:
              "创建失败，基站已经绑定区域或者基站数量异常（至少4个基站）",
            type: "error",
            duration: 3000
          });
        });
    },
    handleAddMac() {
      this.addMac.push(this.index + 1);
      this.index = this.index + 1;
      var obj = {
        mac: "",
        x: "",
        y: "",
        z: ""
      };
      this.btsMaps.push(obj);
    },
    handleDeleteMac() {
      this.addMac.pop();
      this.btsMaps.pop();
      if (this.index > 1 || this.index == 1) this.index = this.index - 1;
    },
    handleDeleteRegional() {
      if (
        JSON.stringify(this.mapIdObj) !== "{}" &&
        Object.keys(this.mapIdObj).length !== 0
      ) {
        clearArea({
          mapId: this.mapId
        }).then(response => {
          (this.mapId = ""), this.handleGetlogiclist();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000
          });
        });
      }else{
        this.mapId=''
      }
    },
    handleGetlogiclist() {
      if (this.floor) {
        logiclist({
          floor: this.floor
        }).then(response => {
          this.mapId='';
          this.mapIdObj = response.data;
          
        });
      } else {
        this.mapIdObj = {};
        this.mapId='';
      }
    },
    removeDumplicateMapId(data) {
      /* for(){

    } */
    }
  }
};
</script>
<style scoped>
.formBox {
  width: 800px;
  height: auto;
  margin-top: 44px;
}
.macMessage {
  margin-left: 100px;
  margin-bottom: 50px;
}
.border {
  width: 100%;
  height: 1px;
  border-bottom: 1px solid lightgray;
  margin-bottom: 30px;
  margin-left: 30px;
}
h3 {
  margin-left: 30px;
}
</style>
