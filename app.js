//app.js
const net = require('./utils/lib/net');
App({
  onLaunch: function () {
  },
  globalData: {
    
  },
  /*
  统一滚动借口请求
  url:请求路径String，queryData:请求数据Object(注：请求的页数字段名必须是pageIndex)，fn:回调函数Function，pass:是否可以请求的状态Boolean*/
  scrollAjax(url, queryData, fn, pass,total){
    console.log(pass)
    if (pass){
      net.request({
        url,
        data: queryData,
        success(res, backTotal) {
          if (total + queryData.pageSize < backTotal) {
            let page = queryData.pageIndex+1;
            /*请求后的回调函数res:返回数据Object；true||false：是否进行下次请求Boolean；page：请求页数Number;*/
            fn(res, true, page)
          }else{
            fn(res, false, queryData.pageIndex)
          }
        }
      });
    }
  },
})