<template lang="html">
  <div class="misson-group">
    <div style="margin: 7px 0 0 10px;">
      <div class="input-group">
        <input id="search" type="text" class="form-control" placeholder="输入查询关键词">
        <span class="input-group-addon"><span class="glyphicon glyphicon-search"></span></span>
      </div>
      <!-- <div class="btn-group">
        <button type="button" class="btn btn-success btn-sm" onclick="demo_create();"><i class="glyphicon glyphicon-asterisk"></i> Create</button>
        <button type="button" class="btn btn-warning btn-sm" onclick="demo_rename();"><i class="glyphicon glyphicon-pencil"></i> Rename</button>
        <button type="button" class="btn btn-danger btn-sm" onclick="demo_delete();"><i class="glyphicon glyphicon-remove"></i> Delete</button>
      </div> -->
      <div id="ajax" style="min-height: 60px; width: 299px; margin-top: 5px"></div>
    </div>
    <mission-group-item 
      :task-group="taskGroup"
      :key="index" 
      v-for="(taskGroup,index) in taskGroups">
    </mission-group-item>
    <create-mission-group :project-id="projectId" :project-name="projectName" :task-group-length="taskGroupLength" v-on:taskGroupCreated="addTaskGroup"></create-mission-group>
  </div>
</template>

<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="./../../dist/jstree.min.js"></script>

<script>
import missionGroupItem from './mission-group-item'
import createMissionGroup from './create-mission-group'

export default {
  data () {
    return {
      list_group: [],
      list_group_id: ''
    }
  },
  computed: {
    taskGroupLength () {
      if (this.taskGroups) {
        return this.taskGroups.length
      } else {
        return 0
      }
    },
    list_data_default () {
      if (this.$props.listGroups && this.$props.listGroups.list_group) {
        return this.$props.listGroups.list_group
      } else {
        return [{'id': '0', 'text': '数据湖项目', 'children': []}]
      }
    }
  },
  watch: {
    '$route.params.projectId': function () {
      this.getAllData()
    }
  },
  mounted () {
    this.getAllData()
  },
  methods: {
    getAllData () {
      this.$filterGet('/api/List_groups', {project_id: this.$route.params.projectId})
      .then(body => {
        const listGroups = body
        this.list_group_id = listGroups.length ? listGroups[0].id : ''
        const listDefault = listGroups.length ? listGroups[0].list_group : [{'id': '0', 'text': '数据湖项目', 'children': []}]
        $('#ajax').jstree({
          'core': {
            'animation': 0,
            'check_callback': true,
            'themes': { 'stripes': true },
            'data': listDefault
          },
          'dnd': {
            'large_drop_target': true,
            'use_html5': true
          },
          'plugins': [
            'contextmenu', 'dnd', 'search',
            'state', 'types', 'wholerow'
          ]
        }).bind('click.jstree', (e) => {
        })
        this.list_group = $('#ajax').jstree().settings.core.data
        const event = ['create_node', 'move_node', 'rename_node', 'delete_node', 'copy_node']
        event.forEach(e => {
          this.nodeChange(e)
        })
        // search
        let to = false
        $('#search').keyup(function () {
          if (to) { clearTimeout(to) }
          to = setTimeout(function () {
            var v = $('#search').val()
            $('#ajax').jstree(true).search(v)
          }, 250)
        })
        $(document).on('dnd_start.vakata', (data, element, helper, event) => {
          const el = element.element
          this.$store.commit('setDragInfo', {id: element.element.id, text: element.element.text})
          el.ondragstart = ($event) => {
            $event.dataTransfer.setData('id', $event.target.id)
            $event.dataTransfer.setData('text', $event.target.text)
          }
        })
      })
    },
    nodeChange (event) {
      $('#ajax').on(`${event}.jstree`, (node, parent, position) => {
        this.list_group = $('#ajax').jstree(true).get_json()
        this.setListGroup()
      })
    },
    setListGroup () {
      let infoObj = {
        list_group: this.list_group,
        project_id: this.$route.params.projectId,
        project_name: this.$route.params.projectName,
        create_time: Date.now(),
        create_person_id: this.$getFromSession('userInfo', 'id')
      }
      const filter = {where: {project_id: this.$route.params.projectId}}
      if (this.list_group_id) {
        this.$paramsPost('/api/List_groups/update', infoObj, filter)
        .then(body => {

        })
      } else {
        this.$post(`/api/List_groups`, infoObj)
          .then(body => {
          })
      }
    },
    addTaskGroup (taskGroup) {
      // this.innerTaskGroups.push(taskGroup)
      this.$emit('taskGroupCreated', taskGroup)
    }
  },
  components: {missionGroupItem, createMissionGroup},
  props: ['projectId', 'projectName', 'taskGroups']
}
</script>

<style lang="scss" scoped>
.misson-group {
  display: flex;
  flex-direction: row;
  .input-group {
    width: 299px; 
    display: table;
    border-collapse: separate
  }
  .btn-group {
    margin: 5px 0;
  }
  #jstree-dnd.jstree-default .jstree-er {
    // background-position: -36px -68px;
    background: none !important;
  }
}
</style>
