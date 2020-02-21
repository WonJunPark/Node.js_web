var fs = require('fs');

//readFileSync
//동기

/*
console.log('A');
var result = fs.readFileSync('syntax/sample.txt','utf8');
console.log(result);
console.log('C');
*/

//비동기
console.log('A');
//callback()
//return 값이 없음, 독립적으로 작동함
fs.readFile('syntax/sample.txt','utf8',function(err,result){
  console.log(result);
});
console.log(result);
console.log('C');
