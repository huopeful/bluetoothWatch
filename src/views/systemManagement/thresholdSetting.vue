<template>
  <div class="formBox">
    <el-form ref="formList" :model="formList" label-width="200px">
      <h3>当前阈值信息：</h3>
      <div class="contentClassify">
        <el-form-item label="心率低阈值">
          <el-input v-model="formList.heartBeatLower" label-width="50px" class="elInput" readonly></el-input>
        </el-form-item>
        <el-form-item label="心率高阈值">
          <el-input v-model="formList.heartBeatUpper" label-width="50px" class="elInput" readonly></el-input>
        </el-form-item>
      </div>
      <div class="contentClassify">
        <el-form-item label="收缩压（高压）低阈值">
          <el-input
            v-model="formList.sysBloodPressureLower"
            label-width="50px"
            class="elInput"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="收缩压（高压）高阈值">
          <el-input
            v-model="formList.sysBloodPressureUpper"
            label-width="50px"
            class="elInput"
            readonly
          ></el-input>
        </el-form-item>
      </div>
      <div class="contentClassify">
        <el-form-item label="舒张压（低压）低阈值">
          <el-input
            v-model="formList.diasBloodPressureLower"
            label-width="50px"
            class="elInput"
            readonly
          ></el-input>
        </el-form-item>
        <el-form-item label="舒张压（低压）高阈值">
          <el-input
            v-model="formList.diasBloodPressureUpper"
            label-width="50px"
            class="elInput"
            readonly
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item></el-form-item>
    </el-form>
    <h3>阈值设置：</h3>
    <el-form ref="form" :model="form" label-width="200px">
      <div class="contentClassify">
        <el-form-item label="心率低阈值">
          <el-input v-model="form.heartBeatLower" label-width="50px" class="elInput"></el-input>
        </el-form-item>
        <el-form-item label="心率高阈值">
          <el-input v-model="form.heartBeatUpper" label-width="50px" class="elInput"></el-input>
        </el-form-item>
      </div>
      <div class="contentClassify">
        <el-form-item label="收缩压（高压）低阈值">
          <el-input v-model="form.sysBloodPressureLower" label-width="50px" class="elInput"></el-input>
        </el-form-item>
        <el-form-item label="收缩压（高压）高阈值">
          <el-input v-model="form.sysBloodPressureUpper" label-width="50px" class="elInput"></el-input>
        </el-form-item>
      </div>
      <div class="contentClassify">
        <el-form-item label="舒张压（低压）低阈值">
          <el-input v-model="form.diasBloodPressureLower" label-width="50px" class="elInput"></el-input>
        </el-form-item>
        <el-form-item label="舒张压（低压）高阈值">
          <el-input v-model="form.diasBloodPressureUpper" label-width="50px" class="elInput"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" @click="handleSetting">设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setupThreshold, showThreshold } from "@/api/systemManagement";
export default {
  components: {},
  name: "thresholdSetting",
  data() {
    return {
      form: {
        heartBeatUpper: "",
        heartBeatLower: "",
        sysBloodPressureUpper: "",
        sysBloodPressureLower: "",
        diasBloodPressureUpper: "",
        diasBloodPressureLower: ""
      },
      formList: {
        heartBeatUpper: "",
        heartBeatLower: "",
        sysBloodPressureUpper: "",
        sysBloodPressureLower: "",
        diasBloodPressureUpper: "",
        diasBloodPressureLower: ""
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {},
  methods: {
    handleSetting() {
      setupThreshold(this.form).then(response => {
        if (response.success == true) {
          this.$notify({
            title: "成功",
            message: "设置成功",
            type: "success",
            duration: 2000
          });
          this.formList = this.form;
        }
      });
      // this.getList();
    },
    getList() {
      showThreshold().then(response => {
        this.formList = response.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.formBox {
  width: 800px;
  height: auto;
  margin-top: 44px;
  .elInput {
    width: 400px;
  }
  /* .contentClassify {
    display: flex;
  } */
  h3 {
    padding-left: 30px;
  }
}
</style>
