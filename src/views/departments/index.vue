<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!--        第一行的数据-->
        <TreeItem :tree-node="company" :is-root="true" @addDept="addDept" @editDept="editDept" />
        <!--        树形结构区域@node-click="handleNodeClick"-->
        <el-tree :data="departs" default-expand-all :props="defaultProps">
          <!--          插槽-->
          <TreeItem
            slot-scope="{data}"
            :tree-node="data"
            @delDept="getDepartments"
            @addDept="addDept"
            @editDept="editDept"
          />
        </el-tree>
      </el-card>
      <!--      弹出框组件-->
      <AddDialog
        ref="dialog"
        :show-dialog.sync="showDialog"
        :node-data="nodeData"
        @addDept="getDepartments"
      />
    </div>
  </div>
</template>

<script>
import TreeItem from '@/views/departments/TreeItem'
import { reqDepartmentList } from '@/api/departments'
import AddDialog from '@/views/departments/AddDialog'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Departments',
  components: { AddDialog, TreeItem },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: { name: '', manager: '负责人', id: '' },
      showDialog: false, // 是否显示弹出框
      nodeData: {} // 点击添加的当前节点数据
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    addDept(data) { // 绑定的添加部门的自定义事件回调
      this.showDialog = true
      this.nodeData = data
    },
    editDept(data) { // 绑定的添加部门的自定义事件回调
      this.showDialog = true
      this.nodeData = data
      this.$refs.dialog.getDepartDetail(data.id)
    },
    async getDepartments() {
      const res = await reqDepartmentList()
      if (res.code === 10000) {
        this.company.name = res.data.companyName
        // 改造列表数据需要name和children字段
        // 筛选出有pid和没有pid的条目
        this.departs = tranListToTreeData(res.data.depts, '')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}

</style>

