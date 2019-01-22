var testFolder = './data';
//   ./ 는 현재 디렉토리라는 뜻. ./는 없어도 동일함
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
  console.log(filelist);
})
