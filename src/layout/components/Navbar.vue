<template>
  <div class="navbar">
    <!-- 控制侧栏菜单 -->
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- 面包屑导航 -->
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <el-badge id='alarmNum' :value="$store.state.alarmCount" class="item el-icon-bell" :max="99" :hidden='$store.state.alarmCount==0'>
</el-badge>
        
        <search id="header-search" class="right-menu-item" />
        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->
        <!-- 全屏 -->
        <screenfull id="screenfull" class="right-menu-item hover-effect"/>

        <!-- <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>-->

        <!-- <lang-select class="right-menu-item hover-effect" /> -->
      </template>
      <!-- 最右侧点击退出、首页 -->
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../assets/loginOut/loginOut.png" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{ $t('navbar.github') }}
            </el-dropdown-item>
          </a>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { alarm } from "@/api/health";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import Search from '@/components/HeaderSearch'  // 搜索
import loginOut from '../../assets/loginOut/loginOut.png'


export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data(){
    return{
    alarmNum:0,
    hidden:true,
    }
  },
  created(){
alarm().then(response => {
        if(response.count!==0){
          this.hidden=false;
        }
// this.alarmNum=response.count;
this.$store.commit('modifyAlarmCount', response.count);
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar", "device"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    }
  }
};
</script>
<style lang="scss">
#alarmNum{
sup.el-badge__content{
  margin-left: -10px;
}
}

</style>


<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 10px;
          margin-bottom:-4px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
 
     .item{
    height:50px;
    line-height: 50px;
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    color: #5a5e66;
    vertical-align: text-bottom;
    font-size: 26px;
  }
  
}
</style>
