<template>
  <div>
    <div class="crumbs">
      <!--  顶部标签 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 接口管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="filtersName" placeholder="接口名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>

        <el-button type="primary" icon="el-icon-lx-add" @click="HandleAdd">增加</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="HandleAdd">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="HandleAdd">删除</el-button>
      </div>
      <el-table
        ref="lazyTableRef"
        highlight-current-row
        :data="tableData"
        row-key="id"
        border
        lazy
        :load="load"
        style="width: 100%"
        :tree-props="{ children: 'children', hasChildren: 'HasChildren' }"
      >
        <!-- <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column> -->
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column prop="name" label="菜单/按钮" width="200"></el-table-column>

        <el-table-column prop="code" label="路由地址" align="center"></el-table-column>
        <el-table-column prop="MName" label="api接口" align="center"></el-table-column>
        <el-table-column prop="orderSort" label="Sort" align="center"></el-table-column>

        <el-table-column prop="isButton" label="是否是按钮" align="center">
          <template #default="scope">
            <el-tag
              :type="!scope.row.isButton == true  ? 'success' : 'danger'"
              disable-transitions
            >{{!scope.row.isButton == true ? "是":"否"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="func" label="按钮事件" align="center"></el-table-column>
        <el-table-column prop="isHide" label="是否隐藏" align="center">
          <template #default="scope">
            <el-tag
              :type="!scope.row.isHide == true  ? 'success' : 'danger'"
              disable-transitions
            >{{!scope.row.isHide == true ? "是":"否"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="iskeepAlive" label="KeepLive" align="center">
          <template #default="scope">
            <el-tag
              :type="!scope.row.iskeepAlive == true  ? 'success' : 'danger'"
              disable-transitions
            >{{!scope.row.iskeepAlive == true ? "是":"否"}}</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="50"
          :total="pageTotal"
          @current-change="handlePageChange"
          style="float:right;"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <!-- <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="接口描述">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="接口">
          <el-input v-model="form.linkUrl"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.enabled" placeholder="状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序">
          <el-input v-model="form.orderSort"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>-->

    <!-- 新增弹出框 -->
    <el-dialog title="添加" v-model="addVisible" width="30%">
      <el-form :model="addform" label-width="70px">
        <el-form-item label="菜单名称" prop="Name">
          <el-input v-model="addform.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单类型">
          <el-radio-group @change="clkType" v-model="addform.MenuType">
            <el-radio label="目录"></el-radio>
            <el-radio label="页面"></el-radio>
            <el-radio label="按钮"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="路由地址" prop="Code">
          <el-input v-model="addform.code" auto-complete="off"></el-input>
          <!-- <el-tooltip placement="top">
         
          
          </el-tooltip>-->
        </el-form-item>

        <el-form-item label="描述" prop="Description">
          <el-input v-model="addform.description" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="Enabled">
          <el-select v-model="addform.enabled" placeholder="请选择状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.Name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="OrderSort">
          <el-input v-model="addform.orderSort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="IsButton" label="是否按钮" width sortable>
          <el-switch v-model="addform.isButton"></el-switch>
        </el-form-item>
        <el-form-item label="按钮事件" prop="Func">
          <el-input v-model="addform.func" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="IsHide" label="隐藏菜单" width sortable>
          <el-switch v-model="addform.isHide"></el-switch>
        </el-form-item>
        <el-form-item prop="IskeepAlive" label="keepAlive" width sortable>
          <el-switch v-model="addform.iskeepAlive"></el-switch>
        </el-form-item>
        <el-form-item prop="PidArr" label="父级菜单" width sortable>
          <el-cascader
            placeholder="请选择，支持搜索功能"
            style="width: 400px"
            v-model="addform.PidArr"
            :options="options"
            filterable
            :key="isResouceShow"
            :props="{ checkStrictly: true , expandTrigger: 'hover'}"
            v-if="!editLoading"
          ></el-cascader>
          <el-cascader placeholder="加载中..." style="width: 400px" v-if="editLoading"></el-cascader>
        </el-form-item>

        <el-form-item prop="Mid" label="API接口" width sortable>
          <el-select style="width: 100%;" v-model="addform.mid" placeholder="请选择API">
            <el-option :key="0" :value="0" :label="'无需api'"></el-option>
            <el-option
              v-for="item in modules"
              :key="item.Id"
              :value="item.Id"
              :label="item.linkUrl"
            >
              <span style="float: left">{{ item.linkUrl }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddModules">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchData } from '../../api/index'
import util from '../../utils/data'

import {
  Assign,
  Get,
  GetTreeTable,
  Post,
  GetPermissionTree,
  GetNavigationBar,
  GetPermissionIdByRoleId,
  Put,
  Delete,
  getModuleListPage,
} from '../../api/Permission.js'

// 接口管理相关接口
import {
  GetModules, // 获取全部得接口
} from '../../api/Module.js'

const editLoading = ref(false)
const lazyTableRef = ref(null)
const filtersName = ref('')
const statusList = ref([
  { name: '激活', value: true },
  { name: '禁用', value: false },
])
const query = reactive({
  Key: '',
  FatherNode: '',
  // page: 1,
  // pageSize: 10,
})
const page = ref('1')
const tableData = ref([])
const pageTotal = ref(0)
// 获取表格数据

const modules = ref([]) //接口api列表
const options = ref([]) //菜单树得数据
const getData = () => {
  query.Key = filtersName.value
  GetTreeTable(query).then((res) => {
    pageTotal.value = res.data.length //总数
    tableData.value = res.data
  })
}

///获取得是接口数据
const getData1 = () => {
  GetModules(query).then((res) => {
    console.log('获取接口信息列表', res)
    modules.value = res.data.list
    console.log('获取接口信息列表', res.data.list)
  })
}

///获取菜单树得接口
const getData2 = (id) => {
  GetPermissionTree({ pid: id }).then((res) => {
    console.log('获取菜单树', res)
    // 菜单树得数据
    options.value.push(res.data)
  })
}

onMounted(() => {
  setTimeout(() => {
    getData()
    getData1()
  }, 500)
})

// 查询操作
const handleSearch = () => {
  page.value = 1
  getData()
}
// 分页导航
function handlePageChange(val) {
  page.value = val
  getData()
}

// 删除操作
const handleDelete = (index, row) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      // DeleteModule({ id: row.Id.toString() }).then((res) => {
      //   ElMessage.success('删除成功')
      //   getData()
      // // })

      const store = lazyTableRef.value.store
      //判断是父还是子
      if (item.hasOwnProperty('HasChildren')) {
        //父对象删除
        console.log(74, store.states.data.value)
        const fatherList = store.states.data.value
        //删除
        const delIndex = fatherList.findIndex((i) => item.ID === i.ID)
        Delete({ id: delIndex }).then((res) => {
          ElMessage.success('删除成功')
          getData()
        })
      } else {
        //子对象删除
        const childList = store.states.lazyTreeNodeMap.value[item.parentId]
        //删除
        const delIndex = childList.findIndex((i) => item.ID === i.ID)
        Delete({ id: delIndex }).then((res) => {
          ElMessage.success('删除成功')
          getData()
        })
      }
    })
    .catch(() => {})
}

// 表格编辑时弹窗和保存
const editVisible = ref(false)

let form = reactive({
  Id: 0,
  createBy: '',
  name: '',
  enabled: false,
  linkUrl: '',
  orderSort: '',
})

let idx = -1
const handleEdit = (index, row) => {
  idx = index
  console.log('打印传递过来的信息row', row)
  Object.keys(form).forEach((item) => {
    form[item] = row[item]
  })

  console.log('打印传递过来的信息form', form)
  editVisible.value = true
}
const saveEdit = () => {
  PutModule(form).then((res) => {
    editVisible.value = false
    getData()
    // ElMessage.success(`修改第 ${idx + 1} 行成功`)
  })
}
const addVisible = ref(false) // 增加窗口控制器
const addLoading = ref(false)

let addform = reactive({
  CreateBy: '',
  CreateId: '',
  PidArr: [],
  mid: 0,
  orderSort: 0,
  name: '',
  code: '',
  description: '',
  icon: '',
  func: '',
  enabled: true,
  isButton: false,
  isHide: false,
  iskeepAlive: false,
  MenuType: '',
})
//现实新增界面
const HandleAdd = () => {
  addVisible.value = true
  options.value = []
  addLoading.value = true

  addform = {
    CreateBy: '',
    CreateId: '',
    PidArr: [],
    mid: 0,
    orderSort: 0,
    name: '',
    code: '',
    description: '',
    icon: '',
    func: '',
    enabled: true,
    isButton: false,
    isHide: false,
    iskeepAlive: false,
    MenuType: '',
  }
  getData2()
  //
}

const AddModules = () => {
  PostModules(addform).then((res) => {
    getData() //获取用户的角色信息
  })
}

const load = (tree, treeNode, resolve) => {
  //根据父组件的id通过接口得到子数据， 这里用setTimeout模拟
  setTimeout(() => {
    var f = tree.id.toString()
    let para = {
      Key: filtersName.value,
      FatherNode: f,
    }
    console.log('=================tree======', tree)
    console.log('===================para====', para)
    GetTreeTable(para).then((res) => {
      console.log('===================res====', res)
      resolve(res.data)
    })
  }, 500)
}

function formatSex(row) {
  return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
}
function formatCreate(row) {
  return !row.createTime || row.createTime == ''
    ? ''
    : util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd')
}

function clkType() {
  addform.isButton = false
  if (addform.MenuType == '页面') {
    addform.code = ''
  } else if (addform.MenuType == '目录') {
    addform.code = '-'
  } else if (addform.MenuType == '按钮') {
    addform.code = ' '
    addform.isButton = true
  }
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
