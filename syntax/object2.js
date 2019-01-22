// 이 statement, 함수는 값임
var f = function(){
  console.log(1+1);
  console.log(1+2);
}

// 아래와 같이 적으면 오류가 남. 얘는 값이 될 수 없기 때문.
// var i = if (true){console.log(1);}

// 함수는 값이기 때문에, 아래와 같이 배열의 원소로 담을 수 있음.
var a = [f];
a[0]();
// 마찬가지로 object의 원소로도 담을 수 있음.
var o = {
  func:f
}
o.func();
