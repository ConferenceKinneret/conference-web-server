var express = require('express')
var app = express()

/**
 * setting up the templating view engine
 */ 
app.set('view engine', 'jade')

/**
 * import routes/index.js
 * import routes/users.js
 */ 
var index = require('./routes/index')
var users = require('./routes/users')
var buildConference = require('./routes/buildConference')
var showConference = require('./routes/showConference')


/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object
 */ 
var bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
	
	// Check if preflight request
	  if (req.method === 'OPTIONS') {
		  res.status(200);
		  res.end();
	  }
	  else {
		  next();
	  }
  });


app.use('/', index)
app.use('/user', users)
app.use('/build', buildConference)
app.use('/show', showConference)

module.exports = app
