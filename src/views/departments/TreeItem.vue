<template>
  <div style="width: 100%;">
    <el-row style="width: 100%;height: 40px;" :gutter="10" type="flex" align="middle">
      <el-col :span="12">{{ treeNode.name }}</el-col>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ treeNode.manager }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="add">添加子部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
          <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-row>
  </div>
</template>
<script>
import { reqDelDept } from '@/api/departments'

export default {
  name: 'TreeItem',
  props: {
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    async handleCommand(command) {
      if (command === 'add') {
        this.$emit('addDept', this.treeNode)
      } else if (command === 'edit') {
        console.log('修改部门')
        this.$emit('editDept', this.treeNode)
      } else {
        // 表示删除部门
        this.$confirm('确定删除吗？', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            return reqDelDept(this.treeNode.id)
          }).then((val) => {
            if (val.success) {
              this.$message.success('删除成功')
              // 通知
              this.$emit('delDept')
            } else {
              this.$message.error(val.message)
            }
          }).catch(() => {
          })
      }
    }
  }
}
</script>
<style scoped lang="scss">

</style>
