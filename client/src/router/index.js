import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Main from '@/components/Main'
import Regist from '@/components/Regist'

import mission from '@panelContent/mission/mission'
import project from '@panelContent/project/project'
import search from '@panelContent/search'
import moments from '@panelContent/moments'
import group from '@panelContent/group'

import document from '@panelContent/project/document'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'main'}
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/regist',
      name: 'regist',
      component: Regist
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      redirect: {name: 'dashboard'},
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          redirect: {name: 'group'}
        },
        {
          path: 'dashboard/mission',
          name: 'mission',
          component: mission
        },
        {
          path: 'dashboard/moments',
          name: 'moments',
          component: moments
        },
        {
          path: 'project/:projectId/:projectName',
          name: 'project',
          component: project
        },
        {
          path: 'project/:projectId/:projectName/document',
          name: 'document',
          component: document
        },
        {
          path: 'search',
          name: 'search',
          component: search
        },
        {
          path: 'group',
          name: 'group',
          component: group
        }
      ]
    }
  ]

})
