var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.header('X-XSS-Protection' , 0 );
	if(req.query.page){
		var page = req.query.page.substring(0,40);
	}else{
		console.log('Page variable does not exist');
	}
  res.render('index', { title: 'Buisness Casual', description: 'Social Investing for Startups', page: page });
});

module.exports = router;
