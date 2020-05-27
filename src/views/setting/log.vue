<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-input
          v-model="query.createBy"
          placeholder="操作人"
          size="mini"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="getList"
        />
        <el-date-picker
          v-model="time"
          type="datetimerange"
          value-format="timestamp"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="getList">
          查询
        </el-button>
        <el-button class="filter-item" size="mini" icon="el-icon-refresh" @click="handleResetQuery">
          重置
        </el-button>
      </el-row>
      <el-row>
        <el-button class="filter-item" size="mini" type="danger" icon="el-icon-delete" @click="handleDelByIds">
          批量删除
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
        type="selection"
        width="55"
      />
      <el-table-column
        prop="id"
        label="序号"
        width="100"
      />
      <el-table-column
        prop="title"
        label="日志标题"
      />
      <el-table-column
        prop="createBy"
        label="操作人"
      />
      <el-table-column
        prop="ip"
        label="ip"
      />
      <el-table-column
        prop="time"
        label="请求时间(ms)"
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
      <el-form ref="form" :model="form" label-width="80px" :disabled="formIsDisable">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志标题">
              <el-input v-model="form.title" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务id">
              <el-input v-model="form.serviceId" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人">
              <el-input v-model="form.createBy" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ip">
              <el-input v-model="form.ip" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户代理">
              <el-input v-model="form.userAgent" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址">
              <el-input v-model="form.requestUri" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方法">
              <el-input v-model="form.method" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求参数">
              <el-input v-model="form.params" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求时间">
              <el-input v-model="form.time" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                size="small"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { pageByQuery, getById, delById, delByIds } from '@/api/log'
import Pagination from '@/components/Pagination'

export default {
  name: 'Log',
  components: { Pagination },
  data() {
    return {
      list: null,
      initLoading: false,
      total: 0,
      time: [],
      query: {
        current: 1,
        size: 20,
        startTime: null,
        endTime: null,
        createBy: null
      },
      title: '',
      form: {},
      open: false,
      formIsDisable: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.initLoading = true
      if (this.time.length === 2) {
        this.query.startTime = this.time[0]
        this.query.endTime = this.time[1]
      }
      pageByQuery(this.query).then(res => {
        this.initLoading = false
        this.list = res.data.records
        this.total = res.data.total
      }).catch(() => {
        this.initLoading = false
      })
    },
    handleResetQuery() {
      this.time = []
      this.query = {
        current: 1,
        size: 20,
        startTime: null,
        endTime: null,
        createBy: null
      }
      this.getList()
    },
    closeDialog() {
      this.$refs.form.resetFields()
      this.open = false
    },
    resetForm() {
      this.form = {
        title: undefined,
        serviceId: undefined,
        createBy: undefined,
        ip: undefined,
        userAgent: undefined,
        requestUri: undefined,
        method: undefined,
        params: undefined,
        time: undefined,
        createTime: undefined
      }
    },
    handleView(id) {
      this.resetForm()
      this.formIsDisable = true
      getById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '查看日志信息'
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
    },
    handleDelByIds() {
      this.ids = []
      const selection = this.$refs.table.selection
      if (selection.length < 1) {
        this.$message.error('请至少选择一项！')
      } else {
        selection.forEach(item => {
          this.ids.push(item.id)
        })
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delByIds(this.ids).then(res => {
            this.$message.success('批量删除成功！')
            this.getList()
          })
        })
      }
    }
  }

}
</script>

<style scoped>

</style>
