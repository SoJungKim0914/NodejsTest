var fs = require('fs');

//readFileSync
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');



// 비동기적인 방법
console.log('A');
//파일 읽는 작업이 끝나면 function의 두 번째 parameter에 파일 내용을 인자로 집어넣음.
// 오류가 있으면 err에 집어넣음
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
    console.log(result);
});
console.log('C');
// 결과는 A,C,B 가 됨. 파일을 읽어오기 전에 밑에가 먼저 실행된 것.
