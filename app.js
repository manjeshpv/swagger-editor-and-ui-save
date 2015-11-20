var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs= require('fs');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


app.use('/api/swagger', function(req,res,next){
  res.render("swagger",{name:"properties"})
});

app.post('/services', function(req, res) {

  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }

  var body = '';
  filePath = __dirname + '/public/data.txt';
  name = req.body.name;
  if(!name.endsWith("yaml")){
    name = name+".yaml"
  }
  file = JSON.parse(req.body.file);

  console.log("yaml",file.yaml)
  if(file){
    var wstream = fs.createWriteStream('public/swagger/'+name);
    wstream.write(file.yaml);
    wstream.end();
  }

  res.json({code:200})


});
app.get('/services/:filename', function(req,res,next){
  var filename = req.params.filename;
  console.log(filename)
  var dir='./public/swagger';
  fs.readFile(dir+'/'+filename, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    res.send(JSON.stringify({"yaml":data}));

  });
});

app.get('/services', function(req,res,next){
  var dir='./public/swagger';
  fs.readdir(dir,function(err,files){
    console.log(err,files)
    if (err) throw err;
    res.json(files);
  });
});


app.use('/api/:id(*.json)', function(req,res,next){

  var fs = require("fs");
  var filename = "swagger.json";

  fs.readFile(filename, "utf8", function(err, data) {
    if (err) throw err;
    console.log(JSON.parse(data));
    res.json(JSON.parse(data))
  });

});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
