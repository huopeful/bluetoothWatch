<template>
  <div class="app-container">
    <component :is="currentRole" :current-role.sync="currentRole" />
  </div>
</template>

<script>
/*eslint-disable*/
import hbDisplay from './hbDisplay.vue'
import hbTable from './hbTable.vue'

export default {
  name: 'SurveillanceCardiaque',
  components: { hbDisplay, hbTable },
  data() {
    return {
      currentRole: 'hbTable'
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
 

