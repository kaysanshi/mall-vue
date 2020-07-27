<template>
    <div> 
        <div>{{title}}</div>
        <!-- 可以这样使用 事件--->
        <input type="text" v-model="todo" @keydown="add1($event)"/>

        <input type="text" v-model="todo" @keyup.enter="add"/>
        <button @click="add" >添加</button>
        <div>
            <h2>进行中</h2>
            <ul>
                <li v-for="(item,key) in list" :key="key" nn  v-if="!item.checked">
                    <input type="checkbox"  v-model="item.checked" @change="savelist()">{{item.title}}<button @click="revers(item)">完成</button>
                </li>
            </ul>
        </div>
        <div>
            <h2>已完成</h2>
            <ul>
                <!--- item,index  index是获取到这个list索引---->
                <li v-for="(item,key) in list" :key="key" v-if="item.checked">
                    <!--v-model来绑定到value中--->
                    <input type="checkbox" v-model="item.checked" @change="savelist()">{{item.title}}<button @click="remove(key)">删除</button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>

// 引入方法
import storage from './storage.js'

export default {
   
    data(){
        
        return{
            todo:'',
            list:[{
                title:'顶顶顶顶',
                checked:false,
            },{
                title:'hahh',
                checked:true,
            }]
        }

    },
    props:['title'],
    components:{

    },
    methods:{
        add(){
            this.list.push({title:this.todo,checked:false})
            this.todo=''
        },
        add1(event){
            console.log(event)
            if (event.keyCode==13){
                this.list.push({title:this.todo,checked:false})
                this.todo=''
            }
            // 在这个地方进行设置到localStorage
            localStorage.setItem('key',JSON.stringify(this.list))
        
        },
        remove(item) {

            this.list.splice(item,1)
            localStorage.setItem('key',JSON.stringify(this.list))
        },
        savelist(){
            // localStorage.setItem('key',JSON.stringify(this.list))
            storage.set('key',this.list)
        }
    },
    // 创建vm实例时
    mounted() {
            // vue 刷新页面就会触发的方法
            var list=JSON.parse(localStorage.getItem('key'))
            if(list){
                this.list=list
            }
    },
}
</script>
<style scoped>

</style>