<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <template v-slot:before>
          <span>共{{ total }}条记录</span>
        </template>
        <template v-slot:after>
          <el-button size="mini" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="mini" type="danger" @click="handleDownload">excel导出</el-button>
          <el-button size="mini" type="warning" @click="handleDownload1">复杂表头excel导出</el-button>
          <el-button size="mini" type="primary" @click="addEmployee">新增员工</el-button>
        </template>
      </PageTools>
      <!--     staffPhoto 表格区域-->
      <el-table v-loading="loading" :data="list" bousernamerder style="width: 100%">
        <el-table-column align="center" width="80" type="index" label="序号"/>
        <el-table-column prop="username" align="center" label="姓名" sortable/>
        <el-table-column align="center" label="头像">
          <template slot-scope="{row}">
            <img
              v-img-error="require('@/assets/common/head.jpg')"
              style="width: 60px;height: 60px"
              :src="row.staffPhoto"
              alt="avatar"
              @click="imgClick(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column prop="mobile" align="center" label="手机号" sortable/>
        <el-table-column prop="workNumber" align="center" label="工号" sortable/>
        <el-table-column prop="formOfEmployment" :formatter="formOfEmployment" align="center" label="聘用形式" sortable/>
        <el-table-column prop="departmentName" align="center" label="部门" sortable/>
        <el-table-column prop="timeOfEntry" align="center" label="入职时间" sortable/>
        <el-table-column prop="" align="center" label="状态" sortable>
          <template>
            <el-switch
              :value="true"
              active-color="#519cf8"
              inactive-color="#dddfe5"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" width="280" label="操作" fixed="right" sortable>
          <template v-slot="{row}">
            <el-button type="text" size="small" @click="$router.push(`employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="assignRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delById(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页 @size-change="handleSizeChange"
        -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          :current-page.sync="pageObj.page"
          :page-size="pageObj.size"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="page=>{getList(page)}"
        />
      </el-row>
      <!--    新增员工的弹出框-->
      <AddEmployee ref="addDialogRef" :show-add-dialog.sync="showAddDialog"/>
      <!--      二维码弹出框-->
      <el-dialog
        title="二维码"
        :visible.sync="showQrcode"
        width="30%"
        :before-close="()=>{showQrcode=false}"
      >
        <img :src="staffPhoto" alt="" style="width: 200px;height: 200px;">
      </el-dialog>
      <!--      分配角色的弹出框-->
      <AssignRole ref="roleRef" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
    </div>
  </div>
</template>

<script>
import { reqEmployeesList, delEmployee } from '@/api/employees'
import employeesCons from '@/api/constant/employees'
import AddEmployee from '@/views/employees/components/add-employee'
import AssignRole from '@/views/employees/components/assign-role'

export default {
  name: 'Employees',
  components: { AssignRole, AddEmployee },
  data() {
    return {
      showRoleDialog: false,
      staffPhoto: '',
      showQrcode: false,
      showAddDialog: false,
      pageObj: {
        page: 1,
        size: 5
      },
      total: 0,
      list: [],
      loading: false,
      userId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async assignRole(id) {
      this.userId = id
      await this.$refs.roleRef.getUserDetailById(id)
      this.showRoleDialog = true
    },
    imgClick(data) {
      this.showQrcode = true
      this.staffPhoto = data
      /* QRCode.toDataURL('I am a pony!')
        .then(url => {
          this.staffPhoto = url
        })
        .catch(err => {
          console.error(err)
        })*/
    },
    parseTime(time, cFormat) {
      if (arguments.length === 0 || !time) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string')) {
          if ((/^[0-9]+$/.test(time))) {
            // support "1548221490638"
            time = parseInt(time)
          } else {
            // support safari
            // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
            time = time.replace(new RegExp(/-/gm), '/')
          }
        }

        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
          return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0')
      })
      return time_str
    },
    async getList(page = 1) {
      this.loading = true
      this.pageObj.page = page
      const res = await reqEmployeesList(this.pageObj)
      if (res.success) {
        this.total = res.data.total
        this.list = res.data.rows
      }
      this.loading = false
    },
    formOfEmployment(row) {
      // 处理聘用形式的函数
      const res = employeesCons.hireType.find(item => item.id === row.formOfEmployment)
      return res ? res.value : '未知'
    },
    async delById(id) { // 删除员工
      try {
        await this.$confirm('确定删除该员工吗？', { cancelButtonText: '取消', confirmButtonText: '确认' })
        const res = await delEmployee(id)
        if (res.success) {
          this.$message.success('删除成功')
          if (this.pageObj.page !== 1 && this.list.length === 1) {
            this.getList(this.pageObj.page - 1)
          } else {
            this.getList(this.pageObj.page)
          }
        }
      } catch (e) {
        // 点击了取消按钮
      }
    },
    addEmployee() {
      this.showAddDialog = true
      this.$refs.addDialogRef.addForm = this.$refs.addDialogRef.$options.data().addForm
      this.$refs.addDialogRef.$nextTick(() => {
        this.$refs.addDialogRef.$refs.addForm.resetFields()
      })
    },
    async handleDownload() {
      import('@/utils/Export2Excel').then(async excel => {
        const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '工号', '部门']
        // const filterVal = ['username', 'mobile', 'timeOfEntry', 'formOfEmployment', 'workNumber', 'departmentName']
        const list = await this.getAllList()
        // const data = this.formatJson(filterVal, list)
        const headers = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        const data = this.formatMyData(headers, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '员工目录表'
        })
      })
    },
    handleDownload1() {
      import('@/utils/Export2Excel').then(async excel => {
        const multiHeader = [['姓名', '主要信息', '', '', '', '部门']]
        const tHeader = ['', '手机号', '入职日期', '聘用形式', '工号', '']
        // const filterVal = ['username', 'mobile', 'timeOfEntry', 'formOfEmployment', 'workNumber', 'departmentName']
        const list = await this.getAllList()
        const merges = ['A1:A2', 'B1:E1', 'F1:F2']
        const headers = {
          '手机号': 'mobile',
          '姓名': 'username',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        const data = this.formatMyData(headers, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          merges,
          data,
          filename: '员工目录表'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return this.parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    async getAllList() {
      const res = await reqEmployeesList({ page: 1, size: this.total })
      return res.data.rows
    },
    formatMyData(headers, list) {
      // [{},{}]  => [[],[],[]]  将数组套对象的形式转换成数组套对象的形式
      return list.map((item) => {
        // item{username:'111',mobile:13546567890}
        return Object.keys(headers).map((key) => {
          if (headers[key] === 'formOfEmployment') {
            return item[headers[key]] === '1' ? '正式' : '非正式'
          } else {
            return item[headers[key]]
          }
        })
      })
    }
  }
}
</script>

<style>

</style>
