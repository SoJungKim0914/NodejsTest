var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var templete = require('./lib/templete.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
// path는 query string을 포함한 전체 path를 불러옴
// pathname은 query string을 제외한 path를 불러옴
  // console.log(queryData.id);

  var ori_title = queryData.id;
  if (ori_title == undefined) {
    var title = ori_title;
  } else {
    var title = path.parse(ori_title).base;
  }

  // console.log(pathname);

  if (pathname === '/'){
    if (title === undefined) {
      // WEB 을 눌렀을 때 뜨는 제일 메인 화면
      fs.readdir('./data', function(error, filelist){
        // console.log(filelist);
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templete.list(filelist);
        var html = templete.html(title, list,
          `<h2>${title}</h2>${description}`, `<a href="/create">creat</a>`)

        response.writeHead(200);
        response.end(html);
        // response.end()괄호 안에 들어가는 것이 사용자에게 전달하는 데이터(페이지에 표시되는 것)
        // response.end(fs.readFileSync(__dirname + url));
      });
    } else {
      // 리스트 목록에 있는 파일 제목을 클릭했을 때 일어나는 일
      fs.readdir('./data', function(error, filelist){
        var list = templete.list(filelist);
        fs.readFile(`data/${title}`, 'utf8', function(err, description){
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
          var html = templete.html(title, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">creat</a>
            <a href="/update?id=${sanitizedTitle}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`)
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === '/create'){
    // create 버튼을 눌렀을 때 새로운 정보를 입력하는 화면
    fs.readdir('./data', function(error, filelist){
      // console.log(filelist);
      var title = 'Web - create';
      var list = templete.list(filelist);
      var html = templete.html(title, list, `
        <form action = "/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <!-- 전송 버튼이 생김 -->
            <!-- 버튼을 눌렀을 때 위의 내용을 queryString의 형태로 전송함 -->
            <input type="submit">
          </p>
        </form>
        `, '')
        //  http://localhost:3000/create_process 랑  /create_process 는 동일함
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === '/create_process'){
    //제출 버튼을 눌렀을 때 실행되는 페이지에서 일어나는 일
    var body = '';
    // 웹 브라우저가여러번에 나눠서 데이터를 전송하는데, 이 경우에 나눠진 data를 연결해주는 역할.
    // function은 콜백함수임.
    request.on('data', function(data){
        body = body + data;
    });
    // 더 이상 정보가 들어오지 않으면 end 다음에 오는 콜백함수를 호출하기로 약속되어 있음.
    request.on('end', function(){
      var post = qs.parse(body);
      // 정보를 객체화 하는 것이 가능해짐.
      var title = post.title;
      var description = post.description;
      // 파일 이름 : data 폴더 밑에 title이라는 이름으로
      // data는 description으로
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        // 사용자를 지금 생성한 뷰 페이지로 보냄 이걸 redirection 이라고 부름
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
      });
    });
  } else if (pathname === '/update') {
    // 업데이트하는 화면에서 보여지는 정보
    fs.readdir('./data', function(error, filelist){
      var list = templete.list(filelist);
      fs.readFile(`data/${title}`, 'utf8', function(err, description){
        var html = templete.html(title, list,
          `  <form action = "/update_process" method="post">
              <input type="hidden" name="id" value =${title}>
              <p><input type="text" name="title" placeholder="title" value =${title}></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <!-- 전송 버튼이 생김 -->
                <!-- 버튼을 눌렀을 때 위의 내용을 queryString의 형태로 전송함 -->
                <input type="submit">
              </p>
            </form>`,
            `<a href="/create">creat</a>
            <a href="/update?id=${title}">update</a>`)
            // input 태그의 기본 입력값은 value = 으로 넣어야 하고, textarea의 기본 입력값은 태그 사이에 집어넣으면 됨.
            // 수정할 파일의 이름을 id로 받을 수 있음.(hidden)
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === '/update_process') {
    //제출 버튼을 눌렀을 때 실행되는 페이지에서 일어나는 일
    var body = '';
    // 웹 브라우저가여러번에 나눠서 데이터를 전송하는데, 이 경우에 나눠진 data를 연결해주는 역할.
    // function은 콜백함수임.
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        //rename(이전이름, 바꿀이름,콜백함수)
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            });
        });

    });
  } else if (pathname === '/delete_process') {
    //delete 버튼을 눌렀을 때 실행되는 페이지에서 일어나는 일
    var body = '';
    // 웹 브라우저가여러번에 나눠서 데이터를 전송하는데, 이 경우에 나눠진 data를 연결해주는 역할.
    // function은 콜백함수임.
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`, function(error){
          // redirection
          response.writeHead(302, {Location: `/`});
          response.end();
        });
    });
  } else {
    // 오류 상황
    response.writeHead(404);
    response.end('Not found');
  }

});
app.listen(3000);
