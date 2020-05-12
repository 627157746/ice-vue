<template>
  <div class="app-container">
    <el-table
      v-loading="initLoading"
      :data="menuTree"
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
        label="菜单id"
        width="150"
      />
      <el-table-column
        prop="name"
        label="菜单名称"
        width="150"
      />
      <el-table-column
        prop="permission"
        label="权限标识"
        width="150"
      />
      <el-table-column
        prop="path"
        label="路径"
        width="250"
      />
      <el-table-column
        prop="icon"
        label="图标"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column
        prop="component"
        label="组件"
      />
      <el-table-column
        prop="type"
        label="类型"
      >
        <template slot-scope="scope">
          {{ scope.row.type | typeFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="noCache"
        label="缓存"
      >
        <template slot-scope="scope">
          <el-tag :type="!scope.row.noCache?'success':'danger'">
            {{ !scope.row.noCache | booleanFormat }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="hidden"
        label="是否隐藏"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.hidden?'success':'danger'">
            {{ scope.row.hidden | booleanFormat }}
          </el-tag>
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
              @click="handleDel(scope.row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMenuTree } from '@/api/menu'
export default {
  name: 'Index',
  filters: {
    booleanFormat(type) {
      const booleanMap = {
        true: '是',
        false: '否'
      }
      return booleanMap[type]
    },
    typeFormat(type) {
      const typeMap = {
        0: '菜单',
        1: '按钮'
      }
      return typeMap[type]
    }
  },
  data() {
    return {
      initLoading: false,
      menuTree: []
    }
  },
  created() {
    this.getMenuTreeData()
  },
  methods: {
    getMenuTreeData() {
      this.initLoading = true
      getMenuTree().then(res => {
        this.menuTree = res.data
        this.initLoading = false
      })
    }
  }

}
</script>

<style scoped>

</style>
