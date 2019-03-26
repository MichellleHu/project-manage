<template lang="html">
  <div class="mod-navbar">
    <div class="main">
      <div class="title">
        <h3>
          <i class="glyphicon-dashboard glyphicon navbar-title" :class="navbarInfo.iconName"></i>
          <span>我的工作台</span>
          <span v-if="navbarInfo.title"><span style="margin: 0 5px;"> | </span>{{ navbarInfo.title }}</span>
        </h3>
      </div>
      <div class="right-menu" v-if="navbarInfo.inputVisible">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="输入查询关键词" v-model="keyWord" @keyup.enter="search()">
          <span class="input-group-addon"><span class="glyphicon glyphicon-search" @click="search()"></span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modal from '@pub/modal'
import alert from '@pub/alert'

export default {
  name: 'head-navbar',
  components: {projectModal: modal, dangerAlert: alert},
  data () {
    return {
      errMsg: '',
      projectName: '',
      projectDescription: '',
      keyWord: ''
    }
  },
  computed: {
    navbarInfo () {
      switch (this.$store.state.secondRouterName) {
        case 'dashboard':
        case 'group':
          return {
            iconName: 'glyphicon-dashboard',
            title: '我的工作台'
          }
        case 'search':
          return {
            iconName: 'glyphicon-search',
            title: '搜索'
          }
        case 'project':
          return {
            iconName: 'glyphicon-folder-open',
            title: this.$route.params.projectName,
            inputVisible: true
          }
      }
    }
  },
  methods: {
    search () {
      this.$store.dispatch('getSearchWords', this.keyWord)
      this.$router.push({name: 'search'})
    },
    isActive (itemRouterName) {
      let routerLevel = this.$store.state.routerLevel
      if (routerLevel[routerLevel.length - 1] === itemRouterName) {
        return true
      }
      return false
    },
    postProjectInfo () {
      this.errMsg = ''
      let infoObj = {
        name: this.projectName,
        description: this.projectDescription,
        group_id: this.$route.params.groupId
      }
      if (this.projectName === '') {
        this.errMsg = '请填写项目名称！'
      } else {
        this.$post('/api/Projects', infoObj)
          .then(body => {
            this.projectArr.push(body)
            this.$hideModal()
            this.projectName = ''
            this.projectDescription = ''
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mod-navbar{
  user-select: none;
  padding: 0 7px;
  position: relative;
  background-color: #fff;
  border-bottom: solid 1px #eeece8;
  min-height: 55px;
  // z-index: 3;

  .main{
    min-height: 55px;

    .title{
      float: left;
      white-space: nowrap;
      line-height: 100%;
      max-width: 22%;

      h3{
        min-width: 100px;
        margin: 0;
        vertical-align: middle;
        line-height: 54px;
        font-size: 21px;
        display: inline-block;
        color: #333;
        margin-right: 7px;
        font-weight: 400;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .navbar-title{
          padding: 0 7px;
          width: 44px;
          display: inline-block;
          text-align: center;
          color: #acaba7;
          line-height: 30px;
          font-size: 25px;
          text-shadow: 0 2px 0 #fff, 0 -2px 0 #f2f2ea;
        }
      }
    }

    .right-menu{
      display: inline-block;
      margin-top: 10px;
      height: 34px;
      width: 400px;
      // margin-left: 58%;
      // margin-right: 10%;
      // width: 43%;
      margin-left: 40%;
      white-space: nowrap;
      text-align: center;
    }
  }
}

</style>
