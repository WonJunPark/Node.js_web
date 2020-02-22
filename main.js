//C:\Bitnami\wampstack-7.3.13-0\apache2\nodejun

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var temp = require('./lib/temp.js')
var path = require('path');
var sanitizeHtml = require('sanitize-html');

//refactoring

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
          var list = temp.list(filelist);
          var template = temp.html(title,list,
            `<h2>${title}</h2><p>${description}</p>`,
            `<a href = "/create">create</a>`);
          response.writeHead(200);
          response.end(template);
        })


      } else {
        fs.readdir('./data', function(error, filelist){
          //보안
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description,{
              allowedTags:['h1']
            });
            var list = temp.list(filelist);
            var template = temp.html(sanitizedTitle,list,
              `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
              `<a href = "/create">create</a>
              <a href = "/update?id=${sanitizedTitle}">update</a>
              <!-- post 방식 -->
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`);

            response.writeHead(200);
            response.end(template);
          });
        });
      }
    } else if(pathname === '/create'){
      //목록 생성 페이지로 이동
      fs.readdir('./data', function(error, filelist){
        var title = 'Web - create';
        var list = temp.list(filelist);
        var template = temp.html(title,list,`
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
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = temp.list(filelist);
          var template = temp.html(title,list,
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

    } else if(pathname === '/update_process'){
      // 글을 업데이트 해줌
      var body = '';
      request.on('data', function(data){
        body = body+data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`,`data/${title}`,function(error){
          fs.writeFile(`data/${title}`,description,'utf8',function(err){
            //302 = redirection
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          });
        })
      });

    } else if(pathname === '/delete_process'){
      // 글을 업데이트 해줌
      var body = '';
      request.on('data', function(data){
        body = body+data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`,function(error){
          response.writeHead(302, {Location: `/`});
          response.end();
        })

      });

    } else {
      response.writeHead(404);
      response.end('Not found');
    }

});
app.listen(3000);
