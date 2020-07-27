<template>
  <el-container class="home-contain">
    <!--头部的-->
    <el-header>
      <div>
        <img src />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--主题--->
    <el-container>
      <!--侧边栏--->
      <el-aside :width="isCollapse ? '50px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏区域  
        属性:router=true 简写=> router 是为这个主件开启路由模式是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
        :default-active 当前激活菜单的index
        :collapse-transition 是否开启折叠动画
        :active-text-color	当前激活菜单的文字颜色（仅支持 hex 格式）
        :text-color	菜单的文字颜色（仅支持 hex 格式）

        -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <el-submenu :index="item.id+''" v-for="(item, index) in menulist" :key="index">
            <template slot="title">
              <!--图标--->
              <i :class="iconsObj[item.id]"></i>
              {{item.authName}}
            </template>
            <!--二级菜单  加入点击事件 index就是一路由的跳转地址--->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id"  @click="saveNavState('/' + subitem.path)">
              <template slot="title">
                <!--图标--->
                <i class="el-icon-s-grid"></i>
                {{subitem.authName}}
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    // 创建时先默认到那个是激活de
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // // await 只能用于 async修饰的方法内部
    // 把返回的data 重命名为res
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200) return this.$message.error("获取列表失败");
      this.menulist = res.data;
      console.log(res);
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      // 把这个activePath存入到sessionStorage
      window.sessionStorage.setItem("activePath", activePath);
      // 重新把这个个激活的给赋值，这样就是使得激活状态切换
      this.activePath = activePath;
    },
    logout() {
      // 清除token并重新跳转到login
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>
<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  justify-content: space-between;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaeaea;
}
.home-contain {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>