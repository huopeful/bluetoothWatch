<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse"/>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- permission_routes 传递给子组件 -->
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  data() {
    return {
      showLogo: true,
      // 模拟通过请求获取到的路由
      // permission_routes: []
    };
  },
  components: { SidebarItem, Logo },
  created() {
    // 模拟通过请求获取到的路由
    // setTimeout(() => {
    //   this.permission_routes = [
    //     {
    //       alwaysShow: true,
    //       children: [
    //         {
    //           meta: { roles: ["admin"], title: "pagePermission" },
    //           name: "PagePermission",
    //           path: "page"
    //         },
    //         {
    //           meta: { title: "directivePermission" },
    //           name: "DirectivePermission",
    //           path: "directive"
    //         },
    //         {
    //           meta: { roles: ["admin"], title: "rolePermission" },
    //           name: "RolePermission",
    //           path: "role"
    //         }
    //       ],
    //       meta: {
    //         icon: "lock",
    //         roles: ["admin", "editor"],
    //         title: "permission"
    //       },
    //       name: "Permission",
    //       path: "/permission",
    //       redirect: "/permission/page"
    //     },
    //     {
    //       children: [
    //         {
    //           meta: {
    //             roles: ["admin"],
    //             title: "dashboard",
    //             noCache: true,
    //             icon: "monitor",
    //             affix: true
    //           },
    //           name: "Dashboard",
    //           path: "dashboard"
    //         }
    //       ],
    //       meta: {
    //         icon: "lock",
    //         roles: ["admin", "editor"],
    //         title: "permission"
    //       },
    //       path: "",
    //       redirect: "dashboard"
    //     }
    //   ];
    // }, 1000);
    // 获取到的所有的路由
    console.log("this.permission_routes");
    console.log(this.permission_routes);
  },
  computed: {
    // 先获取$route存储在$store中,通过mapGetters(getter的计算属性)获取,再传递给子组件
    ...mapGetters(["permission_routes", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo
    // },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
