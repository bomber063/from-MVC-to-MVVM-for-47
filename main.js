axios.interceptors.response.use(function (response) {
  let config = response.config
  let { method, url, data } = config//这个data是请求的data
  if (url === './book/1' && method === 'get') {
    response.data={
      name:'Javascript高级程序设计',
      number:2,
      id:1//id代表路由的book/1也就是book后面这个1
    }
  }
  return response
})

axios.get('./book/1')
  .then(({ data }) => {//这里的{data}就是let data=response.data
    //   data=JSON.parse(data)
    let originalHtml = $('#app').html()//获取老的html
    let newHtml = originalHtml.replace('__name__', data.name)
      .replace('__number__', data.number)//修改占位符
    $('#app').html(newHtml)//这一步是设置新的html
  })

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