<template>
  <div>
    <div class="crumbs">
      <!--  顶部标签 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 用户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.Key" placeholder="用户名" class="handle-input mr10"></el-input>
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
        <el-table-column prop="uID" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="uLoginName" label="用户名" align="center"></el-table-column>
        <el-table-column prop="uRealName" label="真实姓名" align="center"></el-table-column>
        <el-table-column prop="RoleNames" label="角色" width sortable>
          <template #default="scope">
            <el-tag v-for="item in scope.row.RoleNames" :key="item.Id">{{item}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="性别" align="center">
          <template #default="scope">
            <span>{{ formatSex(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="birth" label="生日" align="center">
          <template #default="scope">
            <span>{{ formatBirth(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.uStatus == 0  ? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.uStatus == 0 ? "正常":"禁用"}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="uCreateTime" label="注册时间" align="center">
          <template #default="scope">
            <span>{{ formatBirth(scope.row) }}</span>
          </template>
        </el-table-column>
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
        <el-form-item label="昵称">
          <el-input v-model="form.uRealName"></el-input>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="form.uLoginName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-input v-model="form.uStatus"></el-input>
        </el-form-item>-->

        <el-form-item label="角色">
          <el-select multiple v-model="form.RIDs" placeholder="请选择角色">
            <el-option :key="0" :label="'未选择角色'" :value="0"></el-option>
            <el-option v-for="item in roles" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
          <el-select v-model="form.RIDs" multiple placeholder="Select" style="width: 240px">
            <el-option v-for="item in roles" :key="item.Id" :label="item.name" :value="item.Id" />
          </el-select>
        </el-form-item>

        <el-form-item label="性别">
          <!-- <el-input v-model="form.sex"></el-input> -->
          <el-radio-group v-model="form.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="年龄">
          <!-- <el-input v-model="form.age"></el-input> -->
          <el-input-number v-model="form.age" :min="1" :max="10" />
        </el-form-item>

        <el-form-item label="生日">
          <!-- <el-input v-model="form.birth"></el-input> -->
          <el-date-picker
            v-model="form.birth"
            type="date"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="form.addr"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.uRemark"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 增加弹出框 -->
    <el-dialog title="增加" v-model="AddVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="昵称">
          <el-input v-model="Addform.uRealName"></el-input>
        </el-form-item>
        <el-form-item label="登录名">
          <el-input v-model="Addform.uLoginName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="Addform.uLoginPWD" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <!-- <el-input v-model="form.sex"></el-input> -->
          <el-radio-group v-model="Addform.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="年龄">
          <!-- <el-input v-model="form.age"></el-input> -->
          <el-input-number v-model="Addform.age" :min="1" :max="10" />
        </el-form-item>

        <el-form-item label="生日">
          <!-- <el-input v-model="form.birth"></el-input> -->
          <el-date-picker
            v-model="Addform.birth"
            type="date"
            placeholder="选择日期时间"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="Addform.addr"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="Addform.uRemark"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="AddVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddUser">确 定</el-button>
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
import {
  GetAllUser,
  DeleteUser,
  GetUserInfoById,
  Register,
  UpdateUser,
} from '../../api/User.js'
import { GetRoles } from '../../api/Role.js'
const options = [
  {
    value: '0',
    label: '女',
  },
  {
    value: '1',
    label: '男',
  },
]
const users = ref([])
const roles = ref([])

const GetAllRole = () => {
  //  这里处理用户角色数据
  var query = { id: '' }
  GetRoles(query).then((res) => {
    if (res.code === 0) {
      roles.value = res.data
    }
  })
}
GetAllRole()
const query = reactive({
  Key: '',
  page: 1,
  pageSize: 10,
})
const tableData = ref([])
const pageTotal = ref(0)
// 获取表格数据
const getData = () => {
  GetAllUser(query).then((res) => {
    // tableData.value = res.list
    // pageTotal.value = res.pageTotal || 50
    pageTotal.value = res.data.total //总数
    tableData.value = res.data.list
  })
}
getData()

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
      DeleteUser({ id: row.uID.toString() }).then((res) => {
        ElMessage.success('删除成功')
        tableData.value.splice(index, 1)
      })
    })
    .catch(() => {})
}

// 表格编辑时弹窗和保存
const editVisible = ref(false)
let form = reactive({
  uID: '',
  RIDs: 0,
  uLoginName: '',
  uRealName: '',
  uStatus: 0,
  uRemark: '',
  name: '',
  sex: 1,
  age: 0,
  birth: '',
  addr: '',
})

let idx = -1
const handleEdit = (index, row) => {
  idx = index
  Object.keys(form).forEach((item) => {
    form[item] = row[item]
  })
  editVisible.value = true
  GetAllRole()
}
const saveEdit = () => {
  ElMessage.success(`修改第 ${idx + 1} 行成功`)
  form.birth = util.formatDate.format(new Date(form.birth), 'yyyy-MM-dd')
  UpdateUser(form).then((res) => {
    getData() //获取用户的角色信息
  })
  editVisible.value = false
}

let Addform = reactive({
  uLoginName: '',
  uLoginPWD: '',
  uRealName: '',
  uRemark: '',
  name: '',
  sex: 1,
  age: 0,
  birth: '',
  addr: '',
})

const AddVisible = ref(false) // 增加角色
const AddUser = () => {
  Register(Addform).then((res) => {
    getData() //获取用户的角色信息
    AddVisible.value = false
  })
}
const HandleAdd = () => {
  AddVisible.value = true
}

function formatSex(row) {
  return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知'
}
function formatBirth(row) {
  return !row.birth || row.birth == ''
    ? ''
    : util.formatDate.format(new Date(row.birth), 'yyyy-MM-dd')
}
function formatCreate(row) {
  return !row.uCreateTime || row.uCreateTime == ''
    ? ''
    : util.formatDate.format(new Date(row.uCreateTime), 'yyyy-MM-dd')
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
