/*
function a(){
  console.log('A');
}
*/

//익명 함수, 함수 = 값
var a = function(){
  console.log('A');
}

function slowfunc(callback){
  callback();
}

slowfunc(a);
