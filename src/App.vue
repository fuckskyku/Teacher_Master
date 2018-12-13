<template>
  <div id="app">
    <el-scrollbar :native="false">
      <router-view v-if="isRouterAlive"/>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      (this.isRouterAlive = false),
        this.$nextTick(function() {
          this.isRouterAlive = true;
        });
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  .el-scrollbar {
    width: 100%;
    height: 100%;
    .el-scrollbar__wrap {
      .el-scrollbar__view {
        height: 100%;
        // border: 1px solid red;
      }
      overflow-x: hidden;
      height: 100%;
    }
  }
}
</style>
