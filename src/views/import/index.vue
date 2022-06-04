<template>
  <div style="padding: 40px">
    <UploadExcel :on-success="success" />
  </div>
</template>
<script>
import { importEmployee } from '@/api/employees'

export default {
  name: 'Import',
  data() {
    return {
      list: []
    }
  },
  methods: {
    async success({ results }) {
      this.list = results
      const relations = {
        username: '姓名', // 姓名
        mobile: '手机号', // 手机号
        workNumber: '工号', // 工号
        timeOfEntry: '入职日期', // 入职时间
        correctionTime: '转正日期' // 转正时间
      }
      const arr = []
      results.forEach((item) => {
        const obj = {}
        Object.keys(item).forEach((key) => {
          for (const key1 in relations) {
            if (relations[key1] === key) {
              if (key1 === 'timeOfEntry' || key1 === 'correctionTime') {
                obj[key1] = new Date(this.formatDate(item[key], '-'))
              } else {
                obj[key1] = item[key]
              }
            }
          }
        })
        arr.push(obj)
      })
      await importEmployee(arr)
      this.$router.back()
    },
    formatDate(numb, format) {
      const old = numb - 1
      const t = Math.round((old - Math.floor(old)) * 24 * 60 * 60)
      const time = new Date(1900, 0, old, 0, 0, t)
      const year = time.getFullYear()
      const month = time.getMonth() + 1
      const date = time.getDate()
      return (
        year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>
<style scoped lang="scss">

</style>
