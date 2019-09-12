axios.interceptors.response.use(function(response){
    response.data={name:'bomber'}
    return response
  })
  
  axios.get('./book/1')//这里前面必须要一个.
    .then((response)=>{
    console.log(response.data)
  })

$('#addOne').on('click',function(){
    var oldNumber=$('#number').text()//他是一个字符串string
    var newNumber=oldNumber-0+1//减0是为了把字符串转换为数字
    $('#number').text(newNumber)
  })
  
  $('#minusOne').on('click',function(){
    var oldNumber=$('#number').text()//他是一个字符串string
    var newNumber=oldNumber-0-1//减0是为了把字符串转换为数字
    $('#number').text(newNumber)
  })
  
  $('#reset').on('click',function(){
    $('#number').text(0)
  })