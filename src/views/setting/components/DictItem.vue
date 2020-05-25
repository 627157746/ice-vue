<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-input v-model="query.label" placeholder="标签" size="mini" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
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
        prop="label"
        label="标签"
      />
      <el-table-column
        prop="value"
        label="值"
      />
      <el-table-column
        prop="type"
        label="类型"
      />
      <el-table-column
        prop="sort"
        label="排序"
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
            <el-form-item label="标签" prop="label">
              <el-input v-model="form.label" placeholder="请输入标签" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值" prop="value">
              <el-input v-model="form.value" placeholder="请输入值,布尔值0为false,1为true" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-input v-model="form.type" size="small" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.remarks" placeholder="请输入备注" size="small" />
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
import { pageDictItemsByQuery, getDictItemById, addDictItem, updateDictItem, delDictItemById } from '@/api/dict'
import Pagination from '@/components/Pagination'
export default {
  name: 'DictItem',
  components: { Pagination },
  props: {
    dict: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: null,
      initLoading: false,
      total: 0,
      query: {
        current: 1,
        size: 20,
        dictId: this.dict.id,
        label: null
      },
      title: '',
      open: false,
      form: {},
      formIsDisable: false,
      formIsAdd: true,
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        label: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      dictType: []
    }
  },
  watch: {
    dict() {
      this.query.dictId = this.dict.id
      this.query.label = null
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.initLoading = true
      pageDictItemsByQuery(this.query).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.initLoading = false
      })
    },
    handleResetQuery() {
      this.query = {
        current: 1,
        size: 20,
        dictId: this.dict.id,
        label: null
      }
      this.getList()
    },
    closeDialog() {
      this.$refs.form.resetFields()
      this.open = false
    },
    resetForm() {
      this.form = {
        label: undefined,
        value: undefined,
        type: this.dict.type,
        sort: 0,
        remarks: undefined,
        dictId: this.dict.id
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
      getDictItemById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '编辑字典信息'
      })
    },
    handleAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addDictItem(this.form).then(res => {
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
          updateDictItem(this.form).then(res => {
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
        delDictItemById(id).then(res => {
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
