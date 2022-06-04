<template>
  <!--  :before-close="handleClose(done)"-->
  <el-dialog
    title="分配角色"
    :visible.sync="showRoleDialog"
    center
    :before-close="handleClose"
  >
    <el-form ref="form" :model="roleForm">
      <el-form-item>
        <el-checkbox-group v-model="roleForm.type">
          <el-checkbox v-for="item in list" :key="item.id" :label="item.id" name="type">
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmBtn">确 定</el-button>
      <el-button @click="cancelBtn">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleForm: {
        type: []
      },
      list: [],
      query: {
        page: 1,
        pagesize: 20
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async confirmBtn() {
      await assignRoles({ id: this.userId, roleIds: this.roleForm.type })
      this.$message.success('分配成功')
      this.$emit('update:showRoleDialog', false)
    },
    cancelBtn() {
      this.$emit('update:showRoleDialog', false)
    },
    handleClose() {
      this.$parent.showRoleDialog = false
    },
    //  获取所有角色
    async getRoleList() {
      const res = await getRoleList(this.query)
      this.list = res.data.rows
    },
    async getUserDetailById(id) {
      const res = await getUserDetailById(id)
      this.roleForm.type = res.data.roleIds || [] // 赋值本用户的角色
    }
  }
}
</script>
<style scoped lang="scss">

</style>
