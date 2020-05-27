<template>
  <div class="app-container">
    <div class="item">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header">
              <span>CPU信息</span>
            </div>
            <el-table size="small" border :data="host.cpu" style="width: 100%">
              <el-table-column prop="key" label="属性" />
              <el-table-column prop="value" label="值" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <div slot="header">
              <span>内存信息</span>
            </div>
            <el-table size="small" border :data="host.memory" style="width: 100%">
              <el-table-column prop="key" label="属性" />
              <el-table-column prop="value" label="值" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="item">
      <el-row>
        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header">
              <span>服务器信息</span>
            </div>
            <el-table size="small" border :data="host.sys" style="width: 100%">
              <el-table-column prop="key" label="属性" />
              <el-table-column prop="value" label="值" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="item">
      <el-row>
        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header">
              <span>Java虚拟机信息</span>
            </div>
            <el-table size="small" border :data="host.jvm" style="width: 100%">
              <el-table-column prop="key" label="属性" />
              <el-table-column prop="value" label="值" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="item">
      <el-row>
        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header">
              <span>磁盘状态</span>
            </div>
            <div v-for="(item,index) in host.sysFile" :key="index" class="sysFile">
              <el-table size="small" border :data="item" style="width: 100%">
                <el-table-column prop="key" label="属性" />
                <el-table-column prop="value" label="值" />
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getHostInfo } from '@/api/host'
export default {
  name: 'Host',
  data() {
    return {
      timer: null,
      loadingOptions: {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      },
      host: {
        cpu: [],
        memory: [],
        jvm: [],
        sys: [],
        sysFile: []
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.timer = setInterval(this.getHostInfo, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    init() {
      const loading = this.$loading(this.loadingOptions)
      getHostInfo().then(res => {
        loading.close()
        this.host = res.data
      }).catch(() => {
        loading.close()
      })
    },
    getHostInfo() {
      getHostInfo().then(res => {
        this.host = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .item{
    margin: 10px 0;
  }
}
</style>
