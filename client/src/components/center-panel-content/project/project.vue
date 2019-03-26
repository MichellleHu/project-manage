<template lang="html">
  <mission-group 
    :project-id="$route.params.projectId" 
    :project-name="projectName" 
    :task-groups="taskGroups"
    v-on:taskGroupCreated="taskGroupCreated">
  </mission-group>
</template>

<script>
import missionGroup from '../mission/mission-group'

export default {
  created () {
    this.getProjectInfo()
  },
  watch: {
    '$route': 'getProjectInfo'
  },
  data () {
    return {
      taskGroups: []
    }
  },
  computed: {
    projectName () {
      return this.$route.params.projectName
    },
    projectId () {
      return this.$route.params.projectId
    }
  },
  methods: {
    getProjectInfo () {
      this.$filterGet('/api/Task_groups', {project_id: this.projectId})
      .then(body => {
        this.taskGroups = body
      })
    },
    taskGroupCreated (taskgroup) {
      this.taskGroups.push(taskgroup)
    }
  },
  components: {missionGroup}
}
</script>

<style lang="scss" scoped>
</style>
