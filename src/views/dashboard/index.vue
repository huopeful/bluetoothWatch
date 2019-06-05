<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
// mapGetters辅助函数仅仅是将 store 中的 getter 映射到局部计算属性
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // 判断权限
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style lang="scss" scoped>
  .dashboard-container{
    width: 100%;
    height: 100%;
  }
</style>


