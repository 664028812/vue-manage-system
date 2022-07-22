<template>
  <div class="lazy-table">
    <el-table
      ref="lazyTableRef"
      :data="fatherList"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'HasChildren' }"
    >
      <el-table-column prop="id" label="Id" width="100" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="age" label="age" width="180" />
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-link type="primary" class="table-link" @click="handleDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { GetRoles } from '../../api/Role.js'

import {
  Assign,
  GetPermissionTree,
  GetPermissionIdByRoleId,
} from '../../api/Permission.js'

const lazyTableRef = ref(null)
//模拟获取父list
const fatherList = ref([])
onMounted(() => {
  setTimeout(() => {
    fatherList.value = [
      {
        id: 1,
        name: 'A',
        age: '15',
        HasChildren: true,
      },
      {
        id: 2,
        name: 'B',
        age: '16',
        HasChildren: true,
      },
    ]
  }, 500)
})
//懒加载钩子函数
const load = (row, treeNode, resolve) => {
  //根据父组件的id通过接口得到子数据， 这里用setTimeout模拟
  setTimeout(() => {
    console.log(55, row.id)
    resolve([
      {
        id: row.id * 10 + 1,
        name: 'child-1',
        age: '11',
        parentId: row.id,
      },
      {
        id: row.id * 10 + 2,
        name: 'child-2',
        age: '22',
        parentId: row.id,
      },
    ])
  }, 500)
}
//删除事件
const handleDelete = (item) => {
  const store = lazyTableRef.value.store
  //判断是父还是子
  if (item.hasOwnProperty('hasChildren')) {
    //父对象删除
    console.log(74, store.states.data.value)
    const fatherList = store.states.data.value
    //删除
    const delIndex = fatherList.findIndex((i) => item.id === i.id)
    fatherList.splice(delIndex, 1)
  } else {
    //子对象删除
    const childList = store.states.lazyTreeNodeMap.value[item.parentId]
    //删除
    const delIndex = childList.findIndex((i) => item.id === i.id)
    childList.splice(delIndex, 1)
  }
}
</script>