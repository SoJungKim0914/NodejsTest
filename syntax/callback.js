/*
function a() {
  console.log('A');
}
a();
*/

// 이름이 없는 함수를 익명함수라고 함.
// 자바스크립트에서는 함수가 값이 될 수 있음
var a = function(){
  console.log('A');
}
// a();

function slowfunc(callback){
  callback();
}
//slowfunc가 실행된 뒤 a를 callback으로 실행함
slowfunc(a);
