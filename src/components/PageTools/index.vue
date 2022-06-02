<template>
  <el-card class="page-tool">
    <el-row type="flex" align="middle" justify="space-between">
      <el-col style="display: flex;align-items: center">
        <div v-if="showBefore" class="before">
          <i class="el-icon-info" style="color: #579ff8;padding-right: 5px" />
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end" align="middle">
          <div class="after">
            <slot name="after" />
          </div>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  name: 'PageTools',
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }

}
</script>
<style scoped lang="scss">
.page-tool {
  .before {
    border: 1px solid skyblue;
    font-size: 14px;
    padding: 0 10px;
    background-color: #e8f6fe;
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
  }

  .after {
    display: flex;
    ::v-deep.el-button {
      margin: 0 5px;
    }
  }
}
</style>
