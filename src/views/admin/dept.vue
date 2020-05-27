<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="handleCreate">
          添加
        </el-button>
      </el-row>
    </div>
    <el-table
      v-loading="initLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="deptTree"
      border
      size="medium"
      highlight-current-row
      default-expand-all
      row-key="id"
      height="700"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="序号"
        width="100"
      />
      <el-table-column
        prop="name"
        label="部门名称"
      />
      <el-table-column
        prop="sort"
        label="排序"
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
        </template>
      </el-table-column>
    </el-table>
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
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户名" size="small" />
            </el-form-item>
          </el-col>
          <el-col v-show="form.id!==1" :span="12">
            <el-form-item label="父节点">
              <el-cascader
                v-model="form.parentId"
                :props="deptTreeProp"
                :options="formDeptTree"
                :show-all-levels="false"
                placeholder="请选择父节点"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number
                v-model="form.sort"
                :min="0"
                :max="999"
                label="排序"
                size="small"
              />
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
  </div>
</template>

<script>
import { deptTree, getById, add, update, delById } from '@/api/dept'
export default {
  name: 'Dept',
  data() {
    return {
      deptTree: [],
      initLoading: false,
      title: '',
      open: false,
      form: {},
      formIsDisable: false,
      formIsAdd: true,
      formDeptTree: [],
      deptTreeProp: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        emitPath: false
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDeptTree()
  },
  methods: {
    getDeptTree() {
      this.initLoading = true
      deptTree().then(res => {
        this.initLoading = false
        this.deptTree = res.data
      }).catch(() => {
        this.initLoading = false
      })
    },
    resetForm() {
      this.form = {
        name: undefined,
        sort: 1,
        parentId: 1,
        createTime: undefined,
        updateTime: undefined
      }
    },
    closeDialog() {
      this.$refs.form.resetFields()
      this.open = false
    },
    handleCreate() {
      deptTree(0).then(res => {
        this.formDeptTree = res.data
      })
      this.resetForm()
      this.formIsDisable = false
      this.formIsAdd = true
      this.open = true
      this.title = '添加部门信息'
    },
    handleAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          add(this.form).then(res => {
            this.$message.success('添加成功！')
            this.open = false
            this.getDeptTree()
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
            this.getDeptTree()
          })
        }
      })
    },
    handleEdit(id) {
      this.resetForm()
      this.formIsDisable = false
      this.formIsAdd = false
      deptTree(id).then(res => {
        this.formDeptTree = res.data
      })
      getById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '编辑部门信息'
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
          this.getDeptTree()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
