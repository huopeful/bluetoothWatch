<template>
  <div class="app-container">
    <component :is="currentRole" :current-role.sync="currentRole" />
  </div>
</template>

<script>
/*eslint-disable*/
import rollCallStatisticsTable from './prisonerTable.vue'
import rollCallStatisticsDisplay from './prisonerStatisticsDisplay.vue'

export default {
  name: 'prisoner',
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
 

