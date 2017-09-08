var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
var getUrls = require('get-urls')
var sanitize_url = require("sanitize-filename");
var crypto = require("crypto");
var recaptcha = require('express-recaptcha');
var config = require('../config.json');

//TODO: remove before making public
recaptcha.init('6LfssC8UAAAAAG-YHjwL7CKvjcaJTvNaGD3n8IGi', '6LfssC8UAAAAAHSRPYhyOwlDpHT5LS3VyRWCjHW7');

/* GET contact page. */
router.get('/', recaptcha.middleware.render, function(req, res, next) {

  res.render('contact', { 
  	title: 'Contact Us', 
  	description: 'Let us know if you need help!', 
  	modal: false,
  	form: true});
});

router.post('/', recaptcha.middleware.verify, function(req, res, next) {
	console.log(req.recaptcha);
	if (!req.recaptcha.error){
		urls = getUrls(req.body.message);
		console.log(urls)

	  	urls.forEach(function(link){
	  		console.log(link);
	  		var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			filename = crypto.createHash('sha1').update(current_date + random).digest('hex');
			filename = "screenshots/" + filename + ".png";
			console.log("Filename for screenshot is:" + filename);

			(async () => {
			  const browser = await puppeteer.launch();
			  const page = await browser.newPage();
			  await page.setCookie({name: config.flags.xss.name, value: config.flags.xss.flag, domain: config.domain, httpOnly: false, secure: false});
			  await page.setViewport({width: 1024, height: 768});
			  await page.goto(link);
			  await page.screenshot({path: filename});

			  browser.close();
			})();

	  	});
		res.render('contact', { 
			title: 'Contact Us', 
			description: 'Let us know if you need help!', 
			modal: true,
			modal_title: 'Thank you!',
			modal_body: 'We will get back to you as soon as possible',
			form: false});
	}else{
		res.render('contact', { 
			title: 'Contact Us', 
			description: 'Let us know if you need help!', 
			modal: true,
			modal_title: 'ERROR',
			modal_body: 'Please complete the Captcha!',
			form: true});
	}

});

module.exports = router;
