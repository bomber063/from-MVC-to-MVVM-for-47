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
#### 使用axios对AJAX的拦截器
* 首先用jQuery的DOM操作和html建立一个简单的页面
* 然后增加axios的**拦截器功能**
```
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```
* 这里的单词interceptor就是拦截器的意思。不过这里是复数。
* main.js增加代码
```
axios.interceptors.response.use(function(response){//拦截之后，用这个function来代替响应
  response.data={name:'bomber'}
  return response//函数记得返回信息
})

axios.get('/book/1')
  .then((response)=>{
  console.log(response.data)//这里就可以获取到response.data={name:'bomber'}
})
```
* **这样服务器都可以不用做了，前端部分就可以把响应写死了**
* 此时Jsbin上的[代码链接](https://jsbin.com/gawavogote/1/edit?html,js,output)
***
* 课程上使用 axios 的拦截器是在 jsbin.com 中进行的。
* 如果你在本地实验会发现拦截器不起作用，这是正常的。
* 如果想让本地的拦截器也起作用，就需要自己写 server.js 来响应所有请求。
***
* 本地我们需要给一个路由即可，比如前端的路由是
```
  axios.get('/book/1')
    .then((response)=>{
    console.log(response.data)
  })
```
* 后端给出一样的路由'/book/1'
```
else if(path='book/1'){
    response.statusCode = 200//这里需要写成200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write(`//如果被拦截这里的响应就不执行，而是执行前端自己写的响应代码
      {
        "error": "not found"
      }
    `)
    response.end()
  }
```
*   前端路径必须要一个点
```
axios.get('./book/1')//这里前面必须要一个.
    .then((response)=>{
    console.log(response.data)
  })
```
#### 前端部分根据不同的url，也就是路由来Mock(仿制)不同的数据
* 接下来我们前端部分也可以根据不同的url，也就是路径来Mock(仿制)不同的数据。
* 前端部分通过下面的代码可以拿到这个url，在response里面有一个config属性。config里面就有url的属性，不仅如此还有前端**请求，注意这里的data是请求的data，如果用post请求就会有这个data**，还有前端的请求方法method.
1. config里面就有url的属性
2. 如果用post,config里面还有前端的data.简单的说**response.data是后端响应的数据**,而**response.config.data是前端请求的数据**.
3. config里面还有前端的请求方法method
* 咱们前端代码就可以像后端一样通过if..else if...来写路由了
```
axios.interceptors.response.use(function(response){
  let config=response.config
  let {method,url,data}=config//这个data是请求的data
  if(url==='./book/1'&&method==='get'){
      response.data={name:'bomber'}
  }
  return response
})
  
  axios.get('./book/1')//这里前面必须要一个.
    .then((response)=>{
    console.log(response)
  })
```
* 此时如果改成axios.get('./book/2')，那么路径和和**伪造的路径不同**，那么就不会修改这个response了
### 接下来通过拦截器来修改前端的显示代码
* 前端通过占位符修改，到时需要替换这个占位符
```
  <div>
    书名：《__name__》
    数量：<span id='number'>__number__</span>
  </div>
```
* 把response.data修改下
```
      response.data={
        name:'Javascript高级程序设计',
        number:2,
        id:1//id代表路由的book/1也就是book后面这个1
      }
```
* 通过ES6的析构，前面写过[ES的析构博客](https://zhuanlan.zhihu.com/p/81667568)
```
//   let config=response.config
//   let {method,url,data}=config//这个data是请求的data
  let {config:{method,url,data}}=response//把前面两行代码所谓这一行代码
```
* 前端部分请求的代码
```
axios.get('./book/1')
  .then(({data})=>{//这里的{data}就是let data=response.data
  console.log(data)//这样就可以拿到前面的response.data
})
```
* 接下来需要用到jQuery的[html()](https://www.jquery123.com/html/),它可以获取集合中第一个匹配元素的HTML内容 或 设置每一个匹配元素的html内容。
* 代码修改为
```
axios.get('./book/1')
  .then(({data})=>{//这里的{data}就是let data=response.data
//   data=JSON.parse(data)
  let originalHtml=$('#app').html()//获取老的html
  let newHtml=originalHtml.replace('__name__',data.name)
    .replace('__number__',data.number)//修改占位符
  $('#app').html(newHtml)//这一步是设置新的html
})
```
* 此时我的代码因为监听的这个button被替换了为新的button了，也就是新的html.所以还需要用到[.on()](https://www.jquery123.com/on/)的委托事件的用法，就是
* **委派事件**的方法只有一个元素的事件处理程序，tbody，并且事件**只会向上冒泡一层**（从被点击的tr 到 tbody ）:
```
$("#dataTable tbody").on("click", "tr", function(event){
  alert($(this).text());
});
```
* 代码由
```
$('#addOne').on('click', function () {
  var oldNumber = $('#number').text()//他是一个字符串string
  var newNumber = oldNumber - 0 + 1//减0是为了把字符串转换为数字
  $('#number').text(newNumber)
})

$('#minusOne').on('click', function () {
  var oldNumber = $('#number').text()//他是一个字符串string
  var newNumber = oldNumber - 0 - 1//减0是为了把字符串转换为数字
  $('#number').text(newNumber)
})

$('#reset').on('click', function () {
  $('#number').text(0)
})
```
* 修改为
```
$('#app').on('click','#addOne',function(){//在点击#app里面带的任何元素的时候如果符合#addOne这个选择器就会执行下面的代码
  var oldNumber=$('#number').text()//他是一个字符串string
  var newNumber=oldNumber-0+1//减0是为了把字符串转换为数字
  $('#number').text(newNumber)
})

$('#app').on('click','#minusOne',function(){
  var oldNumber=$('#number').text()//他是一个字符串string
  var newNumber=oldNumber-0-1//减0是为了把字符串转换为数字
  $('#number').text(newNumber)
})

$('#app').on('click','#reset',function(){
  $('#number').text(0)
})
```
* **这样就算html替换了，还是可以产生事件效果。因为#app是始终没有变动，只是里面的内容更换了**可以实现+1-1和归零操作了。
* 目前为止的[jsbin链接](https://jsbin.com/foqeyipoqe/1/edit?js,output)