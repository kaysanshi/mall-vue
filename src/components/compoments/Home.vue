<template>
    <div>
        <HomeComponets :title="title"></HomeComponets>
    </div>
</template>
<script>
import HomeComponets from './HomeCom'
/**
 * 1.引入组件
 * 
 * 2. 挂载组件
 * 
 * 3. 注册组件
 * 
 * 
 * 声明周期函数：组件挂载，更新，组件的销毁，触发的一些列的函数
 */
export default {
    data(){
        return{
            title:'我是父组件的值'
        }
    },
    components:{
        // 组件名称必须是字符，并且不可以和原有的冲突
        'HomeComponets':HomeComponets
    }
}
</script>
<style lang="less" scoped>

</style>