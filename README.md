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
* 目前为止的[jsbin链接](https://jsbin.com/foqeyipoqe/1/edit?js,output),做的比较简单的功能：
1. 先用axios拦截器拦截后。
2. 然后用它的AJAX获取数据。
3. 把获取到的数据替换到HTML里面去
4. 同时通过事件委托监听app的点击事件，如果点击的是addOne就+1，如果点击的是minusOne就-1，如果是reset就是归零。
* 目前为止+1-1归零的动作只是通过修改HTML上面的页面，所以并不是通过一种数据库的形式来更改，需要通过发请求来实现这个+1-1归零的动作的功能。
### 通过发请求（比如put请求）来实现+1-1归零的动作
* [put请求说明](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/PUT)
#### Object.assign()
* 这里先引入的一个新学习的API-[Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign),这个方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
* 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。也就是说属性被后续参数中具有相同属性的其他对象覆盖。
* 比如
```
var book={name:'bomber',number:1,id:2}
Object.assign(book,{name:'jack',number:2})
//下面是输出
{name: "jack", number: 2, id: 2}//name和number已经被覆盖了
```
* 还可以多次赋值
```
var book={name:'bomber',number:1,id:2}
Object.assign(book,{name:'jack'},{number:2})
//下面是输出
{name: "jack", number: 2, id: 2}
```
* 多次赋值并且有重复的
```
var book={name:'bomber',number:1,id:2}
Object.assign(book,{name:'jack',number:3},{number:2})
//下面是输出
{name: "jack", number: 2, id: 2}
```
#### 用Object.assign()修改使用的代码
* 仿造的后台修改的代码
```
let book={ 
    name:'Javascript高级程序设计',
    number:2,
    id:1//id代表路由的book/1也就是book后面这个1     
}
axios.interceptors.response.use(function(response){
//   let config=response.config
//   let {method,url,data}=config//这个data是请求的data
  let {config:{method,url,data}}=response//把前面两行代码所谓这一行代码
  
  if(url==='./book/1'&&method==='get'){
      response.data=book
  }
   else if(url==='./book/1'&&method==='put'){
     data=JSON.parse(response.config.data)//因为请求的数据response.config.data是一个字符串，所以要经过JSON.parse转换为对象
     Object.assign(book,data)//因为本身就会返回给目标对象book,所以不用赋值给book了
     response.data=book
     console.log(data)
  }
  
  return response
})
```
* 前面说过response.data时后台的数据，也可以说是数据库中的数据，而response.url.data是前端请求发送过来的数据
* 所以前端的页面代码部分发请求部分的代码修改为
```
  $('#app').on('click','#addOne',function(){//在点击#app里面带的任何元素的时候如果符合#addOne这个选择器就会执行下面的代码
    var oldNumber=$('#number').text()//他是一个字符串string
    var newNumber=oldNumber-0+1//减0是为了把字符串转换为数字
    // $('#number').text(newNumber)
    axios.put('./book/1',{number:newNumber})//前端请求传入的数据{number:newNumber}
    .then((response)=>{
  //     response.number=newNumber
         $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
    })
  })
  
  $('#app').on('click','#minusOne',function(){
    var oldNumber=$('#number').text()//他是一个字符串string
    var newNumber=oldNumber-0-1//减0是为了把字符串转换为数字
    // $('#number').text(newNumber)
    axios.put('./book/1',{number:newNumber})//前端请求传入的数据{number:newNumber}
    .then((response)=>{
  //     response.number=newNumber
         $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
    })
  })
  
  $('#app').on('click','#reset',function(){
    // $('#number').text(0)
    axios.put('./book/1',{number:0})//前端请求传入的数据{number:0}
    .then((response)=>{
  //     response.number=0
         $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
    })
  })
```
* 修改后的[jsbin代码链接](https://jsbin.com/ruyaduvuxo/1/edit?js,output)
* 不过目前的代码像意大利面条一样的代码，也就是长短不一，错综复杂。
### 引入MVC(MVC思想来重构代码)
* 在引入MVC之前先把伪造的后台及数据库包装成函数调用形式
```
fakeData()

function fakeData() {
  let book = {
    name: 'Javascript高级程序设计',
    number: 2,
    id: 1//id代表路由的book/1也就是book后面这个1     
  }

  axios.interceptors.response.use(function (response) {
    let config = response.config
    let { method, url, data } = config//这个data是请求的data
    if (url === './book/1' && method === 'get') {
      response.data = book
    }
    else if (url === './book/1' && method === 'put') {
      data = JSON.parse(response.config.data)//因为请求的数据response.config.data是一个字符串，所以要经过JSON.parse转换为对象
      Object.assign(book, data)//因为本身就会返回给目标对象book,所以不用赋值给book了
      response.data = book
    }
    return response
  })
}
```
* MVC思想就是三块代码M（数据），V（可视化的部分）,C（逻辑控制部分），详细见前面的链接——[MVC-for-38](https://github.com/bomber063/MVC-for-38)和(object-oriented-programming-for-40)[https://github.com/bomber063/object-oriented-programming-for-40]
#### model主要跟数据有关（数据本身，获取数据，更新数据等）
* model部分
```
let model={
  data:{
    name:'',
    number:0,
    id:''
  },
  fetch:function(id){//获取数据
    return axios.get(`./book/${id}`)//这个是把axios返回出去
    .then((response)=>{//这里的response如果下面要用这里必须传进来作为参数
      this.data=response.data
      return response//这个response是返回给axios
    })
  },
  updata:function(data,id){//更新数据
    return axios.put(`./book/${id}`,data)//这个是把axios返回出去
    .then((response)=>{//这里的response如果下面要用这里必须传进来作为参数
      this.data=response.data
      return response//这个response是返回给axios
    })
  }
}
```
* 获取数据和更新数据修改的部分
```
// axios.get('./book/1')//这个请求是首次进入之后的替换代码
model.fetch(1)

// axios.put('./book/1', { number: newNumber })//前端请求传入的数据{number:newNumber}
model.updata({number:newNumber},1)

// axios.put('./book/1', { number: 0 })//前端请求传入的数据{number:0}
model.updata({number:0},1)
```

* 注意的地方
1. return 返回两次，一次是then后面的函数的返回，也就是返回repsonse，一次是axios
2. 
```
      $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
     //这里用$('#number').text(model.data.number)也是可以的，因为前面已经赋值了
```
3. .then((response) => {//这里的response如果下面要用这里必须传进来作为参数
4. .then(({ data }) => {//这里的{data}就是let data=response.data，这里没有传入response，所以不能使用response
* jsbin代码目前为止的[链接](https://jsbin.com/gahatuvaqo/1/edit?js,output)
#### 接下来增加view，所有跟html相关的都由view来做（比如html中的某个元素，元素的内容等）
* view部分
```
let view={
  el:'#app',//某个元素
  //元素里面的内容
  template:`
    <div>
    书名：《__name__》
    数量：<span id='number'>__number__</span>
    </div>
    <div>
      <button id='addOne'>加1</button>
      <button id='minusOne'>减1</button>
      <button id='reset'>归零</button>
    </div>`,
  //render意思就是初始化渲染页面的DOM，将template里面的节点解析成DOM
  render(data){//这里也可以写成render:function(data){}接受一个字符串渲染到#app里面去
    let html=this.template.replace('__number__',data.number)
    .replace('__name__',data.name)//因为有占位符需要替换
    $(this.el).html(html)
  }
}
```
* 获取数据和更新数据修改的部分
```
    // $('#app').html(newHtml)//这一步是设置新的html
    view.render(model.data)//这里其实就是response.data

    // $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
    view.render(model.data)//这里其实就是response.data
```
* 注意的地方：
1. view里面有某个元素比如el:#app,元素的内容，就是template，render函数，render意思就是初始化页面的DOM，将template里面的节点解析成DOM。
2. render的数据从model中来，所以当model获取和升级数据的成功后就来操作这个view，也就是view.render(model.data)
3. 这样就可以把替换占位符的操作放到view里面实现了。
* 目前为止的[JSBIN链接](https://jsbin.com/jatehuneqi/1/edit?js,output)
#### 最后一个也就是逻辑控制controller(主要是JS来实现控制view和model)
* controller
```
let controller = {
  init(options) {
    },
  bindEvents(view,model) {
  }
```
* controller里面的init函数
```
  init(options) {
      let {
        view, model
      } = options
      this.view = view
      this.model = model
      this.model.fetch(1)
        .then(() => { //这里的{data}就是let data=response.data，这里没有传入response，所以不能使用response
          this.view.render(this.model.data) //这里其实就是response.data
        })
      this.bindEvents(view,model)//这个需要把view和model传进来
    },
```
* controller里面绑定事件函数bindEvents
```
bindEvents(view,model) {
      //下面的都是绑定事件，所以this会被改变，所以上面需要把view和model传进来
      $(view.el).on('click', '#addOne', function() {
        var oldNumber = $('#number').text() //他是一个字符串string
        var newNumber = oldNumber - 0 + 1 //减0是为了把字符串转换为数字
        model.updata({
            number: newNumber
          }, 1)
          .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
            view.render(model.data) //这里其实就是response.data
          })
      }),
      $(view.el).on('click', '#minusOne', function() {
        var oldNumber = $('#number').text() //他是一个字符串string
        var newNumber = oldNumber - 0 - 1 //减0是为了把字符串转换为数字
        model.updata({
            number: newNumber
          }, 1)
          .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
           view.render(model.data) //这里其实就是response.data
          })
      }),
      $(view.el).on('click', '#reset', function() {
        model.updata({
            number: 0
          }, 1)
          .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
            view.render(model.data) //这里其实就是response.data
          })
      })
    }
```
* 最后调用controller里面的init函数
```
controller.init({
  view: view,
  model: model
})
```
* 这还可以继续优化，把绑定事件函数里面的函数有三个，可以把这三个单独拿出来放到controller里面
```
addOne(){},
minusOne(){},
reset(){},
    bindEvents(view,model) {
      //下面的代码是点击加1或者减一或者归零后的代码
      //下面的都是绑定事件，所以this会被改变，所以上面需要把view和model传进来
      $(view.el).on('click', '#addOne', this.addOne.bind(this))//因为绑定事假年后this会改变，所以bind(this)为了不让this改变
      $(view.el).on('click', '#minusOne', this.minusOne.bind(this))
      $(view.el).on('click', '#reset', this.reset.bind(this))
    }
```
* 可以不用通过传参数的形式，比如bindEvents(view,model)可以写成bindEvents()，因为不是绑定事件里面的this可以是controller，所以this没有改变，改变了的this,比如绑定事件的this用bind(this)。
* init函数里面的bindEvents
```
    this.bindEvents()
```
* addOne()，minusOne()，reset()里面可以使用this来代替controller，**只列出了增加了this的地方，可删除传入参数的地方,其他部分代码删除**
```
let controller = {
  init(options) {
    this.bindEvents()
  },
  addOne() {
    this.model.updata({
      number: newNumber
    }, 1)
      .then((response) => { 
        this.view.render(this.model.data) //这里其实就是response.data
      })
  },
  minusOne() {
    this.model.updata({
      number: newNumber
    }, 1)
      .then((response) => { 
        this.view.render(this.model.data) //这里其实就是response.data
      })
  },
  reset() {
    this.model.updata({
      number: 0
    }, 1)
      .then((response) => { 
        this.view.render(this.model.data) 
      })
  },
  bindEvents() {
    $(this.view.el).on('click', '#addOne', this.addOne.bind(this)),//因为绑定事假年后this会改变，所以bind(this)为了不让this改变
    $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this)),
    $(this.view.el).on('click', '#reset', this.reset.bind(this))
  }
}
```
* 注意的地方
1. controller是来控制view和model的。所以要把view和model传进来。
2. 绑定事件也需要传进来，**因为绑定事件会改变this，所以this需要bind(this)，或者用箭头函数，或者直接把view和model传进里面去，比如bindEvents(view,model)**
3. controller里面的函数是简化的写法，应该说是ES6的写法，**比如addOne(){}相当于addOne:function(){}**
4. 当this不会改变的时候是可以使用this的，如果this会改变就需要传入参数进来，或者绑定this，比如bind(this)
* 目前为止的[jsbin链接](https://jsbin.com/goxurafubo/1/edit?js,output)
#### 小结一下目前MVC做了什么
1. 首先一个model来初始数——data，然后获取数据fetch，然后更新数据updata
2. 然后是一个view来拿到一个元素#app，然后这个元素里面的template，也就是具体内容是什么，然后有一个render，他就是用来渲染出页面,render意思就是初始化页面的DOM，将template里面的节点解析成DOM。
3. 最后是controller，它会把view和model都记在自己的下面，然后render初始第一次渲染这个页面，也就是初始化页面的DOM，然后获取第一个本书，this.model.fetch(1)也就是给通过某个路径请求成功后的初次渲染页面
4. 然后再controller里面绑定了事件——bindEvents,这里的绑定事件需要绑定一个this，，如果不bind，那么this就会改变为交互的某个元素，绑定了this之后，也就是bind(this)，这样可以保证this不会被改变。也就是当前的controller。
## 把共同属性用构造函数写在一起，优化代码
* 这里只修改model和view。
* controller太多了，所以暂时不修改
* 这里用到了new构造，之前有学习和总结过，如果忘记可以看前面的[记录——object-oriented-programming-for-40](https://github.com/bomber063/object-oriented-programming-for-40),或者[老师的博客](https://zhuanlan.zhihu.com/p/23987456)
### model部分
* model的构造函数
```
function Model(options,resource){//创建一个构造函数
  console.log(this)
 this.data=options.data//这个数据是特有的数据所以单独写在这里，这里数据可能是书本可能是车辆。
 this.resource=options.resource//这个resource有可能是书book,有可能是车car
}
```
* 原型上的代码
```
Model.prototype.fetch=function(id) { //在原型上面获取数据
  return axios.get(`./${this.resource}/${id}`) //这个是把axios返回出去，这里的book其实也是变量。
    .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
      this.data = response.data
      return response //这个response是返回给axios
    })
}

Model.prototype.updata=function(data, id) { //在原型上面更新数据
  return axios.put(`./${this.resource}/${id}`, data) //这个是把axios返回出去
    .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
      this.data = response.data
      return response //这个response是返回给axios
    })
}
```
* 用new创建并传参调用的代码
```
let model=new Model({//这里创建了new，也就是做了四步。1.创建一个临时对象，并用this指向这个临时对象
//2.把this绑定了实例对象model
//3.this的共有属性叫做prototype  
//4.return这个this
data: {
  name: '',
  number: 0,
  id: ''
},
resource:'book'
})//这样我们每次声明一个model代码就简化为只需要两个属性，一个data，一个resource
```
* 目前为止的[jsbin链接](https://jsbin.com/sowehomoje/1/edit?js,output)
### view部分
* view构造函数的代码
```
function View(options){
  this.el=options.el
  this.template=options.template
//   el: el, //某个元素
//   //元素里面的内容
//   template: template
}
```
* view原型上的代码
```
View.prototype.render=function(data){
  //render意思就是初始化渲染页面的DOM，将template里面的节点解析成DOM
   //这里也可以写成render:function(data){}接受一个字符串渲染到#app里面去
  let html = this.template.replace('__number__', data.number)
    .replace('__name__', data.name) //因为有占位符需要替换
  $(this.el).html(html)
}
```
* 用new创建并传参调用的代码
```
let view=new View({  
  el: '#app', //某个元素
  //元素里面的内容
  template: `
    <div>
    书名：《__name__》
    数量：<span id='number'>__number__</span>
    </div>
    <div>
      <button id='addOne'>加1</button>
      <button id='minusOne'>减1</button>
      <button id='reset'>归零</button>
    </div>`
})
```
* 目前为止的[JSbin链接](https://jsbin.com/niwatehora/1/edit?js,output)
#### 用for in循环来代替
* 修改前
```
View.prototype.render=function(data){
   let html = this.template.replace('__number__', data.number)
     .replace('__name__', data.name) //因为有占位符需要替换
  $(this.el).html(html)
}
```
* 修改后
```
View.prototype.render=function(data){
  // let html = this.template.replace('__number__', data.number)
    // .replace('__name__', data.name) //因为有占位符需要替换
    let html=this.template
    for (let key in data){
      html=html.replace(`__${key}__`,data[key])//因为this.template是保持不变的，所以需要传给一个变量才可以，不然每次开始的时候都是没有替换过的
      //这里的data.key就是等于data.['key']的写法，这里的key是一个变量，不是一个字符串，写成字符串就得不到要的结果
    }
  $(this.el).html(html)
}
```
* 目前为止的[JSbin链接](https://jsbin.com/wevaginodu/1/edit?js,output)
#### 犯错导致BUG了半天才修复 
* **这里我犯了2个错误导致BUG了半天**
1. for in循环的时候，因为this.template是保持不变的，所以需要传给一个变量才可以，不然每次开始的时候都是没有替换过的。
2. for in循环的时候，这里的data.key就是等于data.['key']的写法，这里的key是一个变量，不是一个字符串，写成字符串就得不到要的结果了
* 之前的博客[《JS 历史、数据类型、对象、typeof》](https://zhuanlan.zhihu.com/p/59302839)有说明过

### 小结
* new构造函数主要做了下面的事情
1. 创建一个临时对象，并用this指向这个临时对象
2. 把this绑定了实例对象model
3. this的共有属性叫做prototype  
4. return这个this
## Vue的引入
* 在[bootcdn]搜索Vue就可以找到啦。我们使用vue.min.js，因为这个比较小。
* 然后把它放到script标签里面就好了。
### 接下来把MVC变成MVVM的Vue
* 首先是可以删除掉View的类部分，也就是view的原型及构造函数部分，也就是这部分可以删除
```
function View(options){
  this.el=options.el
  this.template=options.template
}

View.prototype.render=function(data){
    let html=this.template
    for (let key in data){
      html=html.replace(`__${key}__`,data[key])
    }
  $(this.el).html(html)
}
```
#### Vue的一些特点
* 前三个特点
1. 然后把new View变成new Vue,然后__name__要变成{{name}}(它的标记需要用到两个大括号)，这个标记每个库可以指定，并也可以随机配置。
2. 并且它强制要求把数据。比如data传给Vue,不要传给Model，因为Vue需要这个data（数据）初始化这个template,这里的render也不需要了。
3. template必须只有一个根元素，如果有两个根元素，Vue只会看**第一个根元素**，后面的不会在看了。**如果有多个根元素，就在最外面在套一个div就可以啦**
* View的代码原来是
```
let view=new View({  
el: '#app', //某个元素
//元素里面的内容
template: `
  <div>
  书名：《__name__》
  数量：<span id='number'>__number__</span>
  </div>
  <div>
    <button id='addOne'>加1</button>
    <button id='minusOne'>减1</button>
    <button id='reset'>归零</button>
  </div>`
})
```
* 更改为Vue之后就变成
```
let view=new Vue({  

  el: '#app', //某个元素
  data:{
    name: '未命名',
    number: 0,
    id: ''
  },
  template: `
  <div>
    <div>
    书名:《{{name}}》
    数量:<span id='number'>{{number}}</span>
    </div>
    <div>
      <button id='addOne'>加1</button>
      <button id='minusOne'>减1</button>
      <button id='reset'>归零</button>
    </div>
  <div>
`
})
```
#### Vue没有render的特点
* 没有render，说明**不需要手动第一次初始化页面了**。那么如果**再次获取页面或者更新**渲染初始化页面呢？直接用this.view就好了，因为Vue可以根据data（数据）自动变化，自动初始化，自动渲染页面，至于怎么做到这个render的暂时先不说明，目前只是明白怎么从传统的MVC变成Vue的MVVM，**但是需要注意一点就是，它会把data里面的所有属性升级到view上面来更改，也就是说如果是this.view.data.name应该直接写成this.view.name**
* 简单的理解就是只要你去修改data里面的name,id,number,那么HTML会自动更新。不用去render初始化或者渲染页面了。
* 比如代码应该修改为
```
      this.model.fetch(1)
        .then(() => { //这里的{data}就是let data=response.data，这里没有传入response，所以不能使用response
//           this.view.render(this.model.data) //render的第一次初始化页面可以删除
        this.view.name=this.model.data.name
        this.view.number=this.model.data.number
        this.view.id=this.model.data.id
        })
```
* 如果我们需要需要View，也就是更新页面。上面的变化就是：
> * MVC上是view.render(model.data)，你把model上的数据（data）给view，然后用render函数去更新HTML就好了
> * 而使用Vue之后，就不用去管render了，也就是不用去考虑怎么初始化页面了，只需要更新view的data,也就是view.data，然后这个view.data会自动更新HTML
> * 也就是把MVC的render函数变成了Vue之后的简单赋值操作。
* 所以我们看下就知道，Vue就是MVC做了一下升级。搞清楚MVC的前提再去学Vue就相对简单很多。
#### 把三个赋值变成一个赋值
* 只需要用一个对象把这些数据都包裹起来，然后来取这个新的对象即可，代码修改为,但是对应的{{}},也就是双大括号里面的取值也需要对应修改。
* Vue里面data修改为
```
  data:{
    book:{
    name: '未命名',
    number: 0,
    id: ''
   }
  },
```
* Vue里面的双大括号修改为
```
    <div>
    书名:《{{book.name}}》
    数量:<span id='number'>{{book.number}}</span>
    </div>
```
* 最后的赋值由前面的三行变成了一行
```
        this.view.book=this.model.data
```
#### Vue不会整个刷新页面，只会局部修改需要修改的地方
* 如果使用了Vue，可以对比下这个[JSbin链接](https://jsbin.com/hekolalefu/1/edit?js,output)，里面有一个延迟函数会使number变成10,这里只是局部渲染。虽然这里的view是控制整个#app这个子节点，但是更新的只有这个number为10的局部变化。也就是template里面的{{book.number}}。
```
          setTimeout(()=>{
            this.view.book.number=10
          },5000)
```
* 但是如果没有使用Vue，对比前面的[Jsbin链接](https://jsbin.com/wevaginodu/1/edit?js,output),点击加1或者减1或者归零会导致整个#app这个子节点都改变了。因为这里的view是控制整个#app这个子节点。
#### Vue还可以更厉害更多功能，可以把controller都省掉
* controller最重要的一件事就是绑定事件——bindEvents，省去controller的bindEvents之后**代替的是在Vue上面写上methods**。
* 这个三个点击事件
```
  bindEvents() {
    $(this.view.el).on('click', '#addOne', this.addOne.bind(this)),
    $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this)),
    $(this.view.el).on('click', '#reset', this.reset.bind(this))
  }
```
* Vue里面的template的html的三个元素的id
```
    <div>
      <button id='addOne'>加1</button>
      <button id='minusOne'>减1</button>
      <button id='reset'>归零</button>
    </div>
```
* 上面的三个点击事件和三个元素的id由这个代替
```
      <button v-on:click='addOne'>加1</button>
      <button v-on:click='minusOne'>减1</button>
      <button v-on:click='reset'>归零</button>
```
* 还需要第一步初始化[created()](https://cn.vuejs.org/v2/api/#created),在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。**简单的说就是组件创建成功之后的操作**
```
  created(){
    model.fetch(1)
    .then(()=>{
      this.book=model.data
    })
  }
```
* Vue里面的所有this.model，都修改为model，因为这里的model是一个变量，而不是由controller传进来的this下面的属性。
* number的操作也不需要DOM来操作，只需要修改data里面的数据即可，比如原来是
```
         var oldNumber = $('#number').text() //他是一个字符串string
         var newNumber = oldNumber - 0 + 1 //减0是为了把字符串转换为数字
        this.model.updata({
             number: newNumber
          }, 1)
```
* 修改为
```
        model.updata({//这里的this删除掉了
              number:this.book.number+1
          }, 1)
```
* render函数也修改为赋值操作
```
             this.view.render(this.model.data) 
```
* 修改为
```
             this.book=model.data
```
* 目前的大致流程就是
1. 一旦创建了组件就会执行created(){}函数里面的内容，就是请求第一本书的自动初始化赋值this.book=model.data，name,id,number都会变成新的。**页面自动更新，不需要管render这件事**
2. 然后点击加1的过程就是 

   1. 因为vue已经给加1这个button绑定了addOne,所以当你点击加1就会调用addOne
   ```
         <button v-on:click='addOne'>加1</button>
   ```
   2. addOne就是vue里面的methods里面的addOne，他会updata数据然后通过this.book.number+1,然后把这个数据复制给book，也就是this.book=model.data
   3. 基本上都是在做**赋值（有新的数据就赋值给this.book）和取值（直接用this.book.number）这两件事**。 
* vue的好处就是让以前的MVC更加智能，节省了很多不需要写的东西(比如操作DOM，render和controller等，controller合并到Vue里面去了)，因为Vue已经帮我们实现了，
* 目前为止的[Jsbin链接](https://jsbin.com/lunovogeji/1/edit?js,output)

## 其他
* 关于MVVC的博客——[什么是MVVM，MVC和MVVM的区别，MVVM框架VUE实现原理](http://baijiahao.baidu.com/s?id=1596277899370862119&wfr=spider&for=pc)


