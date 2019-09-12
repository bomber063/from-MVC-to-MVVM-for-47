fakeData()

//上面是假的数据库后台

axios.get('./book/1')//这个请求是首次进入之后的替换代码
  .then(({ data }) => {//这里的{data}就是let data=response.data
    //   data=JSON.parse(data)
    let originalHtml = $('#app').html()//获取老的html
    let newHtml = originalHtml.replace('__name__', data.name)
      .replace('__number__', data.number)//修改占位符
    $('#app').html(newHtml)//这一步是设置新的html
  })

//下面的代码是点击加1或者减一或者归零后的代码
$('#app').on('click', '#addOne', function () {//在点击#app里面带的任何元素的时候如果符合#addOne这个选择器就会执行下面的代码
  var oldNumber = $('#number').text()//他是一个字符串string
  var newNumber = oldNumber - 0 + 1//减0是为了把字符串转换为数字
  // $('#number').text(newNumber)
  axios.put('./book/1', { number: newNumber })//前端请求传入的数据{number:newNumber}
    .then((response) => {
      //     response.number=newNumber
      $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
    })
})

$('#app').on('click', '#minusOne', function () {
  var oldNumber = $('#number').text()//他是一个字符串string
  var newNumber = oldNumber - 0 - 1//减0是为了把字符串转换为数字
  // $('#number').text(newNumber)
  axios.put('./book/1', { number: newNumber })//前端请求传入的数据{number:newNumber}
    .then((response) => {
      //     response.number=newNumber
      $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
    })
})

$('#app').on('click', '#reset', function () {
  // $('#number').text(0)
  axios.put('./book/1', { number: 0 })//前端请求传入的数据{number:0}
    .then((response) => {
      //     response.number=0
      $('#number').text(response.data.number)//response.data.number是后端（也就是数据库中）返回的数据的数量
    })
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