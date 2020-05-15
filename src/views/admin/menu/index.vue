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
        prop="routeName"
        label="路由名称"
      />
      <el-table-column
        prop="icon"
        label="图标"
      >
        <template v-if="scope.row.icon" slot-scope="scope">
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
        prop="sort"
        label="排序"
        width="150"
      />
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
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" size="small" />
            </el-form-item>
          </el-col>
          <el-col v-show="form.type==='1'" :span="12">
            <el-form-item label="权限标识" prop="permission">
              <el-input v-model="form.permission" placeholder="权限标识" size="small" />
            </el-form-item>
          </el-col>
          <el-col v-show="form.type==='0'" :span="12">
            <el-form-item label="路径" prop="path">
              <el-input v-model="form.path" placeholder="请输入路径" size="small" />
            </el-form-item>
          </el-col>
          <el-col v-show="form.type==='0'" :span="12">
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" placeholder="请输入图标" size="small" readonly @focus="iconDialog = true">
                <template v-if="form.icon" slot="prepend"><svg-icon :icon-class="form.icon" class-name="disabled" /></template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="form.type==='0'" :span="12">
            <el-form-item label="组件" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件" size="small" />
            </el-form-item>
          </el-col>
          <el-col v-show="form.type==='0'" :span="12">
            <el-form-item label="路由名称" prop="routeName">
              <el-input v-model="form.routeName" placeholder="请输入路由名称" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select
                v-model="form.type"
                placeholder="类型"
                size="small"
                value="type"
                @change="typeChange"
              >
                <el-option
                  v-for="(item,index) in typeSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="form.type==='0'" :span="12">
            <el-form-item label="缓存">
              <el-select v-model="form.noCache" placeholder="缓存" size="small" value="noCache">
                <el-option
                  v-for="(item,index) in noCacheSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="form.type==='0'" :span="12">
            <el-form-item label="隐藏">
              <el-select v-model="form.hidden" placeholder="隐藏" size="small" value="hidden">
                <el-option
                  v-for="(item,index) in hiddenSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="formIsDisable" :span="12">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="form.createTime"
                type="datetime"
                size="small"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col v-show="formIsDisable" :span="12">
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
            <el-form-item label="父节点">
              <el-cascader
                v-model="form.parentId"
                :props="menuProps"
                :options="menuTreeNotWithBtn"
                :show-all-levels="false"
                placeholder="请选择父节点"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="form.type==='0'" :span="12">
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
    <el-dialog
      title="图标选择"
      :visible.sync="iconDialog"
      append-to-body
      center
    >
      <div class="grid">
        <div v-for="item of svgIcons" :key="item" @click="checkIcon(item)">
          <div class="icon-item">
            <svg-icon :icon-class="item" class-name="disabled" />
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree, getById, delById, add, update } from '@/api/menu'
import svgIcons from '@/views/icons/svg-icons'
import { validURL } from '@/utils/validate'

export default {
  name: 'Menu',
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
    const validatePermission = (rule, value, callback) => {
      if (this.form.type === '1' && !value) {
        return callback(new Error('请输入'))
      }
      callback()
    }
    const validatePath = (rule, value, callback) => {
      if (this.form.type === '0' && !value) {
        return callback(new Error('请输入'))
      }
      callback()
    }
    const validateRouteName = (rule, value, callback) => {
      if (this.form.type === '0' && !value) {
        return callback(new Error('请输入'))
      }
      callback()
    }
    const validateComponent = (rule, value, callback) => {
      if (this.form.type === '0') {
        if (!validURL(this.form.path)) {
          if (this.form.parentId === -1) {
            if (value !== 'Layout') {
              return callback(new Error('顶级菜单组件只能为Layout,路径为外链可为空'))
            }
          } else if (!value) {
            return callback(new Error('请输入,路径为外链可为空'))
          }
        }
      }
      callback()
    }
    const validateIcon = (rule, value, callback) => {
      if (this.form.type === '0' && !value) {
        return callback(new Error('请选择'))
      }
      callback()
    }
    return {
      initLoading: false,
      menuTree: [],
      menuTreeNotWithBtn: [],
      title: '',
      open: false,
      iconDialog: false,
      svgIcons,
      form: {},
      formIsDisable: false,
      formIsAdd: true,
      menuProps: {
        checkStrictly: true,
        label: 'name',
        value: 'id',
        emitPath: false
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        permission: [
          { validator: validatePermission, trigger: 'blur' }
        ],
        path: [
          { validator: validatePath, trigger: 'blur' }
        ],
        routeName: [
          { validator: validateRouteName, trigger: 'blur' }
        ],
        component: [
          { validator: validateComponent, trigger: 'blur' }
        ],
        icon: [
          { validator: validateIcon, trigger: 'blur' }
        ]
      },
      noCacheSelect: [
        { label: '是', value: false },
        { label: '否', value: true }
      ],
      hiddenSelect: [
        { label: '是', value: true },
        { label: '否', value: false }
      ],
      typeSelect: [
        { label: '菜单', value: '0' },
        { label: '按钮', value: '1' }
      ]
    }
  },
  created() {
    this.getMenuTreeData()
  },
  methods: {
    getMenuTreeData() {
      this.initLoading = true
      getMenuTree(true).then(res => {
        this.menuTree = res.data
        this.initLoading = false
      })
      getMenuTree(false).then(res => {
        this.menuTreeNotWithBtn = res.data
        const topNode = { 'id': -1, 'name': '顶级菜单' }
        this.menuTreeNotWithBtn.unshift(topNode)
      })
    },
    checkIcon(item) {
      this.form.icon = item
      this.iconDialog = false
    },
    typeChange(value) {
      if (value === '0') {
        this.form.sort = 1
        this.permission = undefined
      } else {
        this.form.sort = 999
        this.form.component = undefined
        this.form.path = undefined
        this.form.icon = undefined
      }
    },
    resetForm() {
      this.form = {
        name: undefined,
        permission: undefined,
        path: undefined,
        icon: undefined,
        type: '0',
        noCache: false,
        hidden: false,
        parentId: -1,
        sort: 1
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
      this.title = '添加菜单信息'
    },
    handleEdit(id) {
      this.resetForm()
      this.formIsDisable = false
      this.formIsAdd = false
      getById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '编辑菜单信息'
      })
    },
    handleView(id) {
      this.resetForm()
      this.formIsDisable = true
      getById(id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '查看菜单信息'
      })
    },
    handleAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          add(this.form).then(res => {
            this.$message.success('添加成功！')
            this.open = false
            this.getMenuTreeData()
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
            this.getMenuTreeData()
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
        delById(id).then(res => {
          this.$message.success('删除成功！')
          this.getMenuTreeData()
        })
      })
    }
  }

}
</script>

<style lang="scss" scoped>
    .grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

      .icon-item {
        margin: 20px;
        height: 50px;
        text-align: center;
        width: 100px;
        float: left;
        font-size: 20px;
        color: #24292e;
        cursor: pointer;
      }

      span {
        display: block;
        font-size: 16px;
        margin-top: 10px;
      }

      .disabled {
        pointer-events: none;
      }
    }
</style>
