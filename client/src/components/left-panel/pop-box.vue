<template lang="html">
  <div class="popbox mission-box" v-show="popBoxIsShow">
    <div class="popbox-body">
      <ul class="popbox-menu">
        <li v-for="popboxItem in popboxItems" :class="{divider:popboxItem.isLine}" class="popbox-li">
          <input  v-model="popboxItem.checked" type="checkbox">
          <i class="glyphicon" :class="popboxItem.iconName"></i>
          UM账号：<span>{{ popboxItem.userId }}</span>
        </li>
      </ul>
      <button class="btn btn-primary btn-add" @click="addMemerber()">添加项目成员</button>      
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      popboxItems: []
    }
  },
  mounted () {
    this.$get('/api/People').then((body) => {
      body.forEach(e => {
        this.popboxItems.push({
          iconName: 'glyphicon-user', userId: e.userId
        })
      })
    })
  },
  methods: {
    addMemerber () {
    }
  },
  props: ['popBoxIsShow']
}
</script>

<style lang="scss" scoped>
.mission-box{
  bottom: 60px;
  padding: 5px;
  .btn-add {
    float: right;
  }
}
</style>
