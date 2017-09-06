var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
var getUrls = require('get-urls')
var sanitize_url = require("sanitize-filename");
var crypto = require("crypto");
var recaptcha = require('express-recaptcha');
recaptcha.init('6LfssC8UAAAAAG-YHjwL7CKvjcaJTvNaGD3n8IGi', '6LfssC8UAAAAAHSRPYhyOwlDpHT5LS3VyRWCjHW7');

/* GET contact page. */
router.get('/', recaptcha.middleware.render, function(req, res, next) {

  res.render('contact', { 
  	title: 'Contact Us', 
  	description: 'Let us know if you need help!', 
  	captcha: req.recaptcha});
});

router.post('/', recaptcha.middleware.verify, function(req, res, next) {

	if (!req.recaptcha.error){
		urls = getUrls(req.body.message);
		console.log(urls)

	  	urls.forEach(function(link){
	  		console.log(link);
	  		var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			filename = crypto.createHash('sha1').update(current_date + random).digest('hex');
			filename = "screenshots/" + filename + ".png";
			console.log(filename);
	  		
	   		//save_loc = 'screenshots/' + sanatize_url(link)
	   		// console.log(save_loc)

	  		(async () => {
			  const browser = await puppeteer.launch();
			  const page = await browser.newPage();
			  await page.setViewport({width: 1024, height: 768});
			  await page.goto(link);
			  await page.screenshot({path: filename});

			  browser.close();
			})();
	  	});
		res.render('contact', { 
			title: 'Contact Us', 
			description: 'Thank you for your submission!', 
			captcha: false});
	}else{
		res.render('contact', { 
			title: 'CAPTCHA FAILED!!!', 
			description: 'Thank you for your submission!', 
			captcha: false});
	}




});

module.exports = router;
