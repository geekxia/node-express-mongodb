var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');
var multiparty = require('multiparty');
// var upload = multer({ dest: '/uploads/' })
var fs = require('fs');

/* GET home page. */
router.get('/writing', function(req, res, next) {
  var time = req.query.time
  console.log('写文章页面', time)
  if (time) {
    time = parseInt(time)
    model.connect(function(db) {
      db.collection('articles').findOne({time: time}, function(err, docs) {
        console.log('docs', docs)
        docs.timeZH = moment(docs.time).format('YYYY-MM-DD HH:mm:ss')
        res.render('writing', {username: req.session.username, item: docs})
      })
    })
  } else {
    var item = {
      time: '',
      title: '',
      content: ''
    }
    res.render('writing', { username: req.session.username, item: item });
  }
});

// 发布文章
router.post('/publish', function(req, res, next) {
  var time = req.body.time
  var data = {
    username: req.session.username,
    title: req.body.title,
    content: req.body.content,
  }
  if (time) {  // 编辑
    data.time = parseInt(time)
    model.connect(function(db){
      db.collection('articles').updateOne({time: data.time}, {$set: {
        title: data.title,
        content: data.content
      }}, function(err, ret) {
        if (err) {
          console.log(err)
        } else {
          // 修改成功
          res.redirect('/')
        }
      })
    })
  } else {  // 添加
    data.time = Date.now()
    // 执行文章存储
    model.connect(function(db) {
      db.collection('articles').insertOne(data)
      res.redirect('/')
    })
  }

  // res.send(data)
});

// 删除文章
router.get('/delete', function(req, res, next) {
  var time = parseInt(req.query.time)
  model.connect(function(db) {
    db.collection('articles').deleteOne({time: time}, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log('删除成功')
        res.redirect('/')
      }
    })
  })
})


// 详情页
router.get('/detail', function(req, res, next) {
  var time = parseInt(req.query.time)
  model.connect(function(db) {
    db.collection('articles').findOne({time: time}, function(err, docs) {
      console.log('docs', docs)
      docs.timeZH = moment(docs.time).format('YYYY-MM-DD HH:mm:ss')
      res.render('detail', {username: req.session.username, item: docs})
    })
  })
})
// 图片上传
router.post('/upload', function(req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log('文件上传错误：', err)
    } else {
      console.log('fields', fields)
      var file = files.filedata[0]
      console.log(file)
      // return
      var newPath = '/upload/'+file.originalFilename
      var frs = fs.createReadStream(file.path)
      var fws = fs.createWriteStream('./public'+newPath)
      frs.pipe(fws)
      fws.on('close', function() {
        res.send('{"err":"","msg":"'+newPath+'"}')
      })
    }
  })
})


module.exports = router;
