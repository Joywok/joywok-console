var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var fs = require('fs');


var express = require('express');
var app = express();
var router = express.Router();

router.use('/load', function(req, res, next){
	console.log('请求了这个连接？？？？');
});

router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

gulp.task("serve",function(){
	browserSync({
   	notify: false,
   	server: {
      	baseDir: ['app'],
      	routes:{
	      	"/bower_components":"bower_components"
	      },
	      index: "index.html",
	      login: "login.html",
	      middleware:router
      }
  	});
	gulp.watch(['app/*.html'],reload);
	gulp.watch(['app/scripts/**/*.js'],reload);
})