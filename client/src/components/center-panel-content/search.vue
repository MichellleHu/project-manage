<template lang="html">
  <div class="content-main-container">
    <div class="form-horizontal">
      <div class="input-group">
        <input type="text" class="form-control" placeholder="输入查询关键词" v-model="keyWord" @keyup="search()">
        <span class="input-group-addon"><span class="glyphicon glyphicon-search" @click="search()"></span></span>
      </div>
    </div>
    <div class="searched-container">
      <div class="item" v-for="(doc,$index) in filteredDocArr" @click="showDoc($index)">
        <div class="icon-container">
          <i class="glyphicon glyphicon-file icon"></i>
        </div>
        <div class="text-container">
          <div>
            {{ doc.title }}
          </div>
          <div class="description">
            <br/>
          </div>
        </div>
      </div>
      <documentModal :docHook="docHook" :docModalInfo="docModalInfo"></documentModal>

      <projectItem :projectArr="filteredProjectArr"></projectItem>

      <div class="item" v-for="group in filteredGroupArr" @click="toGroup(group.id,group.name)">
        <div class="icon-container">
          <i class="glyphicon glyphicon-user icon"></i>
        </div>
        <div class="text-container">
          <div>
            {{ group.name }}
          </div>
          <div class="description">
            {{group.user_ids.length}}人
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import documentModal from './project/document-modal'
import projectItem from './project/project-item'

export default {
  created () { // 获取所有的检索范围信息
    let promiseArr = [
      this.$get('/api/Documents'),
      this.$get('/api/Projects'),
      this.$get('/api/Groups')
    ]
    Promise.all(promiseArr).then((res) => {
      this.docArr = res[0]
      this.projectArr = res[1]
      this.groupArr = res[2]
      this.search()
    })
  },
  data () {
    return {
      docHook: false,
      docArr: [],
      filteredDocArr: [],
      docModalInfo: {},
      projectArr: [],
      filteredProjectArr: [],
      groupArr: [],
      filteredGroupArr: []
    }
  },
  computed: {
    keyWord () {
      return this.$store.state.searchWords
    }
  },
  methods: {
    getFiltered (arr, mathProp) {
      return arr.filter((item) => {
        if (this.keyWord) {
          let reg = new RegExp(this.keyWord)
          return item[mathProp].match(reg)
        } else {
          return []
        }
      })
    },
    search () {
      this.$store.dispatch('getSearchWords', this.keyWord)
      this.filteredDocArr = this.getFiltered(this.docArr, 'title')
      this.filteredProjectArr = this.getFiltered(this.projectArr, 'name')
      this.filteredGroupArr = this.getFiltered(this.groupArr, 'name')
    },
    showDoc (index) {
      const docInfo = this.docArr[index]
      this.docModalInfo = docInfo
      this.docHook = !this.docHook
    },
    toGroup (groupId, groupName) {
      this.$router.push({name: 'group', params: {groupId, groupName}})
    }
  },
  components: {documentModal, projectItem}
}
</script>

<style lang="scss" scoped>
.searched-container{
  margin-top: 15px;
}
</style>
