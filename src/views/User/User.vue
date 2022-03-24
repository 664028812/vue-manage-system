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
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">增加</el-button>
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
        <el-table-column prop="uStatus" label="状态" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center"></el-table-column>
        <el-table-column prop="age" label="年龄" align="center"></el-table-column>
        <el-table-column prop="birth" label="生日" align="center"></el-table-column>
        <el-table-column prop="addr" label="地址" align="center"></el-table-column>
        <!-- <el-table-column label="账户密码">
          <template #default="scope">￥{{ scope.row.uLoginPWD }}</template>
        </el-table-column>-->
        <!-- <el-table-column label="头像(查看大图)" align="center">
          <template #default="scope">
            <el-image
              class="table-td-thumb"
              :src="scope.row.thumb"
              :preview-src-list="[scope.row.thumb]"
            ></el-image>
          </template>
        </el-table-column>-->
        <!-- <el-table-column prop="address" label="地址"></el-table-column> -->
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.uStatus === '1'
                  ? 'success'
                  : scope.row.uStatus === '0'
                  ? 'danger'
                  : ''
              "
            >{{ scope.row.uStatus }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="uCreateTime" label="注册时间" align="center"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <!-- <template #default="scope">
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
          </template>-->
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
        <el-form-item label="登录名">
          <el-input v-model="form.uLoginName"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.uLoginName"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.uStatus"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.uRemark"></el-input>
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
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.addr"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchData } from '../../api/index'
import {
  GetAllUser,
  DeleteUser,
  GetUserInfoById,
  Register,
  UpdateUser,
} from '../../api/User.js'
export default {
  name: 'usermanagement',
  setup() {
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
        console.log('获取用户信息数据', res)
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
    const handleDelete = (index) => {
      // 二次确认删除
      console.log('handleDelete', index)

      ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning',
      })
        .then(() => {
          ElMessage.success('删除成功')
          tableData.value.splice(index, 1)
        })
        .catch(() => {})
    }

    // 表格编辑时弹窗和保存
    const editVisible = ref(false)
    let form = reactive({
      uID: '',
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
      console.log('handleEdit', index)
      console.log('handleEdit', row.uID)
      idx = index

      Object.keys(form).forEach((item) => {
        form[item] = row[item]
      })
      //直接数据赋值算了， 懒得重更新请求一次 多无聊的。

      editVisible.value = true
    }
    const saveEdit = () => {
      editVisible.value = false
      ElMessage.success(`修改第 ${idx + 1} 行成功`)
      // Object.keys(form).forEach((item) => {
      //   tableData.value[idx][item] = form[item]
      // })

      //post 数据到服务端
      UpdateUser(form).then((res) => {
        console.log('更新结果？/?/???', res)
      })
    }

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
    }
  },
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
