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
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        type='index'
      >
        <!-- sortable="custom"  设置排序 -->
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>-->
      </el-table-column>
      <el-table-column :label="$t('table.deviceList.mac')" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mac }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.deviceList.deviceName')" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.deviceList.battery')" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.battery }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.deviceList.bsignal')" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bsignal }}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.phoneNumber')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.address')" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
          标题后面的USA(国家)标签
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>-->
      <!-- <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="small" v-waves @click="handleUpdate(row)">编辑</el-button>
          <el-button size="small" v-waves type="danger" @click="untying(row)">解除绑定</el-button>
        </template>
      </el-table-column>-->
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
        <el-form-item label="mac" prop="mac">
          <el-input v-model="temp.mac"/>
        </el-form-item>
        <el-form-item :label="$t('table.deviceList.deviceName')" prop="deviceName">
          <el-input v-model="temp.deviceName"/>
        </el-form-item>
        <!--  <el-form-item :label="$t('table.sex')" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
            <el-option v-for="item in ['男','女']" :key="item.key" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.IDNum')" prop="IDNum">
          <el-input v-model="temp.IDNum"/>
        </el-form-item>
        <el-form-item :label="$t('table.deviceNumber')" prop="deviceNumber">
          <el-input v-model="temp.deviceNumber"/>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker
            v-model="temp.timestamp"
            type="datetime"
            placeholder="请输入时间"
          />
        </el-form-item>
        <el-form-item :label="$t('table.phoneNumber')" prop="phoneNumber">
          <el-input v-model="temp.phoneNumber"/>
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input v-model="temp.address"/>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogJBVisible" title="解除绑定">
      <el-form
        ref="untyingForm"
        :rules="untyingRules"
        :model="untyingData"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label-width="80px" :label="$t('table.untying.date')" prop="time">
          <el-date-picker v-model="untyingData.time" type="datetime" placeholder="请输入时间"/>
        </el-form-item>
        <el-form-item label-width="80px" :label="$t('table.untying.reason')" prop="reason">
          <el-input type="textarea" :rows="2" v-model="untyingData.reason"/>
        </el-form-item>
        <el-form-item label-width="80px" :label="$t('table.untying.operator')" prop="operator">
          <el-input v-model="untyingData.operator"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogJBVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="confirmUntying()">{{ $t('table.confirm') }}</el-button>
      </div>
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
import {
  getBindDeviceList,
  unbindBeacon,
  deviceList,
  deviceRegister
} from "@/api/device";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "",
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
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null, // 表格数据
      total: 0, // 分页总条数
      listLoading: true, // loading图标控制器
      listQuery: {
        // 分页默认参数设置
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
        free: 0,
        bind: 1
      },
      showReviewer: false,
      temp: {
        id: undefined,
        timestamp: new Date(),
        name: "",
        sex: "",
        IDNum: "",
        deviceNumber: "",
        phoneNumber: "",
        address: ""
      },
      rules: {
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        sex: [{ required: true, message: "性别不能为空", trigger: "change" }],
        IDNum: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        deviceNumber: [
          { required: true, message: "设备号不能为空", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "电话不能为空", trigger: "blur" }
        ],
        address: [{ required: true, message: "住址不能为空", trigger: "blur" }]
      },
      dialogFormVisible: false, // 添加 编辑 标题点击事件都是打开同一个dialog 通过这个变量控制是否弹出
      dialogStatus: "", // 添加 编辑 标题点击事件都是打开同一个dialog 通过这个变量控制标题
      textMap: {
        update: "Edit",
        create: "Create"
      },
      downloadLoading: false, // 控制点击下载时  按钮中的图标变成加载样式
      dialogJBVisible: false, // 解绑dialog弹框控制器
      untyingData: {
        operator: "",
        time: new Date(),
        reason: "",
        id: ""
      },
      untyingRules: {
        operator: [
          { required: true, message: "操作人不能为空", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "解绑事由不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取表格数据方法
    /* getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        console.log(response);

        this.list = response.data.items;
        this.total = response.data.total;
        console.log(this.list);


        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    }, */
    getList() {
      this.listLoading = true;
      deviceList({
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        status:0
      }).then(response => {
        console.log(response);

        this.list = response.data;
        this.total = response.total;
        console.log(this.list);

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    // 搜索方法
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    // 顺/倒序
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    //  重置temp
    resetTemp() {
      this.temp = {
        id: undefined,
        timestamp: new Date(),
        name: "",
        sex: "",
        IDNum: "",
        deviceNumber: "",
        phoneNumber: "",
        address: ""
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
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
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          /*  this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }) */ 
          let fromData=new FormData();
          fromData.append('mac',this.temp.mac);
          fromData.append('deviceName',this.temp.deviceName);
          deviceRegister(fromData).then(response => {
            //this.list.unshift(this.temp);
            this.listQuery.page=1;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
             this.dialogFormVisible = false;
          });
        

        }
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
    resetUntyingData() {
      this.untyingData = {
        operator: "",
        time: new Date(),
        reason: "",
        id: ""
      };
    },
    // 点击解绑
    untying(row) {
      this.dialogJBVisible = true;
      var that = this;
      unbindBeacon(this.listQuery).then(response => {
        that.getList();

        /* 
        this.list = response.data.items;
        this.total = response.data.total;
        console.log(this.list); */

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
      console.log(row);
      row.id = this.untyingData.id;
      this.$nextTick(() => {
        this.$refs["untyingForm"].clearValidate();
      });
    },
    // 解绑弹框确认
    confirmUntying() {
      this.$refs["untyingForm"].validate(valid => {
        if (valid) {
          this.dialogJBVisible = false;
          console.log(this.untyingData);
          this.resetUntyingData();
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000
          });
        }
      });
    }
  }
};
</script>
