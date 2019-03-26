<template lang="html">
  <modal :hook="hook">
    <template slot="title">新建项目</template>
    <div>
      <ul class="modal-ul">
        <li 
          :class="{step_cursor:stepIndex==index}" 
          v-for="(modelRowInfo,index) in modelRowInfoArr"
          :key="index">
          {{ modelRowInfo }}
        </li>
      </ul>
      <alert-danger :message="errMsg" type="danger"></alert-danger>
      <div class="form modal-form-container">
        <div v-if="stepIndex===0">
          <div class="form-group">
            <label>项目名称</label>
            <input type="text" class="form-control" v-model="projectName" placeholder="输入项目名称">
          </div>
          <div class="form-group">
            <label>项目描述</label>
            <input type="textarea" class="form-control" v-model="description" placeholder="输入项目描述">
          </div>
          <div class="form-group">
            <label>创建人</label>
            <input type="text" class="form-control" v-model="leaderName" placeholder="输入创建人姓名" disabled>
          </div>
          <div class="form-group">
            <label>创建人UM账号</label>
            <input type="text" class="form-control" v-model="leaderUserId" placeholder="输入创建人UM账号" disabled>
          </div>
        </div>
        <div v-else-if="stepIndex===1">
          <label>成员UM账号</label>
          <div class="form-group" v-for="(user,index) in userGroup" :class="{'has-error':user.isInValid}">
            <input class="form-control" v-model="userGroup[index].userNum" >
          </div>
          <div class="form-group row">
            <button class="btn btn-link" @click="addUserGroup()">+ 添加</button>
            <button class="btn btn-link" @click="reduceUserGroup()">- 减少</button>
          </div>
        </div>
        <div v-else-if="stepIndex===2">
          <div class="team_create_info_show">
            <div class="info">
              请确认以下信息
            </div>
            <div class="mt_30 group-name">
              {{ projectName }}
            </div>
            <div class="mt_20">
              <span class="g-user-head-default group-member" v-for="groupMember in groupMembers">{{ groupMember }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="cancelCreate()">取消</button>
      <button type="button" class="btn btn-default" v-if="stepIndex>0" @click="prvStep()">上一步</button>
      <button type="button" class="btn btn-primary" @click="nextStep()" v-if="stepIndex!==2">下一步</button>
      <button type="button" class="btn btn-primary" @click="postGroupInfo()" v-if="stepIndex===2">创建</button>
    </div>
  </modal>
</template>

<script>
import modal from '@pub/modal'
import alert from '@pub/alert'
export default {
  data () {
    return {
      modelRowInfoArr: ['1 基本信息', '2 邀请成员', '3 完成'],
      stepIndex: 0,
      projectName: '',
      description: '',
      errMsg: '',
      userGroup: [{userNum: '', isInValid: false, id: '', headName: ''}]
    }
  },
  computed: {
    leaderId () {
      return this.$getFromSession('userInfo', 'id')
    },
    leaderHead () {
      return this.$getFromSession('userInfo', 'headName')
    },
    leaderName () {
      return this.$getFromSession('userInfo', 'name')
    },
    leaderUserId () {
      return this.$getFromSession('userInfo', 'userId')
    },
    groupMembers () {
      return this.userGroup.map(item => {
        return item.headName
      })
      .filter(headName => {
        return headName !== this.leaderHead
      })
      .concat(this.leaderHead)
    },
    user_ids () {
      return this.userGroup.map(item => {
        return item.id
      })
      .filter(id => {
        return id !== this.leaderId
      })
      .concat(this.leaderId)
    }
  },
  methods: {
    cancelCreate () {
      this.stepIndex = 0
    },
    prvStep () {
      this.stepIndex -= 1
    },
    addStep () {
      this.stepIndex += 1
    },
    nextStep () {
      this.errMsg = ''
      switch (this.stepIndex) {
        case 0:
          if (!this.projectName) {
            this.errMsg = '请填写团队名称'
          } else {
            this.addStep()
          }
          break
        case 1:
          let result = true
          let promiseArr = []
          for (let i = 0; i < this.userGroup.length; i++) {
            const userId = this.userGroup[i].userNum
            const filter = {userId}
            if (userId === '') {
              this.errMsg = '请填写全所有UM账号'
              return
            }
            let p = this.$filterGet('/api/People', filter)// 检测用户是否存在
            promiseArr.push(p)
          }
          Promise.all(promiseArr)
            .then(bodys => {
              let result = true
              bodys.forEach((body, index) => {
                if (body.length === 0) {
                  this.errMsg = '用户不存在'
                  this.userGroup[index].isInValid = true
                  result = false
                } else {
                  this.userGroup[index].id = body[0].id
                  this.userGroup[index].headName = body[0].headName
                  this.userGroup[index].isInValid = false
                }
              })
              if (result) {
                this.addStep()
              }
            })
          break
      }
    },
    postGroupInfo () {
      let groupInfo = {
        leader_id: this.$getFromSession('userInfo', 'id'),
        leader_um: this.$getFromSession('userInfo', 'userId'),
        description: this.description,
        create_time: String(Date.now()),
        user_ids: this.user_ids,
        name: this.projectName
      }
      if (this.projectName === '') {
        this.errMsg = '请填写项目名称！'
      } else {
        this.$post('/api/Projects', groupInfo)
          .then(({id}) => {
            let promiseArr = []
            this.user_ids.forEach(userId => {
              let postInfo = {
                person_id: userId,
                group_id: id
              }
              promiseArr.push(this.$post('/api/Person_has_groups', postInfo))
            })
            Promise.all(promiseArr)
            .then(() => {
              this.$emit('createdGroup', groupInfo)
              this.$hideModal()

              this.stepIndex = 0
              this.projectName = ''
              this.userGroup = [{userNum: '', isInValid: false, id: '', headName: ''}]
            })
          })
      }
    },
    addUserGroup () {
      this.userGroup.push({userNum: '', isInValid: false})
    },
    reduceUserGroup () {
      if (this.userGroup.length > 1) {
        this.userGroup.pop()
      }
    }
  },
  components: {modal, alertDanger: alert},
  props: ['hook']
}
</script>

<style lang="scss" scoped>

ul.modal-ul{
  display: flex;
  padding-left: 0px;
  li{
    line-height: 35px;
    font-size: 14px;
    text-align: center;
    color: #b9b9b7;
    border-top: solid 5px #f8f6f2;
    flex:1;
    &.step_cursor{
      color: #2e2d2b;
      border-top: solid 5px #54d09f;
    }
  }
}
.modal-form-container{
  padding:0 15px;
  .team_create_info_show{
    padding: 0 20px 20px 20px;
    margin: 0 auto;
    min-height: 200px;
    text-align: center;
    border: solid 1px #e8edf3;
    .info{
      margin: -10px auto 0 auto;
      width: 130px;
      color: #cb1a44;
      background: #fff;
    }
    .group-name{
      color: #54d09f;
      font-size: 21px;
    }
    .group-member{
      display: inline-block;
      cursor: default;
      margin-right: 5px;
    }
  }
}
</style>
