//배열
var members = ['one','jun','hi'];

var i = 0;
while(i < members.length){
console.log(i,'loop : ',members[i]);
  i += 1
}

//객체
var roles = {
  'first' : 'one',
  'second' : 'jun',
  'third' : 'hi'
}

for(var name in roles){
  console.log('objcet =>',name);
  console.log('value =>',roles[name]);
}
