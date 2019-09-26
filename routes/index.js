var express = require('express');
var router = express.Router();
var model = require('../model');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  var page = req.query.page || 1
  console.log('page', page)
  model.connect(function(db) {
    db.collection('articles').find().toArray(function(err, docs) {
      // 进行分页查询
      model.connect(function(db) {
        // 分页查询，sort() skip() limit()
        db.collection('articles').find().sort({_id: -1}).skip((page-1)*2).limit(2).toArray(function(err, docs2) {
          docs2.map(function(ele, idx) {
            ele.timeZH = moment(ele.time).format('YYYY-MM-DD HH:mm:ss')
          })
          var data = {
            total: Math.ceil(docs.length / 2),  // 总页面数
            list: docs2   // 当前页的数据
          }
          res.render('list', { username: req.session.username, data: data });
        })
        })
    })
  })
});


// 渲染注册页面
router.get('/regist', function(req, res, next) {
  res.render('regist')
})

// 渲染登录页面
router.get('/login', function(req, res, next) {
  res.render('login')
})

// 退出登录
router.get('/logout', function(req, res, next) {
  req.session.username = null
  res.redirect('/login')
})

module.exports = router;
