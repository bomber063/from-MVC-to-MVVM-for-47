fakeData()

//上面是假的数据库后台
function Model(options,resource){//创建一个构造函数
  console.log(this)
 this.data=options.data//这个数据是特有的数据所以单独写在这里，这里数据可能是书本可能是车辆。
 this.resource=options.resource//这个resource有可能是书book,有可能是车car
}

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

function View(options){
  this.el=options.el
  this.template=options.template
//   el: el, //某个元素
//   //元素里面的内容
//   template: template
}

View.prototype.render=function(data){
  //render意思就是初始化渲染页面的DOM，将template里面的节点解析成DOM
   //这里也可以写成render:function(data){}接受一个字符串渲染到#app里面去
  // let html = this.template.replace('__number__', data.number)
    // .replace('__name__', data.name) //因为有占位符需要替换
    let html=this.template
    for (let key in data){
      html=html.replace(`__${key}__`,data[key])//因为this.template是保持不变的，所以需要传给一个变量才可以，不然每次开始的时候都是没有替换过的
      //这里的data.key就是等于data.['key']的写法，这里的key是一个变量，不是一个字符串，写成字符串就得不到要的结果
    }
  $(this.el).html(html)
}
//上面是MVC的类，下面是对象，对象是从类里面派生出来的。

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

let view=new Vue({  

  el: '#app', //某个元素
  //元素里面的内容
  data:{
    book:{
      name: '未命名',
      number: 0,
      id: ''
    },
    n:1
  },
  template: `
  <div>
    <div>
    书名:《{{book.name}}》
    数量:<span id='number'>{{book.number}}</span>
    </div>
    <div>
     <input v-model='n'>
     <span>
       N的值是{{n}}
     </span>
    </div>
    <div>
      <button v-on:click='addOne'>加N</button>
      <button v-on:click='minusOne'>减N</button>
      <button v-on:click='reset'>归零</button>
    </div>
  <div>
`,
created(){
  model.fetch(1)
  .then(()=>{
    this.book=model.data
  })
},
methods:{
  addOne() {
    // var oldNumber = $('#number').text() //他是一个字符串string
    // var newNumber = oldNumber - 0 + 1 //减0是为了把字符串转换为数字
    model.updata({
      number: this.book.number+(this.n-0)
    }, 1)
      .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
        //     response.number=newNumber
        // this.view.render(this.model.data) //这里其实就是response.data
        this.book=model.data
        //       $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
        //这里用$('#number').text(model.data.number)也是可以的，因为前面已经赋值了
      })
  },
  minusOne() {
    // var oldNumber = $('#number').text() //他是一个字符串string
    // var newNumber = oldNumber - 0 - 1 //减0是为了把字符串转换为数字
    //   $('#number').text(newNumber)
    model.updata({
      number: this.book.number-(this.n-0)
    }, 1)
      .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
        //     response.number=newNumber
        // this.view.render(this.model.data) //这里其实就是response.data
        this.book=model.data
        //        $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
        //这里用$('#number').text(model.data.number)也是可以的，因为前面已经赋值了
      })
  },
  reset() {
    //   $('#number').text(0)
    model.updata({
      number: 0
    }, 1)
      .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
        //     response.number=0
        // this.view.render(this.model.data) //这里其实就是response.data
        this.book=model.data
        //        $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
        //这里用$('#number').text(model.data.number)也是可以的，因为前面已经赋值了
      })
  },
}
})

// let controller = {
//   init(options) {
//     let {
//       view, model
//     } = options
//     this.view = view
//     this.model = model
//     this.model.fetch(1)
//       .then(() => { //这里的{data}就是let data=response.data，这里没有传入response，所以不能使用response
//         //   data=JSON.parse(data)
//         //   let data=response.data
//         //   console.log(data)
//         //   let originalHtml=$('#app').html()//获取老的html
//         //   let newHtml=originalHtml.replace('__name__',data.name)
//         //     .replace('__number__',data.number)//修改占位符
//         //   $('#app').html(newHtml)//这一步是设置新的html
//         // this.view.render(this.model.data) //这里其实就是response.data
//         // this.view.name=this.model.data.name
//         // this.view.number=this.model.data.number
//         // this.view.id=this.model.data.id
//         this.view.book=this.model.data
//       })
//     this.bindEvents()
//   },
//   addOne() {
//     var oldNumber = $('#number').text() //他是一个字符串string
//     var newNumber = oldNumber - 0 + 1 //减0是为了把字符串转换为数字
//     this.model.updata({
//       number: newNumber
//     }, 1)
//       .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
//         //     response.number=newNumber
//         this.view.render(this.model.data) //这里其实就是response.data
//         //       $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
//         //这里用$('#number').text(model.data.number)也是可以的，因为前面已经赋值了
//       })
//   },
//   minusOne() {
//     var oldNumber = $('#number').text() //他是一个字符串string
//     var newNumber = oldNumber - 0 - 1 //减0是为了把字符串转换为数字
//     //   $('#number').text(newNumber)
//     this.model.updata({
//       number: newNumber
//     }, 1)
//       .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
//         //     response.number=newNumber
//         this.view.render(this.model.data) //这里其实就是response.data
//         //        $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
//         //这里用$('#number').text(model.data.number)也是可以的，因为前面已经赋值了
//       })
//   },
//   reset() {
//     //   $('#number').text(0)
//     this.model.updata({
//       number: 0
//     }, 1)
//       .then((response) => { //这里的response如果下面要用这里必须传进来作为参数
//         //     response.number=0
//         this.view.render(this.model.data) //这里其实就是response.data
//         //        $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
//         //这里用$('#number').text(model.data.number)也是可以的，因为前面已经赋值了
//       })
//   },
//   bindEvents() {
//     //下面的代码是点击加1或者减一或者归零后的代码
//     $(this.view.el).on('click', '#addOne', this.addOne.bind(this)),//因为绑定事假年后this会改变，所以bind(this)为了不让this改变
//     $(this.view.el).on('click', '#minusOne', this.minusOne.bind(this)),
//     $(this.view.el).on('click', '#reset', this.reset.bind(this))
//   }
// }

controller.init({
  view: view,
  model: model
})

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