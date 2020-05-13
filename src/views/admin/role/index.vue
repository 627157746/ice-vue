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
  </div>
</template>

<script>
import { pageByQuery } from '@/api/role'
import Pagination from '@/components/Pagination'
export default {
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      list: null,
      initLoading: false,
      query: {
        pageNum: 1,
        pageSize: 20,
        name: null
      },
      total: 0
    }
  },
  created() {
    this.getList()
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
    handleResetQuery() {
      this.query.name = null
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
