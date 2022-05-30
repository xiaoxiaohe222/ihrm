<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ userInfo.username }}</div>
<!--    <PageTools :show-before="true">
          <template v-slot:before>
            <span>有0条考勤记录</span>
          </template>
          <template v-slot:after>
            <el-button size="mini" type="primary">导入</el-button>
            <el-button size="mini" type="danger">提醒</el-button>
            <el-button size="mini" type="danger">设置</el-button>
          </template>
        </PageTools>-->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapState('user', ['userInfo'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
