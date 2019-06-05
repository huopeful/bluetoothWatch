<template>
  <div class="app-container">
    <!-- <p>健康监控 - 心率监控</p> -->
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column
        label="设备号"
        prop="deviceNum"
      />
      <el-table-column
        label="姓名"
        prop="name"
      />
      <el-table-column
        align="right"
      >
        <template slot="header">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
            :value="search"
          />
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleCheck(scope.$index, scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="10"
      :page-size="20"
    />
  </div>
</template>

<script>
/*eslint-disable*/

export default {
  name: "hbDisplay",
  props: {
      currentRole: String,
      required: true
    },

   data() {
      return {
          str: '',
        tableData: [{
          deviceNum: '111222333',
          name: '王小虎',
        }, {
          deviceNum: '111222333',
          name: '李小胡',
        }, {
          deviceNum: '111222333',
          name: '王小虎',
        }
        , {
          deviceNum: '111222333',
          name: '王小虎',
        }
        , {
          deviceNum: '111222333',
          name: '王小虎',
        }
        , {
          deviceNum: '111222333',
          name: '王小虎',
        }
        , {
          deviceNum: '111222333',
          name: '王小虎',
        }
        , {
          deviceNum: '111222333',
          name: '王小虎',
        }
        , {
          deviceNum: '111222333',
          name: '王小虎',
        }, {
          deviceNum: '111222333',
          name: '王小虎',
          
        }],
        search: ''
      }
    },
    methods: {
      handleCheck(index, row) {
       /*  alert(index, row); */
      this.str='hbDisplay'
      

      },
      handleDelete(index, row) {
        alert(index, row);
      }
    },
  watch: {
    str(newVal, oldVal) {
      // 在监听你使用update事件来更新word,而在父组件不需要调用该函数
      this.$emit('update:currentRole', newVal);
    }
  }
  
};
</script>


<style scoped>
</style>
