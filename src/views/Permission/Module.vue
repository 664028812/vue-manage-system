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
        <el-input v-model="query.Key" placeholder="接口名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>

        <el-button type="primary" icon="el-icon-search" @click="HandleAdd">增加</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="Id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="描述" align="center"></el-table-column>

        <el-table-column prop="linkUrl" label="接口地址" align="center"></el-table-column>

        <!-- <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.enabled == true  ? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.enabled == true ? "正常":"禁用"}}</el-tag>
          </template>
        </el-table-column>-->
        <el-table-column prop="createBy" label="创建者" align="center"></el-table-column>
        <!-- <el-table-column prop="createTime" label="创建时间" align="center">
          <template #default="scope">
            <span>{{ formatCreate(scope.row) }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.page"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
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
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="添加" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="接口描述">
          <el-input v-model="addform.name"></el-input>
        </el-form-item>
        <el-form-item label="接口地址">
          <el-input v-model="addform.linkUrl"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.enabled" placeholder="请选择角色状态">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="排序">
          <el-input v-model="addform.orderSort"></el-input>
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
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchData } from '../../api/index'
import util from '../../utils/data'

// 接口管理相关接口
import {
  BatchPostModules,
  DeleteModule,
  GetModules,
  PostModules,
  PutModule,
} from '../../api/Module.js'
const statusList = ref([
  { name: '激活', value: true },
  { name: '禁用', value: false },
])
const query = reactive({
  Key: '',
  page: 1,
  pageSize: 10,
})
const tableData = ref([])
const pageTotal = ref(0)
// 获取表格数据
const getData = () => {
  GetModules(query).then((res) => {
    console.log('获取接口信息列表', res)
    // tableData.value = res.list
    // pageTotal.value = res.pageTotal || 50
    pageTotal.value = res.data.total //总数
    tableData.value = res.data.list
  })
}
getData()

const HandleAdd = () => {
  addVisible.value = true
}
// 查询操作
const handleSearch = () => {
  query.page = 1
  getData()
}
// 分页导航
const handlePageChange = (val) => {
  query.page = val
  getData()
}

// 删除操作
const handleDelete = (index, row) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning',
  })
    .then(() => {
      // ElMessage.success('删除成功')
      // tableData.value.splice(index, 1)// 前端内存列表删除一个
      DeleteModule({ id: row.Id.toString() }).then((res) => {
        ElMessage.success('删除成功')
        getData()
      })
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
  })
}

const addVisible = ref(false)
let addform = reactive({
  linkUrl: '', // 接口地址
  name: '', // 接口描述
  enabled: false, //状态
  orderSort: 0, //排序
})
const AddModules = () => {
  PostModules(addform).then((res) => {
    getData() //获取用户的角色信息
    addVisible.value = false
  })
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
