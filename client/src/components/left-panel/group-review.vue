<template lang="html">
  <div class="popbox group-pop" v-show="isShow">
    <div class="popbox-body">
      <ul class="popbox-menu">
        <li class="pop-title">
          <span>我的项目</span>
        </li>
        <li class="divider"></li>
        <li class="popbox-li" v-for="group in groupList" @click="toGroup(group.id,group.name)">
          <div>{{ group.name }}</div>
          <small class="group-info-container">
            <span><i class="glyphicon glyphicon-user"></i>{{ group.user_ids.length }}人</span>
          </small>
        </li>
        <li class="divider"></li>
        <li class="create-group-btn-container">
          <button class="btn btn-block btn-success" @click="createGroup()">创建新项目</button>
        </li>
      </ul>
    </div>
    <create-group :hook="modalHook" v-on:createdGroup="insertGroup"></create-group>
  </div>
</template>

<script>
import createGroup from './create-group'
export default {
  created () {
    this.getGroupList()
  },
  data () {
    return {
      modalHook: false,
      groupList: []
    }
  },
  methods: {
    createGroup () {
      this.modalHook = !this.modalHook
    },
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
    insertGroup (group) {
      this.groupList.push(group)
    },
    toGroup (groupId, groupName) {
      this.$router.push({name: 'project', params: {projectId: groupId, projectName: groupName}})
      this.$emit('groupClose')
    }
  },
  components: {createGroup},
  props: ['isShow']
}
</script>

<style lang="scss" scoped>
$liPadding:8px 30px;
.group-pop{
  top:0px;

  .create-group-btn-container{
    padding:$liPadding;
  }
  .pop-title{
    padding:$liPadding;
    font-size: 16px;
  }
  .popbox-li{
    // padding:0 $paddingSize;
    .group-info-container{
      i{
        margin-right: 5px;
        color:#777;
      }
    }
  }
}
</style>
