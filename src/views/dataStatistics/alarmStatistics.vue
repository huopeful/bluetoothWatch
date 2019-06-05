<template>
  <div class="app-container">
    <component :is="currentRole" :current-role.sync="currentRole" />
  </div>
</template>

<script>
/*eslint-disable*/
import rollCallStatisticsTable from './rollCallStatisticsTable.vue'
import rollCallStatisticsDisplay from './rollCallStatisticsDisplay.vue'

export default {
  name: 'RollCallStatistics',
  components: { rollCallStatisticsDisplay, rollCallStatisticsTable },
  data() {
    return {
      currentRole: 'rollCallStatisticsTable'
    }
  },
  computed: {

  },
  created() {

  }
}
</script>

<style scoped>
</style>


