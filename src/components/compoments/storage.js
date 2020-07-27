var storage={
    set(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    },
    get(key){
        return JSON.parse(localStorage.getItem(key))
    },
    remove(key){
        localStorage.removeItem(key)
    }
}
// 把这个js对象给暴露出去
export default storage;