# from-MVC-to-MVVM-for-47
## 回忆MVC是什么及Axios
* 前面也有详细的关于MVC的[MVC-for-38](https://github.com/bomber063/MVC-for-38)和[object-oriented-programming-for-40](https://github.com/bomber063/object-oriented-programming-for-40)
* Vue是法语的View，所以法语的Vue是用来代替英语的View的
* 在[bootcdn](https://www.bootcdn.cn/)]上面直接搜索axios即可找到[Axios库](https://www.bootcdn.cn/axios/),Axios库是提供了AJAX库的功能的一个库
* 顺便也在bootcdn上引入[jQuery库](https://www.bootcdn.cn/jquery/)
### 在jQuery中的AJAX使用
* 你可以使用[jQuery.ajax()](https://www.jquery123.com/jQuery.ajax/)
```
jQuery.ajax(){
    url:'./x',
    method: "POST",//新版本的key是method,老版本，也就是中文版本里面这里用的key是type
}
```
* 你可以使用[jQuery.post()](https://www.jquery123.com/jQuery.post/)
```
jQuery.post('/xxx', { name: "John", time: "2pm" })
```
* 你还可以使用[jQuery.get()](https://www.jquery123.com/jQuery.get/)
```
jQuery.get('/xxx',{ name: "John", time: "2pm" })
```
### 在Axios中的AJAX使用
* Axios的[英文git hub链接](https://github.com/axios/axios),这个页面在最前面就写了
```
Promise based HTTP client for the browser and node.js
译文：基于Promise的HTTP浏览器和node.js的客户端
```
* Axios的[中文说明](https://www.kancloud.cn/yunye/axios/234845)
* 可以通过向 axios 传递相关配置来创建请求
```
* axios(config)
// 发送 POST 请求
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```
* axios(url[, config])
```
// 发送 GET 请求（默认的方法）
axios('/user/12345');
```
* 请求方法的别名
为方便起见，为所有支持的请求方法提供了别名
```
axios.request(config)
axios.get(url[, config])//jQuery只有get和post
axios.delete(url[, config])
axios.head(url[, config])
axios.post(url[, data[, config]])//jQuery只有get和post
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```
#### axios对比jQuery
1. axios用法几乎是照抄jQuery，但是axios有更多的**请求方法（更多功能和API）**，jQuery只有get和post。
2. 除了AJAX的功能更以外，就**没有其他功能了（更专注）**。比如jQuery还有操作DOM的方法等API。**但是操作DOM这块功能也被Vue代替了**，后面会讲到。
#### AJAX的劫持