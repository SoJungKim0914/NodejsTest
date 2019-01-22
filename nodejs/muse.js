// var M = {
//   v:'v',
//   f:function(){
//     console.log(this.v);
//   }
// }


// 모듈을 가져올 때는 require
// 모듈하고 동일한 폴더이기 때문에 ./임
var part = require('./mpart.js');
// console.log(part);
// M.f();
part.f();
