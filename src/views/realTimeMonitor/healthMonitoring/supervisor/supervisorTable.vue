<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.name')"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
       <el-table-column type="index" label="序号" width="150" align="center"> </el-table-column>
      <el-table-column :label="$t('table.name')" width="100" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sex')" width="110px" align="center">
       <template slot-scope="scope">
          <span v-if="scope.row.sex==true">男</span>
          <span v-if="scope.row.sex==false">女</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.IDNum')" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cardId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.deviceNumber')" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.phoneNumber')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.personnel.heartRate')" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.heartRate }}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('table.personnel.bloodPressure')" min-width="150px"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bloodPressure }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column :label="$t('table.minMaxHeartRate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.minHeartRate }}-{{ scope.row.maxHeartRate }}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('table.minMaxBloodRate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.minBloodRate }}-{{ scope.row.maxBloodRate }}</span>
        </template>
      </el-table-column>-->
      <!--  <el-table-column :label="$t('table.averageH')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.averageH }}</span>
        </template>
      </el-table-column>
       <el-table-column :label="$t('table.averageB')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.averageB }}</span>
        </template>
      </el-table-column>-->
       <el-table-column :label="$t('table.currentHeartRate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.heartbeat }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.currentBloodRate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bloodpressure }}</span>
        </template>
      </el-table-column>

     <!--  <el-table-column :label="$t('table.healthStatusText')" align="center" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.healthStatusText == '不健康'" class="red">
            不正常
          </span>
          <span v-else>正常</span>
        </template>
      </el-table-column> -->
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        min-width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCheck(row)">{{ $t('table.check') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item :label="$t('table.sex')" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.sex"
              :label="item.sex"
              :value="item.sex"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.IDNum')" prop="cardId">
          <el-input v-model="temp.cardId"/>
        </el-form-item>
        <el-form-item :label="$t('table.deviceNumber')" prop="deviceNumber">
          <el-input v-model="temp.deviceNumber"/>
        </el-form-item>
        <el-form-item :label="$t('table.phoneNumber')" prop="phoneNumber">
          <el-input v-model="temp.phoneNumber"/>
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import { getHealthList, prisonerRegister} from "@/api/health";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

/* const calendarTypeOptions = [
  { name: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
] */
const calendarTypeOptions = [{ sex: "男" }, { sex: "女" }];
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "rollCallStatisticsTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    }
  },
  props: {
    currentRole: String,
    required: true
  },
  data() {
    return {
      str: "",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        /* sort: '+id' */
        sort: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" }
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
        cardId:'',
        sex:'',
        deviceNumber:'',
        phoneNumber:'',
        address:'',
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" }
        ]
      },
      downloadLoading: false,
      healthStatus: 0,
      timer:'',
    };
  },
  watch: {
    str(newVal, oldVal) {
      // 在监听你使用update事件来更新word,而在父组件不需要调用该函数
      this.$emit("update:currentRole", newVal);
    }
  },
  created() {
    this.getList();
  },
  mounted(){
    // this.timer=window.setInterval(this.getList,5000);
  },
   // 清除定时器
  beforeDestroy(){
    let timer = this.timer;
    clearTimeout(timer)
  },
  methods: {
    getList() {
      this.listLoading = true;
      var formData = new FormData();
      formData.append('page',this.listQuery.page);
      formData.append('limit',this.listQuery.limit);
      getHealthList(formData).then(response => {
        this.listLoading = false;
        this.list = response.data;
        console.log('a',this.list);
        this.total = response.total;
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleCheck(row) {
      this.str = "rollCallStatisticsDisplay";
      localStorage.setItem('criminalId',row.id)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        /*  this.listQuery.sort = '+id' */
      } else {
        /* this.listQuery.sort = '-id' */
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.author = "vue-element-admin";
          prisonerRegister(this.temp).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000
      });
      const index = this.list.indexOf(row);
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style scoped>
.red {
  color: red;
}
</style>

