<template>
  <el-dialog
    title="新增员工"
    :visible.sync="showAddDialog"
    center
    :before-close="handleClose"
  >
    <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="addForm.username" style="width:50%" placeholder="请输入姓名"/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="addForm.mobile" style="width:50%" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="addForm.timeOfEntry"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          style="width:40%"
          placeholder="请选择入职时间"
          type="datetime"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="addForm.formOfEmployment" style="width:30%" placeholder="请选择聘用形式">
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="addForm.workNumber" style="width:50%" placeholder="请输入工号"/>
      </el-form-item>
      <!--      选择部门-->
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="addForm.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @focus="getDepartsList"
        />
        <div>
          <el-tree
            v-show="showTree"
            v-loading="loading"
            :data="depts"
            default-expand-all
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间">
        <el-date-picker v-model="addForm.correctionTime" style="width:40%" placeholder="请选择转正时间"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancelBtn">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import employeeCons from '@/api/constant/employees'
import { reqDepartmentList } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employees'

export default {
  name: 'AddEmployee',
  props: {
    showAddDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      showTree: false,
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      hireType: employeeCons.hireType,
      addForm: {
        username: '', // 姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 组织名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleClose() {
      this.cancelBtn()
    },
    async getDepartsList() {
      if (this.depts.length) {
        this.showTree = true
        return
      }
      this.loading = true
      const res = await reqDepartmentList()
      this.depts = tranListToTreeData(res.data.depts, '')
      this.showTree = true
      this.loading = false
    },
    handleNodeClick(data) {
      this.addForm.departmentName = data.name
      this.showTree = false
    },
    async onSubmit() {
      try {
        await this.$refs.addForm.validate()
        // 能走到这里表示表单校验通过
        await addEmployee(this.addForm)
        this.$message.success('添加成功')
        this.$parent.getList(1)
        this.$emit('update:showAddDialog', false)
      } catch (e) {
        this.$message.warning('表单校验不通过')
      }
    },
    cancelBtn() {
      this.addForm = this.$options.data().addForm
      this.$refs.addForm.resetFields()
      this.$emit('update:showAddDialog', false)
    }
  }
}
</script>
<style scoped lang="scss">

</style>
