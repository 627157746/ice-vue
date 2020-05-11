<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-tree
          :data="deptTreeData"
          default-expand-all
          @node-click="deptTreeClick"
        />
      </el-col>
      <el-col :span="18">
        <div class="filter-container">
          <el-row>
            <el-input v-model="query.username" placeholder="用户名" size="mini" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
            <el-input v-model="query.phone" placeholder="手机号" size="mini" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
            <el-select v-model="query.lockAccount" placeholder="用户状态" size="mini" value="status">
              <el-option
                v-for="item in userStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-button v-waves class="filter-item" size="mini" type="success" icon="el-icon-search" @click="getList">
              查询
            </el-button>
            <el-button class="filter-item" size="mini" icon="el-icon-refresh" @click="handleResetQuery">
              重置
            </el-button>
          </el-row>
          <el-row>
            <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="handleCreate">
              添加
            </el-button>
            <el-button class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="handleDelByIds">
              批量删除
            </el-button>
          </el-row>
        </div>
        <el-table
          v-loading="initLoading"
          :data="list"
          border
          size="medium"
          highlight-current-row
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="id"
            label="序号"
            width="100"
          />
          <el-table-column
            prop="username"
            label="用户名"
            width="150"
          />
          <el-table-column
            prop="nickname"
            label="昵称"
            width="150"
          />
          <el-table-column
            prop="phone"
            label="手机号"
            width="150"
          />
          <el-table-column
            prop="deptName"
            label="部门"
            width="150"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="170"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-view"
                  @click="handleView(scope.row.id)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.row.id)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDel(scope.$index, scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="query.pageNum"
          :limit.sync="query.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="formIsDisable">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像地址" prop="avatar">
              <el-input v-model="form.avatar" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptName">
              <!--<el-input v-model="form.deptName" size="small" />-->
              <el-cascader
                :options="deptTreeData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roles">
              <el-select v-model="form.roleIds" multiple placeholder="请选择角色" value="roles" size="small">
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.remarks"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                size="small"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改时间">
              <el-date-picker
                v-model="form.updateTime"
                type="datetime"
                size="small"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-switch
                v-model="form.lockAccount"
                active-color="#ff4949"
                inactive-color="#13ce66"
                active-text="锁定"
                inactive-text="正常"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remarks" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { deptTree } from '@/api/dept'
import { pageByQuery, getById } from '@/api/user'
import { getRoles } from '@/api/role'
import Pagination from '@/components/Pagination'
export default {
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      list: null,
      initLoading: false,
      deptTreeData: null,
      roles: [],
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 20,
        phone: null,
        lockAccount: false,
        username: null,
        deptId: null
      },
      title: '',
      open: false,
      form: {},
      formIsDisable: false,
      rules: {
        username: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        roles: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      userStatus: [
        { label: '正常', value: false },
        { label: '锁定', value: true }
      ]
    }
  },
  created() {
    this.getDeptTree()
    this.getList()
    this.getRoleList()
  },
  methods: {
    getDeptTree() {
      deptTree().then(res => {
        this.deptTreeData = res.data
      })
    },
    getRoleList() {
      getRoles().then(res => {
        this.roles = res.data
      })
    },
    deptTreeClick(data) {
      this.query.deptId = data.id
      this.getList()
    },
    getList() {
      this.initLoading = true
      pageByQuery(this.query).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.initLoading = false
      })
    },
    handleResetQuery() {
      this.query.username = null
      this.query.phone = null
      this.query.deptId = null
      this.getList()
    },
    resetForm() {
      this.form = {
        username: undefined,
        nickname: undefined,
        phone: undefined,
        avatar: undefined,
        deptName: undefined,
        roles: [],
        roleIds: [],
        createTime: undefined,
        updateTime: undefined,
        lockAccount: false,
        remarks: undefined
      }
    },
    handleCreate() {
      this.resetForm()
      this.formIsDisable = false
      this.open = true
      this.title = '添加用户信息'
    },
    handleView(id) {
      this.resetForm()
      this.formIsDisable = true
      getById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '查看用户信息'
      })
    },
    async handleEdit(id) {
      this.resetForm()
      this.formIsDisable = false
      await getById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '编辑用户信息'
      })
    }
  }

}
</script>

<style scoped>

</style>
