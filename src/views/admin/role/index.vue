<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-input v-model="query.name" placeholder="角色名" size="mini" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="getList">
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
      </el-row>
    </div>
    <el-table
      ref="table"
      v-loading="initLoading"
      :data="list"
      border
      size="medium"
      highlight-current-row
    >
      <el-table-column
        prop="id"
        label="序号"
        width="100"
      />
      <el-table-column
        prop="name"
        label="角色名"
      />
      <el-table-column
        prop="remarks"
        label="备注"
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
        prop="updateTime"
        label="修改时间"
        width="180"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="170"
        fixed="right"
      >
        <template slot-scope="scope">
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
              @click="handleDel(scope.row.id)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="权限" placement="top-start">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-menu"
              @click="handleEditPermission(scope.row.id)"
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      append-to-body
      center
      @close="closeDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="formIsDisable">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户名" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" placeholder="请输入备注" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span v-show="!formIsDisable" slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button v-if="formIsAdd" type="success" @click="handleAdd">提 交</el-button>
        <el-button v-else type="success" @click="handleUpdate">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="权限编辑"
      :visible.sync="permissionDialogOpen"
      append-to-body
      center
      width="30%"
    >
      <el-tree
        ref="menuTree"
        :data="menuTree"
        default-expand-all
        node-key="id"
        check-strictly
        show-checkbox
        :props="menuTreeProp"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogOpen = false">取 消</el-button>
        <el-button type="success" @click="handleUpdatePermission">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageByQuery, getById, getMenuIdsById, add, update, updateRoleMenuById, delById } from '@/api/role'
import { getMenuTree } from '@/api/menu'
import Pagination from '@/components/Pagination'
export default {
  name: 'Role',
  components: { Pagination },
  data() {
    return {
      list: null,
      menuTree: [],
      initLoading: false,
      query: {
        pageNum: 1,
        pageSize: 20,
        name: null
      },
      total: 0,
      title: '',
      open: false,
      permissionDialogOpen: false,
      id: null,
      form: {},
      formIsDisable: false,
      formIsAdd: true,
      menuTreeProp: {
        label: 'name'
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getMenuTreeData()
  },
  methods: {
    getList() {
      this.initLoading = true
      pageByQuery(this.query).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.initLoading = false
      })
    },
    getMenuTreeData() {
      getMenuTree(true).then(res => {
        this.menuTree = res.data
      })
    },
    handleResetQuery() {
      this.query.name = null
      this.getList()
    },
    resetForm() {
      this.form = {
        name: undefined,
        remarks: undefined,
        createTime: undefined,
        updateTime: undefined
      }
    },
    closeDialog() {
      this.$refs.form.resetFields()
      this.open = false
    },
    handleCreate() {
      this.resetForm()
      this.formIsDisable = false
      this.formIsAdd = true
      this.open = true
      this.title = '添加角色信息'
    },
    handleAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          add(this.form).then(res => {
            this.$message.success('添加成功！')
            this.open = false
            this.getList()
          })
        }
      })
    },
    handleUpdate() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          delete this.form.updateTime
          update(this.form).then(res => {
            this.$message.success('修改成功！')
            this.open = false
            this.getList()
          })
        }
      })
    },
    handleEdit(id) {
      this.resetForm()
      this.formIsDisable = false
      this.formIsAdd = false
      getById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '编辑角色信息'
      })
    },
    handleEditPermission(id) {
      this.id = null
      getMenuIdsById(id).then(res => {
        this.permissionDialogOpen = true
        this.id = id
        this.$nextTick(() => {
          this.$refs.menuTree.setCheckedKeys(res.data)
        })
      })
    },
    handleUpdatePermission() {
      this.$nextTick(() => {
        const menuIds = this.$refs.menuTree.getCheckedKeys()
        updateRoleMenuById(this.id, menuIds).then(res => {
          this.$message.success('修改成功！')
          this.permissionDialogOpen = false
          this.getList()
        })
      })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delById(id).then(res => {
          this.$message.success('删除成功！')
          this.getList()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
