var express = require('express');
var router = express.Router();
var fs = require("fs");
/* GET home page. */
router.get('/', function(req, res, next) {
  var dir='./public/swagger';
  fs.readdir(dir,function(err,files){
    console.log(err,files)
    if (err) throw err;
    res.render('index', {files:files});
  });


});

module.exports = router;
