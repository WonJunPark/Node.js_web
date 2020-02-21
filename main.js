//C:\Bitnami\wampstack-7.3.13-0\apache2\nodejun

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function temp(title,list,body, control){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function temp_list(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      //메인 페이지 및 컨텐츠 페이지
      if(queryData.id === undefined){

        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = temp_list(filelist);
          var template = temp(title,list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href = "/create">create</a>`);
          response.writeHead(200);
          response.end(template);
        })


      } else {
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = temp_list(filelist);
            var template = temp(title,list,
              `<h2>${title}</h2><p>${description}</p>`,
              `<a href = "/create">create</a> <a href = "/update?id=${title}">update</a>`);
            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      //목록 생성 페이지로 이동
      fs.readdir('./data', function(error, filelist){
        var title = 'Web - create';
        var list = temp_list(filelist);
        var template = temp(title,list,`
          <form action = "/create_process" method = "post">
            <p><input type = "text" name = "title" placeholder="title"></p>
            <p><textarea name = "description" placeholder="description"></textarea></p>
            <p><input type = "submit"></p>
          </form>
        `,'');
        response.writeHead(200);
        response.end(template);
      });

    } else if(pathname === '/create_process'){
      // 새로운 목록을 생성해줌
      var body = '';
      request.on('data', function(data){
        body = body+data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        //create
        fs.writeFile(`data/${title}`,description,'utf8',function(err){
          //302 = redirection
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        });
      });


    } else if(pathname === '/update'){
      // 글 내용 업데이트
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = temp_list(filelist);
          var template = temp(title,list,
            `
            <form action = "/update_process" method = "post">
              <input type="hidden" name="id" value="${title}">
              <p><input type = "text" name = "title" placeholder="title" value="${title}"></p>
              <p><textarea name = "description" placeholder="description">${description}</textarea></p>
              <p><input type = "submit"></p>
            </form>
            `,
            `<a href = "/create">create</a> <a href = "/update?id=${title}">update</a>`);
          response.writeHead(200);
          response.end(template);
        });
      });

    } else {
      response.writeHead(404);
      response.end('Not found');
    }

});
app.listen(3000);
