var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');

/* GET home page. */
router.get('/add', function(req, res, next) {
  res.render('add', { username: req.session.username });
});

// 发布文章
router.post('/publish', function(req, res, next) {
  var data = {
    username: req.session.username,
    title: req.body.title,
    content: req.body.content,
    time: Date.now()
  }
  // 执行文章存储
  model.connect(function(db) {
    db.collection('articles').insertOne(data)
    res.redirect('/')
  })
  // res.send(data)
});


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


module.exports = router;
