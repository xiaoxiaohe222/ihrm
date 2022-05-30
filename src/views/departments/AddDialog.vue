<template>
  <el-dialog
    :title="deptForm.id ? '编辑部门' : '新增部门' "
    :visible.sync="showDialog"
    width="40%"
    center
    :before-close="handleClose"
  >
    <!--    表单部分-->
    <el-form ref="deptForm" :model="deptForm" :rules="deptRules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="deptForm.name" style="width: 80%" placeholder="1-50个字符"/>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="deptForm.code" style="width: 80%" placeholder="1-50个字符"/>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="deptForm.manager" style="width: 30%" placeholder="请选择" @focus="getEmployees">
          <el-option
            v-for="item in employees"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="deptForm.introduce" style="width: 80%" type="textarea" :row="3" placeholder="1-300个字符"/>
      </el-form-item>
    </el-form>
    <!--    底部的插槽部分-->
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="cancel">取 消</el-button>
      <el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { reqDepartmentList, reqAddDept, reqDepartDetail, reqUpdateDepart } from '@/api/departments'
import { reqEmployeesSimple } from '@/api/employees'

export default {
  name: 'AddDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: true
    },
    nodeData: {
      type: Object,
      required: false
    }
  },
  data() {
    const validateName = async(rule, value, callback) => {
      //  同级部门中有没有出现过该部门名称
      const res = await reqDepartmentList()
      const deptList = res.data.depts // 这里为什么必须重新发氢气而不是从父组件里面传递，因为如果我一直停留在该页面，之前的数据早变了
      // 这里需要判断是新增还是编辑的情况
      let isRepeat
      if (this.deptForm.id) {
        // 编辑是找到相同的pid下面的id
        isRepeat = deptList.filter(item => item.pid === this.deptForm.pid && item.id !== this.deptForm.id).some(item => item.name === value)
      } else {
        // 新增则是找到相同谁的pid是我的id
        isRepeat = deptList.filter(item => item.pid === this.nodeData.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`${value}该名字重复了`)) : callback()
    }
    const validateCode = async(rule, value, callback) => {
      const res = await reqDepartmentList()
      const deptList = res.data.depts
      let isRepeat
      if (this.deptForm.id) {
        // 编辑是找到相同的pid下面的id
        isRepeat = deptList.filter(item => item.id !== this.deptForm.id).find((item) => item.code === value)
      } else {
        // 新增则是找到相同谁的pid是我的id
        isRepeat = deptList.find((item) => item.code === value) && value
      }
      // 部门编码在整个模块中都不允许出现
      isRepeat ? callback(new Error(`整个模块中不允许出现重复的code`)) : callback()
    }
    return {
      deptForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 负责人名称
        introduce: '', // 介绍
        pid: '' // 父级部门ID
      },
      deptRules: {
        name: [// 必填 1-50个字符 同级部门中禁止出现重复部门
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
        ]
      },
      employees: [] // 所有的员工列表
    }
  },
  watch: {},
  created() {
  },
  methods: {
    async getDepartDetail(id) {
      const res = await reqDepartDetail(id)
      this.deptForm = res.data
    },
    handleClose() {
      // 通知父组件关闭dialog
      this.$emit('update:showDialog', false)
      // 重置表单数据
      this.deptForm = this.$options.data().deptForm
      this.$refs.deptForm.resetFields()
    },
    cancel() {
      // 通知父组件关闭dialog
      this.$emit('update:showDialog', false)
      // 重置表单数据
      this.deptForm = this.$options.data().deptForm
      this.$refs.deptForm.resetFields()
    },
    onSubmit() {
      this.$refs.deptForm.validate(async(isOk) => {
        if (isOk) {
          // 说明表单校验成功
          let res
          if (this.deptForm.id) {
            res = await reqUpdateDepart(this.deptForm)
          } else {
            this.deptForm.pid = this.nodeData.id
            res = await reqAddDept(this.deptForm)
          }
          // 通知父组件更新数据
          this.$emit('addDept')
          // 通知父组件关闭dialog
          this.$emit('update:showDialog', false)
          // 重置表单数据
          this.deptForm = this.$options.data().deptForm
          this.$message.success(res.message)
        }
      })
    },
    async getEmployees() {
      const res = await reqEmployeesSimple()
      if (res.success) {
        this.employees = res.data
      } else {
        this.$message.warning(res.message)
      }
    }
  }
}
</script>
<style scoped lang="scss">

</style>
<style>
.el-dialog__header {
  background-color: #6faff9;
  text-align: left;
}

.el-dialog__title {
  color: white;
}

.el-dialog__headerbtn .el-dialog__close {
  color: white;
}
</style>
