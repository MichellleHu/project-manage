<template lang="html">
  <div class="main-container">
    <span class="main-title">项&nbsp;&nbsp;目</span>
    <button class="btn btn-primary btn-sm" @click="createProject()"><span class="glyphicon glyphicon-plus"></span></button>
    <!-- <project-modal :hook="projectHook">
      <template slot="title">
        新建项目
      </template>
      <template>
        <danger-alert type="danger" :message="errMsg"></danger-alert>
        <div class="form">
          <div class="form-group">
            <input type="text" class="form-control" v-model="projectName" placeholder="请输入项目名称">
          </div>
          <div class="form-group">
            <textarea class="form-control" v-model="projectDescription" placeholder="项目描述（可选）"></textarea>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" @click="postProjectInfo">创建</button>
      </template>
    </project-modal> -->
    <create-group :hook="modalHook" v-on:createdGroup="insertGroup"></create-group>
    <project-item :project-arr="groupList"></project-item>
  </div>
</template>

<script>
import modal from '@pub/modal'
import alert from '@pub/alert'
import projectItem from './project/project-item'
import createGroup from '../left-panel/create-group'

export default {
  created () {
    // this.getProjectInfo()
    this.getGroupList()
  },
  watch: {
    '$route': 'getProjectInfo'
  },
  data () {
    return {
      errMsg: '',
      projectName: '',
      projectDescription: '',
      projectArr: [],
      groupList: [],
      modalHook: false
    }
  },
  methods: {
    getGroupList () {
      const id = this.$getFromSession('userInfo', 'id')
      this.$get(`api/People/${id}/person_has_groups`)
        .then(body => {
          let promiseArr = []
          body.forEach(({group_id}) => {
            promiseArr.push(this.$filterGet(`api/Projects/findOne`, {id: group_id}))
          })
          return promiseArr
        })
        .then(promiseArr => {
          Promise.all(promiseArr)
            .then(groupList => {
              groupList.forEach(group => {
                this.groupList.push(group)
              })
            })
        })
    },
    createProject () {
      this.modalHook = !this.modalHook
    },
    insertGroup (group) {
      this.groupList.push(group)
    },
    postProjectInfo () {
      this.errMsg = ''
      let infoObj = {
        leader_id: this.$getFromSession('userInfo', 'id'),
        leader_um: this.$getFromSession('userInfo', 'userId'),
        create_time: String(Date.now()),
        name: this.projectName,
        description: this.projectDescription
      }
      if (this.projectName === '') {
        this.errMsg = '请填写项目名称！'
      } else {
        this.$post('/api/Projects', infoObj)
          .then(body => {
            this.groupList.push(body)
            this.$hideModal()
            this.projectName = ''
            this.projectDescription = ''
          })
      }
    },
    getProjectInfo () {
      const groupId = this.$route.params.groupId
      this.$get(`/api/Groups/${groupId}/projects`)
        .then(body => {
          this.projectArr = body
        })
    }
  },
  components: {projectItem, projectModal: modal, dangerAlert: alert, createGroup}
}
</script>

<style lang="scss" scoped>
.main-container{
  background: #fff;
  min-height:900px;
  margin:7px 14px;
  padding:21px;
  .main-title{
    user-select: none;
    border-bottom: solid 1px #f8f6f2;
    padding: 0 15px 14px 2px;
    font-weight: 400;
    color: #777;
    font-size: 17px;
    line-height: 100%;
    display: inline-block;
  }
}
</style>
