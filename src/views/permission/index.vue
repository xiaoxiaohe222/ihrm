<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-row type="flex" justify="end" align="middle">
          <el-col :span="6">
            <el-button size="small" type="primary" style="float:right;" @click="addPermission(1,'0')">添加权限</el-button>
          </el-col>
        </el-row>
        <!--        表格展示区域-->
        <el-table
          :data="list"
          style="width: 100%;margin-top: 10px;"
          border
          row-key="id"
          :tree-props="{children: 'children'}"
        >
          <el-table-column label="名称" prop="name" />
          <el-table-column align="center" prop="code" label="标识" />
          <el-table-column align="center" prop="description" label="描述" />
          <el-table-column align="center" label="操作">
            <template v-slot="{row}">
              <el-button v-if="row.type === 1" type="text" @click="addPermission(2,row.id)">添加</el-button>
              <el-button type="text" @click="edit(row.id)">编辑</el-button>
              <el-button type="text" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!--    新增编辑弹出框 "-->
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      center
      :before-close="handleClose"
    >
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    handleClose() {
      this.showDialog = false
      this.$nextTick(() => {
        this.$refs.perForm.resetFields()
      })
    },
    async edit(id) {
      const res = await getPermissionDetail(id)
      this.formData = res.data
      this.showDialog = true
    },
    async del(id) {
      try {
        await this.$confirm('确定删除吗？')
        await delPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      } catch (e) {
        console.log('')
      }
    },
    btnCancel() {
      this.showDialog = false
      this.$nextTick(() => {
        this.$refs.perForm.resetFields()
      })
    },
    async btnOk() {
      try {
        await this.$refs.perForm.validate()
        if (this.formData.id) {
          await updatePermission(this.formData)
        } else {
          await addPermission(this.formData)
        }
        this.showDialog = false
        this.getPermissionList()
      } catch (e) {
        // this.$refs.perForm.resetFields()
        this.$message.warning(e.message)
      }
    },
    addPermission(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    async getPermissionList() {
      const res = await getPermissionList()
      this.list = tranListToTreeData(res.data, '0')
    }
  }
}
</script>

<style>

</style>
