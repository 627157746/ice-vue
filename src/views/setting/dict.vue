<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-input v-model="query.name" placeholder="名称" size="mini" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
        <el-input v-model="query.type" placeholder="类型" size="mini" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
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
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="list"
      border
      height="700"
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
        label="字典名称"
      />
      <el-table-column
        prop="type"
        label="类型"
      />
      <el-table-column
        prop="system"
        label="字典类型"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSystem?'danger':'success'">{{ scope.row.isSystem?'系统类':'业务类' }}</el-tag>
        </template>
      </el-table-column>
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
          <el-tooltip class="item" effect="dark" content="字典项" placement="top-start">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-menu"
              @click="handelOpenDictItemDialog(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.current"
      :limit.sync="query.size"
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
            <el-form-item label="字典名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入字典名称" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-input v-model="form.type" placeholder="请输入类型" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典类型" prop="isSystem">
              <el-select v-model="form.isSystem" placeholder="请选择字典类型" value="isSystem" size="small">
                <el-option
                  v-for="item in dictType"
                  :key="item.id"
                  :label="item.label"
                  :value="Boolean(Number(item.value))"
                />
              </el-select>
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
      title="字典数据"
      :visible.sync="openDictItemDialog"
      append-to-body
      center
      width="60%"
    >
      <dict-item :dict="dict" />
    </el-dialog>
  </div>
</template>

<script>
import { pageDictsByQuery, getDictById, addDict, updateDict, delDictById, getDictItemsByType } from '@/api/dict'
import DictItem from './components/DictItem'
import Pagination from '@/components/Pagination'
export default {
  name: 'Dict',
  components: { Pagination, DictItem },
  data() {
    return {
      list: null,
      initLoading: false,
      total: 0,
      query: {
        current: 1,
        size: 20,
        name: null,
        type: null
      },
      title: '',
      open: false,
      openDictItemDialog: false,
      dict: {},
      form: {},
      formIsDisable: false,
      formIsAdd: true,
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        isSystem: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      },
      dictType: []
    }
  },
  created() {
    this.getList()
    this.getDictType()
  },
  methods: {
    getList() {
      this.initLoading = true
      pageDictsByQuery(this.query).then(res => {
        this.initLoading = false
        this.list = res.data.records
        this.total = res.data.total
      }).catch(() => {
        this.initLoading = false
      })
    },
    getDictType() {
      getDictItemsByType('dict_type').then(res => {
        this.dictType = res.data
      })
    },
    handleResetQuery() {
      this.query = {
        current: 1,
        size: 20,
        name: null,
        type: null
      }
      this.getList()
    },
    closeDialog() {
      this.$refs.form.resetFields()
      this.open = false
    },
    resetForm() {
      this.form = {
        name: undefined,
        type: undefined,
        isSystem: undefined,
        remarks: undefined
      }
    },
    handleCreate() {
      this.resetForm()
      this.formIsDisable = false
      this.formIsAdd = true
      this.open = true
      this.title = '添加字典信息'
    },
    handleEdit(id) {
      this.resetForm()
      this.formIsDisable = false
      this.formIsAdd = false
      getDictById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '编辑字典信息'
      })
    },
    handleAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addDict(this.form).then(res => {
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
          updateDict(this.form).then(res => {
            this.$message.success('修改成功！')
            this.open = false
            this.getList()
          })
        }
      })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDictById(id).then(res => {
          this.$message.success('删除成功！')
          this.getList()
        })
      })
    },
    handelOpenDictItemDialog(dict) {
      this.dict = dict
      this.openDictItemDialog = true
    }
  }

}
</script>

<style scoped>

</style>
