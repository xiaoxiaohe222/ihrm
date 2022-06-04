<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="user">
            <el-button style="margin-bottom: 20px" size="small" type="primary" icon="el-icon-plus" @click="addRole">
              新增角色
            </el-button>
            <!--          表格-->
            <el-table border :data="settingList" style="width: 100%">
              <el-table-column type="index" width="80" label="序号" align="center" />
              <el-table-column prop="name" label="角色" width="250" align="center" />
              <el-table-column prop="description" label="描述" align="center" />
              <el-table-column prop="address" label="操作" align="center">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--            分页-->
            <el-row style="height: 40px" type="flex" align="middle" justify="end">
              <el-pagination
                layout="prev, pager, next"
                :total="total"
                :current-page.sync="page.page"
                :page-size="page.pagesize"
                @current-change="page=>{getRoleList(page)}"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="配置管理" name="configuration">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
              style="margin-bottom: 50px"
            />
            <!--            表单-->
            <el-form label-width="80px" :model="companyInfo">
              <el-form-item label="公司名称">
                <el-input v-model="companyInfo.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfo.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司邮箱">
                <el-input v-model="companyInfo.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyInfo.remarks" disabled style="width: 400px" type="textarea" :row="3" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!--      新增或者编辑的弹出层-->
      <el-dialog
        title="编辑名称"
        :visible.sync="showDialog"
        width="40%"
        center
        :before-close="handleClose"
      >
        <el-form ref="roleDialogRef" :model="currentRoleObj" :rules="rules" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="currentRoleObj.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="currentRoleObj.description" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelBtn">取 消</el-button>
          <el-button type="primary" @click="confirmBtn">确 定</el-button>
        </span>
      </el-dialog>
      <!--      新增权限弹出框:before-close="handleClose"-->
      <el-dialog
        title="分配权限"
        :visible.sync="showPermDialog"
        center
        :before-close="handlePermClose"
      >
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          default-expand-all
          :check-strictly="true"
          node-key="id"
          icon-class="el-icon-share"
          highlight-current
          :default-checked-keys="selectedKeys"
        />
        <span slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="btnPermOk">确 定</el-button>
          <el-button size="small" @click="btnPermCancel">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, reqDelRole, reqUpdateRole, addRole, getDetail, assignPerm } from '@/api/setting'
import { mapState } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permisson'

export default {
  name: 'Setting',
  data() {
    return {
      activeName: 'user',
      page: {
        page: 1, // 当前第几页
        pagesize: 5// 每页显示的条数
      },
      total: 0,
      settingList: [],
      companyInfo: {},
      showDialog: false,
      currentRoleObj: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermDialog: false,
      defaultProps: { label: 'name' },
      treeData: [],
      selectedKeys: [],
      roleId: ''
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  created() {
    this.getRoleList()
    this.getCompanyDetail(this.userInfo.companyId)
  },
  methods: {
    handlePermClose() {
      this.selectedKeys = []
    },
    async assignPerm(id) {
      this.selectedKeys = []
      this.showPermDialog = true
      this.roleId = id
      const res = await getPermissionList()
      this.treeData = tranListToTreeData(res.data, '0')
      // 获取当前用户的已有权限数据
      const { data: { permIds }} = await getDetail(id)
      this.selectedKeys = permIds
    },
    btnPermCancel() {
      this.showPermDialog = false
    },
    async btnPermOk() {
      await assignPerm({ id: this.roleId, permIds: this.$refs.tree.getCheckedKeys() })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    handleClick(tab) { // 切换tab的点击事件
      this.activeName = tab.name
    },
    async getRoleList(page = 1) { // 获取全部的列表数据
      this.page.page = page
      const res = await getRoleList(this.page)
      if (res.success) {
        this.total = res.data.total
        this.settingList = res.data.rows
      }
    },
    async getCompanyDetail(id) { // 获取公司详细信息
      const res = await getCompanyInfo(id)
      if (res.success) {
        this.companyInfo = res.data
      }
    },
    delRole(id) {
      this.$confirm('你确定要删除吗？',
        {
          'confirmButtonText': '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(
        () => {
          return reqDelRole(id)
        }
      ).then(
        (value) => {
          if (value.success) {
            this.$message.success(value.message)
            if (this.page.page !== 1 && this.settingList.length === 1) {
              this.page.page -= 1
              this.getRoleList(this.page.page)
            } else {
              this.getRoleList()
            }
          }
        }
      ).catch(() => {
      })
    },
    handleClose() { // 点击弹出框的叉号码
      this.showDialog = false
    },
    editRole(row) {
      this.showDialog = true
      this.currentRoleObj = { ...row }
    },
    cancelBtn() {
      this.showDialog = false
    },
    confirmBtn() {
      this.$refs.roleDialogRef.validate(async(isOk) => {
        if (isOk) { // 表示表单校验通过
          this.currentRoleObj.permIds = []
          if (this.currentRoleObj.id) {
            await reqUpdateRole(this.currentRoleObj)
            this.$message.success('更新成功')
          } else {
            this.currentRoleObj.region = this.currentRoleObj.description
            await addRole(this.currentRoleObj)
            this.$message.success('添加成功')
          }
          this.showDialog = false
          this.getRoleList()
        } else {
          this.$message.warning('请先完善正确的表单数据')
        }
      })
    },
    addRole() {
      this.currentRoleObj = {}
      this.showDialog = true
      this.$refs.roleDialogRef.resetFields()
    }
  }
}
</script>

<style lang="scss">
.el-dialog__header {
  text-align: left;
  background-color: #409EFF;

  .el-dialog__title {
    color: white;
  }
}

.el-dialog__headerbtn .el-dialog__close {
  color: white;
}
</style>
