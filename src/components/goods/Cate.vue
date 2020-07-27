<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row :gutter="50">
        <el-col :span="12">
          <!-- clearable 是清空文本空-->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getCategoriesList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getCategoriesList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格  vue-table-tree-grid --->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index  index-text="#" border style="margin:15px">
        <!-- 是否有效  slot就是定义的模板的名称 其实就是个插槽-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeditcatedialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCategory(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!---分页--->
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addCateDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader props.expandedTrigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable props.checkeStrictly>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑分类--->
    <el-dialog title="修改分类名称" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editCateFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      queryInfo: {
        query: "",
        type: 3,
        pagesize: 5,
        pagenum: 1
      },
      catelist: [],
      total: 0,
      // 为table定义列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok"
        },
        {
          label: "排序",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order"
        },
        {
          label: "操作",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "opt"
        }
      ],
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],

      editDialogVisible:false,
      editForm:[],
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    async getCategoriesList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      console.log(res);
      if (res.meta.status != 200)
        return this.$message.error("获取商品分类失败");

      // 将获取到的数据列表赋值给catelist
      this.catelist = res.data.result;
      this.total = res.data.total;
      console.log(res)
    },
    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategoriesList();
    },
    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCategoriesList();
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }

      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        console.log(res)
        this.$message.success('添加分类成功！')
        this.getCategoriesList()
        this.addDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

    async showeditcatedialog(id){
       // console.log(id)
      const { data: res } = await this.$http.get('categories/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询信息信息失败！')
      }
      // 将查询到数据进行赋值给修改的form表单中  
      this.editForm = res.data
      this.editDialogVisible=true

    },
    editCateInfo(){

    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()

    },
    async deleteCategory(scope) {
       const confirmResult = await this.$confirm(
        '此操作将永久删除用户:'+row.cat_name +'吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败！')
      }

      this.$message.success('删除分类成功！')
      this.getCategoriesList()
    },
  }
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>