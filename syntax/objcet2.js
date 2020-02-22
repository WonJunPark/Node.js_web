//OOP(Object Oriented Programming)
//객체지향프로그래밍

//함수는 값이 될 수 있다.
var f = function(){
  console.log(1+1);
  console.log(1+2);
}

//배열에 함수 담기
var a = [f];
a[0]();

//객체에 함수 담기
var o = {
  func:f
}
o.func();
